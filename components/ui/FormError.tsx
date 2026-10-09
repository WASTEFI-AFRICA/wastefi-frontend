import { AlertCircle } from "lucide-react";

/**
 * Form Error Component
 * Consistent error message display for forms
 */

interface FormErrorProps {
  message?: string;
  className?: string;
  /** Referenced by the input's aria-describedby so screen readers announce the error. */
  id?: string;
}

export function FormError({ message, className = "", id }: FormErrorProps) {
  if (!message) return null;

  return (
    <div
      id={id}
      className={`flex items-start gap-2 mt-1.5 text-sm text-[var(--error)] ${className}`}
      role="alert"
      aria-live="polite"
    >
      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
}
