import { describe, it, expect, vi, beforeEach } from "vitest";

// Same approach as quotes.test.ts - no real database or Storage here. These
// tests force Storage and DB failures on purpose, which a real Supabase
// project can't be made to do on demand, to prove the actions never leave
// a public file behind that no record points to (or that the owner was told
// is deleted).
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("@/lib/supabase/server", () => ({ createClient: vi.fn() }));

import { createClient } from "@/lib/supabase/server";
import { uploadProfileDocument, deleteProfileDocument } from "./profile-media";

const mockedCreateClient = createClient as unknown as ReturnType<typeof vi.fn>;

const PROFILE_ID = "11111111-1111-4111-8111-111111111111";
const FILE_URL = `https://x.supabase.co/storage/v1/object/public/public-media/${PROFILE_ID}/documents/1-cert.pdf`;

// `dbResults` is a queue consumed by each awaited DB query in order, like
// the mock in quotes.test.ts. Storage calls are separate spies so each test
// can decide whether upload/remove succeeds and then check what was called.
function makeMock(opts: {
  dbResults: unknown[];
  uploadError?: { message: string } | null;
  removeError?: { message: string } | null;
}) {
  let i = 0;
  const next = () => opts.dbResults[i++];
  const rowDelete = vi.fn();
  const builder = {
    select: () => builder,
    eq: () => builder,
    insert: () => builder,
    delete: () => {
      rowDelete();
      return builder;
    },
    maybeSingle: () => Promise.resolve(next()),
    then: (resolve: (v: unknown) => void) => resolve(next()),
  };
  const upload = vi.fn().mockResolvedValue({ error: opts.uploadError ?? null });
  const remove = vi.fn().mockResolvedValue({ data: [], error: opts.removeError ?? null });
  const storageBucket = {
    upload,
    remove,
    getPublicUrl: (path: string) => ({
      data: { publicUrl: `https://x.supabase.co/storage/v1/object/public/public-media/${path}` },
    }),
  };
  const client = {
    auth: { getUser: () => Promise.resolve({ data: { user: { id: "user-1" } } }) },
    from: () => builder,
    storage: { from: () => storageBucket },
  };
  return { client, upload, remove, rowDelete };
}

function documentForm() {
  const fd = new FormData();
  fd.set("business_profile_id", PROFILE_ID);
  fd.set("document", new File(["%PDF-1.4 test"], "cert.pdf", { type: "application/pdf" }));
  return fd;
}

beforeEach(() => {
  mockedCreateClient.mockReset();
});

describe("uploadProfileDocument - no orphaned files", () => {
  it("removes the uploaded file when saving its database record fails", async () => {
    const { client, upload, remove } = makeMock({
      dbResults: [
        { data: { id: PROFILE_ID } }, // ownership check
        { error: { message: "insert failed" } }, // business_profile_documents insert
      ],
    });
    mockedCreateClient.mockResolvedValue(client);

    const result = await uploadProfileDocument({ success: false }, documentForm());

    expect(result.success).toBe(false);
    expect(upload).toHaveBeenCalledTimes(1);
    // The exact path that was uploaded must be the one rolled back.
    const uploadedPath = upload.mock.calls[0][0];
    expect(remove).toHaveBeenCalledWith([uploadedPath]);
  });

  it("does not insert a record when the upload itself fails", async () => {
    const { client, remove } = makeMock({
      dbResults: [{ data: { id: PROFILE_ID } }],
      uploadError: { message: "storage down" },
    });
    mockedCreateClient.mockResolvedValue(client);

    const result = await uploadProfileDocument({ success: false }, documentForm());

    expect(result.success).toBe(false);
    expect(remove).not.toHaveBeenCalled(); // nothing was uploaded, nothing to clean
  });

  it("keeps the file when both upload and record succeed", async () => {
    const { client, remove } = makeMock({
      dbResults: [{ data: { id: PROFILE_ID } }, { error: null }],
    });
    mockedCreateClient.mockResolvedValue(client);

    const result = await uploadProfileDocument({ success: false }, documentForm());

    expect(result).toEqual({ success: true });
    expect(remove).not.toHaveBeenCalled();
  });
});

describe("deleteProfileDocument - never report success while the file is still reachable", () => {
  it("fails and keeps the record when Storage removal fails", async () => {
    const { client, remove, rowDelete } = makeMock({
      dbResults: [{ data: { id: "doc-1", file_url: FILE_URL } }],
      removeError: { message: "storage down" },
    });
    mockedCreateClient.mockResolvedValue(client);

    const result = await deleteProfileDocument("doc-1");

    expect(result.success).toBe(false);
    expect(remove).toHaveBeenCalledWith([`${PROFILE_ID}/documents/1-cert.pdf`]);
    // The row delete was never reached, so the document stays in the
    // owner's list and she can retry.
    expect(rowDelete).not.toHaveBeenCalled();
  });

  it("reports failure when the file was removed but the record delete fails", async () => {
    const { client } = makeMock({
      dbResults: [
        { data: { id: "doc-1", file_url: FILE_URL } },
        { error: { message: "delete failed" } },
      ],
    });
    mockedCreateClient.mockResolvedValue(client);

    const result = await deleteProfileDocument("doc-1");

    expect(result.success).toBe(false);
  });

  it("removes the file before the record, and succeeds when both work", async () => {
    const order: string[] = [];
    const { client, remove, rowDelete } = makeMock({
      dbResults: [{ data: { id: "doc-1", file_url: FILE_URL } }, { error: null }],
    });
    remove.mockImplementation(async () => {
      order.push("storage");
      return { data: [], error: null };
    });
    rowDelete.mockImplementation(() => order.push("row"));
    mockedCreateClient.mockResolvedValue(client);

    const result = await deleteProfileDocument("doc-1");

    expect(result).toEqual({ success: true });
    expect(order).toEqual(["storage", "row"]);
  });

  it("reports 'not found' for a document that isn't the user's (RLS returns no row)", async () => {
    const { client, remove } = makeMock({ dbResults: [{ data: null }] });
    mockedCreateClient.mockResolvedValue(client);

    const result = await deleteProfileDocument("someone-elses-doc");

    expect(result).toEqual({ success: false, error: "המסמך לא נמצא" });
    expect(remove).not.toHaveBeenCalled();
  });
});
