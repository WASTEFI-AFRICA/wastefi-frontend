"use client";

import { useState } from "react";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { useRouter } from "next/navigation";
import { FileText, CheckCircle2 } from "lucide-react";

/**
 * Terms Acceptance Component
 * Display and accept terms and conditions
 */

export function TermsAcceptance() {
  const [accepted, setAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleAccept = async () => {
    if (!accepted) return;

    setIsLoading(true);
    
    // Simulate API call to complete registration
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Navigate to dashboard
    router.push("/dashboard");
    
    setIsLoading(false);
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-[var(--primary)]/10 flex items-center justify-center">
            <FileText className="w-8 h-8 text-[var(--primary)]" />
          </div>
        </div>
        <CardTitle className="text-center">Terms & Conditions</CardTitle>
        <p className="text-center text-sm text-[var(--muted-foreground)]">
          Please review and accept our terms to continue
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Terms Content */}
        <div className="max-h-96 overflow-y-auto p-4 rounded-lg border border-[var(--border)] bg-[var(--muted)]/30 space-y-4 text-sm">
          <div>
            <h3 className="font-semibold text-base mb-2">1. Acceptance of Terms</h3>
            <p className="text-[var(--muted-foreground)]">
              By using WasteFi, you agree to be bound by these terms and conditions. If you do not agree to these terms, please do not use the service.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-base mb-2">2. Waste Collection Services</h3>
            <p className="text-[var(--muted-foreground)]">
              WasteFi connects waste collectors with collection points. All waste must be properly sorted and prepared according to collection point guidelines.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-base mb-2">3. Payment Terms</h3>
            <p className="text-[var(--muted-foreground)]">
              Payments are processed based on verified collections. Rates vary by material type and collection point. Payments are subject to verification and may take 1-3 business days to process.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-base mb-2">4. Account Responsibilities</h3>
            <p className="text-[var(--muted-foreground)]">
              You are responsible for maintaining the confidentiality of your account credentials. You must provide accurate information and update it as necessary.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-base mb-2">5. Prohibited Activities</h3>
            <p className="text-[var(--muted-foreground)]">
              Users must not engage in fraudulent activities, submit false information, or attempt to manipulate the platform for unauthorized benefits.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-base mb-2">6. Data Privacy</h3>
            <p className="text-[var(--muted-foreground)]">
              We collect and process your personal data in accordance with our Privacy Policy. Your data is used to facilitate waste collection services and payments.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-base mb-2">7. Termination</h3>
            <p className="text-[var(--muted-foreground)]">
              WasteFi reserves the right to suspend or terminate accounts that violate these terms or engage in fraudulent activities.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-base mb-2">8. Changes to Terms</h3>
            <p className="text-[var(--muted-foreground)]">
              WasteFi may update these terms at any time. Continued use of the service constitutes acceptance of updated terms.
            </p>
          </div>
        </div>

        {/* Acceptance Checkbox */}
        <div className="flex items-start gap-3 p-4 rounded-lg border border-[var(--border)] bg-[var(--background)]">
          <button
            type="button"
            onClick={() => setAccepted(!accepted)}
            className="flex-shrink-0 mt-0.5"
          >
            <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
              accepted
                ? "bg-[var(--primary)] border-[var(--primary)]"
                : "border-[var(--border)]"
            }`}>
              {accepted && <CheckCircle2 className="w-4 h-4 text-white" />}
            </div>
          </button>
          <label
            htmlFor="terms-checkbox"
            className="text-sm cursor-pointer"
            onClick={() => setAccepted(!accepted)}
          >
            I have read and agree to the{" "}
            <span className="text-[var(--primary)] font-medium">Terms and Conditions</span>
            {" "}and{" "}
            <span className="text-[var(--primary)] font-medium">Privacy Policy</span>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleAccept}
            disabled={!accepted}
            loading={isLoading}
          >
            Accept & Continue
          </Button>
          <Button
            variant="outline"
            size="lg"
            fullWidth
            onClick={() => router.push("/login")}
          >
            Decline
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
