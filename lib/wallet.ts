/** WASTE uses 7 decimal places. Keep token amounts as integers throughout. */
export function formatWasteUnits(baseUnits: string | null | undefined): string | null {
  if (typeof baseUnits !== "string" || !/^\d+$/.test(baseUnits)) return null;
  const units = BigInt(baseUnits);
  const scale = BigInt(10_000_000);
  const whole = (units / scale).toLocaleString("en-US");
  const fraction = (units % scale).toString().padStart(7, "0").replace(/0+$/, "");
  return fraction ? `${whole}.${fraction}` : whole;
}

/** A missing payment amount makes the total unknown, rather than zero. */
export function sumWasteUnits(payments: readonly { chainAmount: string | null }[]): string | null {
  let total = BigInt(0);
  for (const { chainAmount } of payments) {
    if (typeof chainAmount !== "string" || !/^\d+$/.test(chainAmount)) return null;
    total += BigInt(chainAmount);
  }
  return total.toString();
}
