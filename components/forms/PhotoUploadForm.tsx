"use client";

import { useActionState } from "react";
import {
  uploadProfilePhoto,
  type ActionState,
} from "@/lib/actions/profile-media";
import { ui } from "@/lib/ui";
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
          className="w-28 h-28 rounded-2xl object-cover border border-ink/10 shadow-card"
        />
      )}
      <form action={formAction} className="space-y-3">
        <input type="hidden" name="business_profile_id" value={businessProfileId} />
        <input
          type="file"
          name="photo"
          accept="image/jpeg,image/png,image/webp"
          required
          className={ui.file}
        />
        <p className={ui.hint}>JPG, PNG או WEBP - עד 5MB</p>
        {state.error && <p className={ui.error} role="alert">{state.error}</p>}
        {state.success && <p className={ui.success} role="status">התמונה עודכנה!</p>}
        <SubmitButton>
          {currentPhotoUrl ? "החלפת תמונה" : "העלאת תמונה"}
        </SubmitButton>
      </form>
    </div>
  );
}
