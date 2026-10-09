import Link from "next/link";
import { Info } from "lucide-react";

/**
 * Shown above screens that still render hard-coded sample data, so nobody mistakes
 * the numbers for a real account. Remove it from a layout once its screens read
 * from the API.
 */
export function SampleDataNotice() {
  return (
    <div
      role="note"
      className="flex items-start gap-2 bg-orange-100 text-orange-800 px-4 py-2 text-sm"
    >
      <Info className="w-4 h-4 mt-0.5 flex-shrink-0" aria-hidden="true" />
      <p>
        <strong>Sample data.</strong> The figures on this screen are placeholders, not a real
        account.{" "}
        <Link href="/stats" className="underline font-medium">
          See live platform stats
        </Link>
        .
      </p>
    </div>
  );
}
