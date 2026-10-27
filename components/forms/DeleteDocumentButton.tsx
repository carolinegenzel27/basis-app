"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  deleteProfileDocumentAction,
  type ActionState,
} from "@/lib/actions/profile-media";

const initialState: ActionState = { success: false };

function DeleteSubmit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="text-sm font-semibold text-red-600 hover:underline shrink-0 disabled:opacity-50"
    >
      {pending ? "מוחק..." : "מחיקה"}
    </button>
  );
}

// Shows the error inline if the file couldn't be removed. On failure the
// document deliberately stays in the list, so the owner can just retry.
export function DeleteDocumentButton({ documentId }: { documentId: string }) {
  const [state, formAction] = useActionState(deleteProfileDocumentAction, initialState);

  return (
    <form action={formAction} className="flex flex-col items-end gap-1 shrink-0">
      <input type="hidden" name="document_id" value={documentId} />
      <DeleteSubmit />
      {state.error && <p className="text-xs text-red-600" role="alert">{state.error}</p>}
    </form>
  );
}
