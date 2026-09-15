"use client";

import { PhoneVerification } from "@/components/auth/PhoneVerification";

export default function VerifyPhonePage() {
  // In a real app, this would come from registration state or URL params
  const phoneNumber = "+1234567890";

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--muted)] p-4">
      <div className="w-full max-w-md">
        <PhoneVerification phoneNumber={phoneNumber} />
      </div>
    </div>
  );
}
