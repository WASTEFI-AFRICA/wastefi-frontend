"use client";

import { Badge } from "@/components/ui";
import type { CollectionStatus } from "@/types/api";

/**
 * Collection Status Badge
 * Display collection status with color coding
 */

interface CollectionStatusBadgeProps {
  status: CollectionStatus;
}

export function CollectionStatusBadge({ status }: CollectionStatusBadgeProps) {
  const statusConfig = {
    pending: {
      label: "Pending",
      variant: "warning" as const,
    },
    verified: {
      label: "Verified",
      variant: "success" as const,
    },
    rejected: {
      label: "Rejected",
      variant: "error" as const,
    },
    paid: {
      label: "Paid",
      variant: "primary" as const,
    },
  };

  const config = statusConfig[status];

  return (
    <Badge variant={config.variant} size="sm">
      {config.label}
    </Badge>
  );
}
