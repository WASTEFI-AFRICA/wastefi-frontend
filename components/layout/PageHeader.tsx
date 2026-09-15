import { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Page Header Component
 * Consistent page header with title, description, and actions
 */

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="heading-2 truncate">{title}</h1>
          {description && (
            <p className="body-regular text-[var(--muted-foreground)] mt-1">
              {description}
            </p>
          )}
        </div>
        {actions && <div className="flex-shrink-0">{actions}</div>}
      </div>
    </div>
  );
}
