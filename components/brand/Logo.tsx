import Image from "next/image";

/**
 * WasteFi logo.
 *
 * `lockup` is the mark plus the wordmark; `mark` is the coin and sprout alone. Use
 * `reversed` on the primary green (headers), where the default coin would disappear.
 * Pass `decorative` when the surrounding link or heading already says "WasteFi", so
 * screen readers do not announce it twice.
 */

type Variant = "lockup" | "mark";

// Natural sizes of the SVG files in public/brand, used to keep the aspect ratio.
const SOURCES: Record<Variant, { default: string; reversed: string; ratio: number }> = {
  lockup: {
    default: "/brand/wastefi-logo.svg",
    reversed: "/brand/wastefi-logo-reversed.svg",
    ratio: 399 / 96,
  },
  mark: {
    default: "/brand/wastefi-mark.svg",
    reversed: "/brand/wastefi-mark-reversed.svg",
    ratio: 1,
  },
};

interface LogoProps {
  variant?: Variant;
  reversed?: boolean;
  /** Height in pixels. The width follows from the logo's proportions. */
  height?: number;
  decorative?: boolean;
  className?: string;
  priority?: boolean;
}

export function Logo({
  variant = "lockup",
  reversed = false,
  height = 32,
  decorative = false,
  className,
  priority = false,
}: LogoProps) {
  const source = SOURCES[variant];
  return (
    <Image
      src={reversed ? source.reversed : source.default}
      alt={decorative ? "" : "WasteFi"}
      aria-hidden={decorative || undefined}
      width={Math.round(height * source.ratio)}
      height={height}
      priority={priority}
      // The files are small SVGs; the image optimizer adds nothing for them.
      unoptimized
      className={className}
    />
  );
}
