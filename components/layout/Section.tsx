import { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Section Component
 * Consistent section spacing and layout
 */

interface SectionProps {
  children: ReactNode;
  className?: string;
  spacing?: "sm" | "md" | "lg";
}

const spacingClasses = {
  sm: "py-4",
  md: "py-6",
  lg: "py-8",
};

export function Section({
  children,
  className,
  spacing = "md",
}: SectionProps) {
  return (
    <section className={cn(spacingClasses[spacing], className)}>
      {children}
    </section>
  );
}
