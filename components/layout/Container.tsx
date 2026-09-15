import { cn } from "@/lib/utils";
import { ReactNode } from "react";

/**
 * Container Component
 * Responsive container with max-width constraints
 */

interface ContainerProps {
  children: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  noPadding?: boolean;
}

const sizeClasses = {
  sm: "max-w-2xl",
  md: "max-w-4xl",
  lg: "max-w-6xl",
  xl: "max-w-7xl",
  full: "max-w-full",
};

export function Container({
  children,
  className,
  size = "xl",
  noPadding = false,
}: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full",
        sizeClasses[size],
        !noPadding && "px-4 sm:px-6 lg:px-8",
        className
      )}
    >
      {children}
    </div>
  );
}
