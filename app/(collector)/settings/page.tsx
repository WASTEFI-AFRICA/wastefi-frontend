"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui";
import {
  NotificationSettings,
  LanguageSettings,
  PrivacySettings,
} from "@/components/settings";
import { useUIStore } from "@/store/uiStore";

/**
 * Settings Page
 * Manage app preferences and settings
 */

type SettingsTab = "notifications" | "language" | "privacy";

function SettingsContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<SettingsTab>("notifications");
  const addToast = useUIStore((state) => state.addToast);

  // Set active tab from URL query param
  useEffect(() => {
    const tab = searchParams.get("tab") as SettingsTab;
    if (tab && ["notifications", "language", "privacy"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const tabs: { key: SettingsTab; label: string }[] = [
    { key: "notifications", label: "Notifications" },
    { key: "language", label: "Language" },
    { key: "privacy", label: "Privacy & Security" },
  ];

  const handleNotificationChange = (preferences: any) => {
    console.log("Notification preferences changed:", preferences);
    addToast("Notification settings updated", "success");
  };

  const handleLanguageChange = (languageCode: string) => {
    console.log("Language changed to:", languageCode);
    addToast("Language updated successfully", "success");
  };

  const handleExportData = () => {
    addToast("Exporting your data...", "info");
    // Simulate export
    setTimeout(() => {
      addToast("Data export ready for download", "success");
    }, 2000);
  };

  const handleDeleteAccount = () => {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      addToast("Account deletion requested", "error");
      // Handle account deletion
    }
  };

  return (
    <>
      {/* Tab Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-[var(--border)] mb-6">
        {tabs.map((tab) => (
          <Button
            key={tab.key}
            variant={activeTab === tab.key ? "primary" : "outline"}
            size="md"
            onClick={() => setActiveTab(tab.key)}
            className="whitespace-nowrap"
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "notifications" && (
        <NotificationSettings onChange={handleNotificationChange} />
      )}

      {activeTab === "language" && (
        <LanguageSettings onChange={handleLanguageChange} />
      )}

      {activeTab === "privacy" && (
        <PrivacySettings
          onExportData={handleExportData}
          onDeleteAccount={handleDeleteAccount}
        />
      )}
    </>
  );
}

export default function SettingsPage() {
  return (
    <Container size="md">
      <Section>
        <PageHeader
          title="Settings"
          description="Manage your preferences and account settings"
        />
      </Section>

      <Section spacing="sm">
        <Suspense fallback={<div>Loading...</div>}>
          <SettingsContent />
        </Suspense>
      </Section>
    </Container>
  );
}
