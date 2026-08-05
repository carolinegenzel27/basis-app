import { OnboardingForm } from "@/components/forms/OnboardingForm";

export default function OnboardingPage() {
  return (
    <div className="max-w-lg mx-auto p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">ברוכה הבאה ל-Basis</h1>
        <p className="text-gray-600 mt-1">
          כמה פרטים בסיסיים על העסק שלך - זה ימלא לך אוטומטית את שאר המערכת.
        </p>
      </div>
      <OnboardingForm />
    </div>
  );
}
