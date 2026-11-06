"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchMaterials } from "@/lib/api/public";

/**
 * Material descriptions come from the API. The shared query caches the catalogue
 * across rows and screens; a missing catalogue must not block collection review.
 */
export function MaterialName({ code }: { code: string }) {
  const { data } = useQuery({
    queryKey: ["public", "materials"],
    queryFn: ({ signal }) => fetchMaterials(signal),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
  const material = data?.materials.find(
    (item) => item.materialType.trim().toUpperCase() === code.trim().toUpperCase()
  );
  const words = code.trim().replace(/[_-]+/g, " ").toLowerCase();
  const fallback = words ? words[0].toUpperCase() + words.slice(1) : "Unspecified material";

  return <>{material?.description.trim() || fallback}</>;
}
