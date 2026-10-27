"use client";

import { useActionState } from "react";
import {
  uploadProfileDocument,
  type ActionState,
} from "@/lib/actions/profile-media";
import { ui } from "@/lib/ui";
import { SubmitButton } from "@/components/ui/SubmitButton";

const initialState: ActionState = { success: false };

export function DocumentUploadForm({
  businessProfileId,
}: {
  businessProfileId: string;
}) {
  const [state, formAction] = useActionState(uploadProfileDocument, initialState);

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="business_profile_id" value={businessProfileId} />
      <input
        type="file"
        name="document"
        accept="application/pdf,image/jpeg,image/png"
        required
        className={ui.file}
      />
      <p className={ui.hint}>PDF, JPG או PNG - עד 5MB לקובץ</p>
      {state.error && <p className={ui.error} role="alert">{state.error}</p>}
      {state.success && <p className={ui.success} role="status">הקובץ הועלה!</p>}
      <SubmitButton>הוספת מסמך</SubmitButton>
    </form>
  );
}
