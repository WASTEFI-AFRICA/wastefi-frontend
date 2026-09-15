"use client";

import { useState, useRef, useEffect } from "react";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { useRouter } from "next/navigation";
import { Phone } from "lucide-react";

/**
 * Phone Verification Component
 * OTP verification for phone number
 */

interface PhoneVerificationProps {
  phoneNumber: string;
}

export function PhoneVerification({ phoneNumber }: PhoneVerificationProps) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();

    // Countdown timer for resend
    const timer = setInterval(() => {
      setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    const newOtp = [...otp];
    
    for (let i = 0; i < pastedData.length; i++) {
      if (/^\d$/.test(pastedData[i])) {
        newOtp[i] = pastedData[i];
      }
    }
    
    setOtp(newOtp);
  };

  const handleVerify = async () => {
    const otpValue = otp.join("");
    
    if (otpValue.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Navigate to terms
      router.push("/terms");
    } catch (err) {
      setError("Invalid verification code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;

    // Simulate resend
    await new Promise((resolve) => setTimeout(resolve, 500));
    setResendTimer(60);
    setOtp(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-[var(--primary)]/10 flex items-center justify-center">
            <Phone className="w-8 h-8 text-[var(--primary)]" />
          </div>
        </div>
        <CardTitle className="text-center">Verify Your Phone</CardTitle>
        <p className="text-center text-sm text-[var(--muted-foreground)]">
          Enter the 6-digit code sent to
        </p>
        <p className="text-center font-semibold text-[var(--foreground)]">
          {phoneNumber}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* OTP Input */}
          <div className="flex gap-2 justify-center">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-12 h-14 text-center text-2xl font-semibold rounded-md border-2 border-[var(--border)] bg-[var(--background)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none transition-all"
              />
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-sm text-[var(--error)] text-center">{error}</p>
          )}

          {/* Verify Button */}
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleVerify}
            loading={isLoading}
          >
            Verify Code
          </Button>

          {/* Resend Code */}
          <div className="text-center">
            <p className="text-sm text-[var(--muted-foreground)]">
              Didn't receive the code?{" "}
              {resendTimer > 0 ? (
                <span className="font-medium">Resend in {resendTimer}s</span>
              ) : (
                <button
                  onClick={handleResend}
                  className="text-[var(--primary)] font-medium hover:underline"
                >
                  Resend Code
                </button>
              )}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
