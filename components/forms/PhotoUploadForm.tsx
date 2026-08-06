"use client";

import { useActionState } from "react";
import {
  uploadProfilePhoto,
  type ActionState,
} from "@/lib/actions/profile-media";
import { SubmitButton } from "@/components/ui/SubmitButton";

const initialState: ActionState = { success: false };

export function PhotoUploadForm({
  businessProfileId,
  currentPhotoUrl,
}: {
  businessProfileId: string;
  currentPhotoUrl: string | null;
}) {
  const [state, formAction] = useActionState(uploadProfilePhoto, initialState);

  return (
    <div className="space-y-3">
      {currentPhotoUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={currentPhotoUrl}
          alt="תמונת הפרופיל שלך"
          className="w-28 h-28 rounded-full object-cover border border-gray-200"
        />
      )}
      <form action={formAction} className="space-y-2">
        <input type="hidden" name="business_profile_id" value={businessProfileId} />
        <input
          type="file"
          name="photo"
          accept="image/jpeg,image/png,image/webp"
          required
          className="block w-full text-sm text-gray-600 file:me-3 file:rounded-lg file:border-0 file:bg-slate-900 file:px-3 file:py-2 file:text-white file:text-sm hover:file:bg-slate-800"
        />
        <p className="text-xs text-gray-400">JPG, PNG או WEBP - עד 5MB</p>
        {state.error && <p className="text-sm text-red-600">{state.error}</p>}
        {state.success && <p className="text-sm text-green-700">התמונה עודכנה!</p>}
        <SubmitButton>
          {currentPhotoUrl ? "החלפת תמונה" : "העלאת תמונה"}
        </SubmitButton>
      </form>
    </div>
  );
}
