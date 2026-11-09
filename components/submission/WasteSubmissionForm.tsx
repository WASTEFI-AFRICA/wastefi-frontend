"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Camera, MapPin, Scale } from "lucide-react";
import { Button, Card, CardContent, CardHeader, CardTitle, FormError } from "@/components/ui";
import { useOnlineStatus } from "@/lib/hooks/useOnlineStatus";
import { useToast } from "@/lib/hooks/useToast";
import { submitCollection } from "@/lib/api/collections";
import {
  fetchCollectionPoints,
  fetchMaterials,
  type MaterialPrice,
  type PublicCollectionPoint,
} from "@/lib/api/public";

/**
 * Waste Submission Form
 * Records a collection through POST /api/v1/collections. Materials, prices and
 * collection points come from the API. Once the collection point approves it, the
 * collection is recorded on Stellar and the collector is paid in WASTE.
 */

const submissionSchema = z.object({
  materialType: z.string().min(1, "Please choose a material"),
  weight: z
    .number({
      error: (issue) => (issue.input === undefined ? "Weight is required" : "Please enter a valid weight"),
    })
    .min(0.1, "Weight must be at least 0.1 kg")
    .max(1000, "Weight cannot exceed 1000 kg per submission"),
  collectionPointId: z.string().min(1, "Please choose a collection point"),
});

type SubmissionFormData = z.infer<typeof submissionSchema>;

const selectClass =
  "w-full h-12 px-3 rounded-md border bg-[var(--background)] focus:ring-2 focus:border-transparent outline-none";

export function WasteSubmissionForm() {
  const [materials, setMaterials] = useState<MaterialPrice[]>([]);
  const [currency, setCurrency] = useState("KES");
  const [points, setPoints] = useState<PublicCollectionPoint[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const isOnline = useOnlineStatus();
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<SubmissionFormData>({ resolver: zodResolver(submissionSchema) });
  const [materialType, weight] = useWatch({ control, name: ["materialType", "weight"] });

  // Every state update happens when the requests settle, so this can run from an effect.
  useEffect(() => {
    const controller = new AbortController();
    Promise.all([fetchMaterials(controller.signal), fetchCollectionPoints(controller.signal)])
      .then(([priceList, collectionPoints]) => {
        setMaterials(priceList.materials);
        setCurrency(priceList.currency);
        setPoints(collectionPoints);
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setLoadError("Could not load materials and collection points. Please refresh the page.");
        }
      });
    return () => controller.abort();
  }, []);

  const byCategory = useMemo(() => {
    const groups = new Map<string, MaterialPrice[]>();
    for (const material of materials) {
      groups.set(material.category, [...(groups.get(material.category) ?? []), material]);
    }
    return [...groups.entries()];
  }, [materials]);

  const selected = materials.find((m) => m.materialType === materialType);
  const estimate = selected && weight > 0 ? selected.pricePerKg * weight : 0;

  const onSubmit = async (data: SubmissionFormData) => {
    const material = materials.find((m) => m.materialType === data.materialType);
    if (!material) return;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await submitCollection({
        collectionPointId: data.collectionPointId,
        materialType: material.materialType,
        materialCategory: material.category,
        weight: data.weight,
      });
      toast.success("The collection point will review it next.", { title: "Collection submitted" });
      router.push("/dashboard");
    } catch (error) {
      setSubmitError(
        error instanceof Error && error.message
          ? error.message
          : "Your collection could not be submitted. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const ready = materials.length > 0 && points.length > 0;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      {loadError && (
        <p role="alert" className="text-sm text-[var(--error)]">
          {loadError}
        </p>
      )}
      {submitError && (
        <div
          role="alert"
          className="rounded-md border border-[var(--error)] bg-[var(--background)] p-3 text-sm text-[var(--error)]"
        >
          {submitError}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Material</CardTitle>
        </CardHeader>
        <CardContent>
          <label htmlFor="material" className="sr-only">
            Material
          </label>
          <select
            id="material"
            {...register("materialType")}
            defaultValue=""
            disabled={!ready}
            className={`${selectClass} ${errors.materialType ? "border-[var(--error)]" : "border-[var(--border)]"}`}
            aria-invalid={errors.materialType ? "true" : "false"}
            aria-describedby={errors.materialType ? "material-error" : undefined}
          >
            <option value="" disabled>
              {ready ? "Choose the material" : "Loading materials..."}
            </option>
            {byCategory.map(([category, items]) => (
              <optgroup key={category} label={category}>
                {items.map((m) => (
                  <option key={m.materialType} value={m.materialType}>
                    {m.description} ({currency} {m.pricePerKg}/kg)
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          {errors.materialType && <FormError message={errors.materialType.message} id="material-error" />}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Weight</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Scale className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted-foreground)]" />
            <label htmlFor="weight" className="sr-only">
              Weight in kilograms
            </label>
            <input
              id="weight"
              {...register("weight", { valueAsNumber: true })}
              type="number"
              step="0.1"
              min="0.1"
              placeholder="0.0"
              className={`w-full h-14 pl-12 pr-16 text-lg font-semibold rounded-md border ${
                errors.weight
                  ? "border-[var(--error)] focus:ring-[var(--error)]"
                  : "border-[var(--border)] focus:ring-[var(--primary)]"
              } bg-[var(--background)] focus:ring-2 focus:border-transparent outline-none`}
              aria-invalid={errors.weight ? "true" : "false"}
              aria-describedby={errors.weight ? "weight-error" : undefined}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] font-medium">
              kg
            </span>
          </div>
          {errors.weight && <FormError message={errors.weight.message} id="weight-error" />}

          {estimate > 0 && (
            <div className="mt-4 p-4 rounded-lg bg-[var(--primary)]/5 border border-[var(--primary)]/20 flex items-center justify-between">
              <span className="text-sm font-medium">Estimated value</span>
              <span className="text-xl font-bold text-[var(--primary)]">
                {currency} {estimate.toFixed(2)}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="w-5 h-5" aria-hidden="true" />
            Collection Point
          </CardTitle>
        </CardHeader>
        <CardContent>
          <label htmlFor="collection-point" className="sr-only">
            Collection point
          </label>
          <select
            id="collection-point"
            {...register("collectionPointId")}
            defaultValue=""
            disabled={!ready}
            className={`${selectClass} ${errors.collectionPointId ? "border-[var(--error)]" : "border-[var(--border)]"}`}
            aria-invalid={errors.collectionPointId ? "true" : "false"}
            aria-describedby={errors.collectionPointId ? "point-error" : undefined}
          >
            <option value="" disabled>
              {ready ? "Where are you delivering?" : "Loading collection points..."}
            </option>
            {points.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}, {p.city}
              </option>
            ))}
          </select>
          {errors.collectionPointId && (
            <FormError message={errors.collectionPointId.message} id="point-error" />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Camera className="w-5 h-5" aria-hidden="true" />
            Photos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-[var(--muted-foreground)]">
            Photo upload is not available yet. The collection point weighs and checks your
            delivery before approving it.
          </p>
        </CardContent>
      </Card>

      {!isOnline && (
        <p role="status" className="text-sm text-[var(--warning)]">
          You are offline. Connect to the internet to submit this collection.
        </p>
      )}

      <Button
        type="submit"
        variant="cta"
        size="lg"
        fullWidth
        loading={isSubmitting}
        disabled={!ready || !isOnline || isSubmitting}
      >
        Submit Collection
      </Button>
    </form>
  );
}
