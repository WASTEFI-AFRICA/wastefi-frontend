"use client";

import { useState } from "react";
import { Bell, Mail, Smartphone, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";

/**
 * Notification Settings
 * Configure notification preferences
 */

interface NotificationPreferences {
  pushNotifications: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  collectionUpdates: boolean;
  paymentAlerts: boolean;
  promotions: boolean;
}

interface NotificationSettingsProps {
  initialPreferences?: NotificationPreferences;
  onChange?: (preferences: NotificationPreferences) => void;
}

export function NotificationSettings({
  initialPreferences,
  onChange,
}: NotificationSettingsProps) {
  const [preferences, setPreferences] = useState<NotificationPreferences>(
    initialPreferences || {
      pushNotifications: true,
      emailNotifications: true,
      smsNotifications: false,
      collectionUpdates: true,
      paymentAlerts: true,
      promotions: false,
    }
  );

  const handleToggle = (key: keyof NotificationPreferences) => {
    const newPreferences = {
      ...preferences,
      [key]: !preferences[key],
    };
    setPreferences(newPreferences);
    onChange?.(newPreferences);
  };

  const channels = [
    {
      key: "pushNotifications" as const,
      icon: Smartphone,
      label: "Push Notifications",
      description: "Receive notifications on your device",
    },
    {
      key: "emailNotifications" as const,
      icon: Mail,
      label: "Email Notifications",
      description: "Receive updates via email",
    },
    {
      key: "smsNotifications" as const,
      icon: MessageSquare,
      label: "SMS Notifications",
      description: "Receive text messages for important updates",
    },
  ];

  const types = [
    {
      key: "collectionUpdates" as const,
      label: "Collection Updates",
      description: "Status changes on your waste submissions",
    },
    {
      key: "paymentAlerts" as const,
      label: "Payment Alerts",
      description: "Notifications about earnings and cashouts",
    },
    {
      key: "promotions" as const,
      label: "Promotions & Tips",
      description: "Recycling tips and promotional offers",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Notification Channels */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notification Channels
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {channels.map((channel) => {
            const Icon = channel.icon;
            return (
              <div
                key={channel.key}
                className="flex items-center justify-between py-3 border-b border-[var(--border)] last:border-0"
              >
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-10 h-10 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-[var(--primary)]" />
                  </div>
                  <div>
                    <p className="font-medium">{channel.label}</p>
                    <p className="text-sm text-[var(--muted-foreground)]">
                      {channel.description}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle(channel.key)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    preferences[channel.key]
                      ? "bg-[var(--primary)]"
                      : "bg-[var(--muted)]"
                  }`}
                >
                  <div
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      preferences[channel.key] ? "translate-x-6" : ""
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Notification Types */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Notification Types</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {types.map((type) => (
            <div
              key={type.key}
              className="flex items-center justify-between py-3 border-b border-[var(--border)] last:border-0"
            >
              <div className="flex-1">
                <p className="font-medium">{type.label}</p>
                <p className="text-sm text-[var(--muted-foreground)]">
                  {type.description}
                </p>
              </div>
              <button
                onClick={() => handleToggle(type.key)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  preferences[type.key]
                    ? "bg-[var(--primary)]"
                    : "bg-[var(--muted)]"
                }`}
              >
                <div
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    preferences[type.key] ? "translate-x-6" : ""
                  }`}
                />
              </button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
