"use client";

import { Shield, Eye, MapPin, Trash2, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, Button } from "@/components/ui";

/**
 * Privacy Settings
 * Configure privacy and security preferences
 */

interface PrivacySettingsProps {
  onExportData?: () => void;
  onDeleteAccount?: () => void;
}

export function PrivacySettings({ onExportData, onDeleteAccount }: PrivacySettingsProps) {
  return (
    <div className="space-y-6">
      {/* Data & Privacy */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Data & Privacy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Eye className="w-5 h-5 text-[var(--primary)] mt-0.5" />
              <div>
                <p className="font-medium">Data Collection</p>
                <p className="text-sm text-[var(--muted-foreground)]">
                  We collect data to improve your experience and provide personalized services.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[var(--primary)] mt-0.5" />
              <div>
                <p className="font-medium">Location Services</p>
                <p className="text-sm text-[var(--muted-foreground)]">
                  Location data is used to find nearby collection points and track submissions.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Data Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Export Data */}
          <div className="flex items-center justify-between py-3 border-b border-[var(--border)]">
            <div className="flex items-start gap-3 flex-1">
              <div className="w-10 h-10 rounded-lg bg-[var(--info)]/10 flex items-center justify-center flex-shrink-0">
                <Download className="w-5 h-5 text-[var(--info)]" />
              </div>
              <div>
                <p className="font-medium">Export Your Data</p>
                <p className="text-sm text-[var(--muted-foreground)]">
                  Download a copy of your personal data
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={onExportData}>
              Export
            </Button>
          </div>

          {/* Delete Account */}
          <div className="flex items-center justify-between py-3">
            <div className="flex items-start gap-3 flex-1">
              <div className="w-10 h-10 rounded-lg bg-[var(--error)]/10 flex items-center justify-center flex-shrink-0">
                <Trash2 className="w-5 h-5 text-[var(--error)]" />
              </div>
              <div>
                <p className="font-medium text-[var(--error)]">Delete Account</p>
                <p className="text-sm text-[var(--muted-foreground)]">
                  Permanently delete your account and data
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={onDeleteAccount}>
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Policy */}
      <Card>
        <CardContent className="p-4">
          <p className="text-sm text-[var(--muted-foreground)]">
            By using WasteFi, you agree to our{" "}
            <a href="/privacy" className="text-[var(--primary)] hover:underline">
              Privacy Policy
            </a>{" "}
            and{" "}
            <a href="/terms" className="text-[var(--primary)] hover:underline">
              Terms of Service
            </a>
            .
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
