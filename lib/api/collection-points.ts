import type { CollectionPoint } from "@/types/api";
import type { PublicCollectionPoint } from "./public";

function parseJson(value: unknown): unknown {
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

const DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

function operatingHours(value: unknown): CollectionPoint["operatingHours"] {
  const parsed = parseJson(value);
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return [];
  const hours = parsed as Record<string, unknown>;
  if (
    typeof hours.open === "string" &&
    typeof hours.close === "string" &&
    hours.open.trim() &&
    hours.close.trim() &&
    Array.isArray(hours.days)
  ) {
    return hours.days
      .filter((day): day is string => typeof day === "string")
      .map((day) => ({ day, hours: `${hours.open} - ${hours.close}` }));
  }
  const byDay = new Map(
    Object.entries(hours).map(([day, value]) => [day.toLowerCase(), value]),
  );
  return DAYS.flatMap((day) => {
    const value = byDay.get(day);
    return typeof value === "string" && value.trim()
      ? [{ day: day[0].toUpperCase() + day.slice(1), hours: value.trim() }]
      : [];
  });
}

/** Convert the API's coordinates and JSON fields without inventing missing details. */
export function toCollectionPoint(
  point: PublicCollectionPoint,
): CollectionPoint {
  const parsed = parseJson(point.acceptedMaterials);
  const materials = Array.isArray(parsed)
    ? parsed.filter(
        (value): value is string =>
          typeof value === "string" && Boolean(value.trim()),
      )
    : [];
  const hasCoordinates =
    Number.isFinite(point.latitude) &&
    Number.isFinite(point.longitude) &&
    Math.abs(point.latitude) <= 90 &&
    Math.abs(point.longitude) <= 180;
  return {
    id: point.id,
    name: point.name,
    address: point.address,
    city: point.city,
    country: point.country,
    description: point.description || undefined,
    location: hasCoordinates
      ? { lat: point.latitude, lng: point.longitude }
      : null,
    acceptedMaterials: [
      ...new Set(materials.map((value) => value.trim().toUpperCase())),
    ],
    operatingHours: operatingHours(point.operatingHours),
    contact: {
      phone: point.contactPhone || undefined,
      email: point.contactEmail || undefined,
    },
    verified: Boolean(point.verifiedAt),
    createdAt: point.createdAt,
  };
}
