"use client";

import { useActionState } from "react";
import {
  uploadProfileDocument,
  type ActionState,
} from "@/lib/actions/profile-media";
import { SubmitButton } from "@/components/ui/SubmitButton";

const initialState: ActionState = { success: false };

export function DocumentUploadForm({
  businessProfileId,
}: {
  businessProfileId: string;
}) {
  const [state, formAction] = useActionState(uploadProfileDocument, initialState);

  return (
    <form action={formAction} className="space-y-2">
      <input type="hidden" name="business_profile_id" value={businessProfileId} />
      <input
        type="file"
        name="document"
        accept="application/pdf,image/jpeg,image/png"
        required
        className="block w-full text-sm text-gray-600 file:me-3 file:rounded-lg file:border-0 file:bg-blue-800 file:px-3 file:py-2 file:text-white file:text-sm hover:file:bg-blue-900"
      />
      <p className="text-xs text-gray-400">PDF, JPG או PNG - עד 5MB לקובץ</p>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state.success && <p className="text-sm text-green-700">הקובץ הועלה!</p>}
      <SubmitButton>הוספת מסמך</SubmitButton>
    </form>
  );
}
