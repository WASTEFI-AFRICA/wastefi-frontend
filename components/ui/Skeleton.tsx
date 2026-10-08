import { cn } from "@/lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Skeleton Component
 * Provides animated loading placeholder
 */
export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-[var(--muted)] opacity-50",
        className
      )}
      {...props}
    />
  );
}

/**
 * Skeleton variants for common UI patterns
 */
export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({
  lines = 3,
  className,
}) => {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-4 w-full"
          style={{
            width: i === lines - 1 ? "80%" : "100%",
          }}
        />
      ))}
    </div>
  );
};

export const SkeletonCard: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn("rounded-lg border border-[var(--border)] p-4", className)}>
      <div className="space-y-3">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  );
};

export const SkeletonAvatar: React.FC<{ className?: string }> = ({ className }) => {
  return <Skeleton className={cn("rounded-full w-10 h-10", className)} />;
};

export const SkeletonButton: React.FC<{ className?: string }> = ({ className }) => {
  return <Skeleton className={cn("h-10 w-24 rounded-md", className)} />;
};
