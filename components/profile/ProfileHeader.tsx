"use client";

import { Camera, Edit2 } from "lucide-react";
import { Button, Badge } from "@/components/ui";
import type { User } from "@/types/api";

/**
 * Profile Header
 * Display user avatar, name, and basic info
 */

interface ProfileHeaderProps {
  user: User;
  onEdit?: () => void;
  onAvatarChange?: () => void;
}

export function ProfileHeader({ user, onEdit, onAvatarChange }: ProfileHeaderProps) {
  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="relative">
      {/* Cover gradient */}
      <div className="h-32 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] rounded-t-xl" />

      {/* Profile content */}
      <div className="px-6 pb-6">
        {/* Avatar */}
        <div className="relative -mt-16 mb-4">
          <div className="w-24 h-24 rounded-full bg-white shadow-lg flex items-center justify-center text-2xl font-bold text-[var(--primary)] border-4 border-white">
            {getInitials(user.name)}
          </div>
          {onAvatarChange && (
            <button
              onClick={onAvatarChange}
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[var(--primary)] text-white flex items-center justify-center shadow-lg hover:bg-[var(--primary-dark)] transition-colors"
            >
              <Camera className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* User info */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold mb-1">{user.name}</h2>
            <p className="text-[var(--muted-foreground)] mb-2">{user.phone}</p>
            {user.email && (
              <p className="text-sm text-[var(--muted-foreground)]">{user.email}</p>
            )}
          </div>
          {onEdit && (
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit2 className="w-4 h-4 mr-2" />
              Edit
            </Button>
          )}
        </div>

        {/* Role badge */}
        <Badge variant="primary" size="md">
          {user.role === "collector" ? "Waste Collector" : user.role}
        </Badge>
      </div>
    </div>
  );
}
