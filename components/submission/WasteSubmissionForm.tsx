"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { MaterialTypeSelector, materials } from "./MaterialTypeSelector";
import { ImagePreview } from "./ImagePreview";
import { CameraCapture } from "./CameraCapture";
import { Camera, MapPin, Scale, DollarSign } from "lucide-react";
import { useRouter } from "next/navigation";
import { useOnlineStatus } from "@/lib/hooks/useOfflineStorage";
import { savePendingSubmission, addToSyncQueue } from "@/lib/db/storage";
import { useUIStore } from "@/store/uiStore";
import type { MaterialType } from "@/types/api";

/**
 * Waste Submission Form
 * Submit waste collection with photos and details
 */

const submissionSchema = z.object({
  materialType: z.string().min(1, "Please select a material type"),
  weight: z.number().min(0.1, "Weight must be at least 0.1 kg"),
  collectionPointId: z.string().min(1, "Please select a collection point"),
  photos: z.array(z.string()).min(1, "Please add at least one photo").max(5, "Maximum 5 photos allowed"),
});

type SubmissionFormData = z.infer<typeof submissionSchema>;

export function WasteSubmissionForm() {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const isOnline = useOnlineStatus();
  const addToast = useUIStore((state) => state.addToast);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<SubmissionFormData>({
    resolver: zodResolver(submissionSchema),
    defaultValues: {
      collectionPointId: "point-1", // Mock collection point
    },
  });

  const weight = watch("weight");

  // Calculate estimated value
  const estimatedValue = selectedMaterial && weight
    ? (materials.find((m) => m.type === selectedMaterial)?.rate || 0) * weight
    : 0;

  const handleCameraCapture = (image: string) => {
    if (photos.length < 5) {
      const newPhotos = [...photos, image];
      setPhotos(newPhotos);
      setValue("photos", newPhotos);
    }
  };

  const handleRemovePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    setPhotos(newPhotos);
    setValue("photos", newPhotos);
  };

  const handleMaterialSelect = (type: MaterialType) => {
    setSelectedMaterial(type);
    setValue("materialType", type);
  };

  const onSubmit = async (data: SubmissionFormData) => {
    setIsSubmitting(true);

    try {
      const submission = {
        id: crypto.randomUUID(),
        collectorId: "user-123", // From auth store
        collectionPointId: data.collectionPointId,
        materialType: data.materialType,
        weight: data.weight,
        photos: data.photos,
        status: "pending_sync" as const,
        createdAt: new Date().toISOString(),
        retryCount: 0,
      };

      // Save to IndexedDB
      await savePendingSubmission(submission);

      // Add to sync queue
      await addToSyncQueue({
        id: crypto.randomUUID(),
        type: "submission",
        action: "create",
        data: submission,
        priority: 1,
        retryCount: 0,
        createdAt: new Date().toISOString(),
      });

      // Show success message
      if (isOnline) {
        addToast("Submission saved! Syncing now...", "success");
      } else {
        addToast("Saved offline. Will sync when online.", "info");
      }

      // Navigate to dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("Submission error:", error);
      addToast("Failed to save submission. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Material Type */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Material Type</CardTitle>
          </CardHeader>
          <CardContent>
            <MaterialTypeSelector
              selected={selectedMaterial}
              onSelect={handleMaterialSelect}
            />
            {errors.materialType && (
              <p className="text-sm text-[var(--error)] mt-2">
                {errors.materialType.message}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Weight Input */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Weight</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Scale className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted-foreground)]" />
              <input
                {...register("weight", { valueAsNumber: true })}
                type="number"
                step="0.1"
                placeholder="0.0"
                className="w-full h-14 pl-12 pr-16 text-lg font-semibold rounded-md border border-[var(--border)] bg-[var(--background)] focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] font-medium">
                kg
              </span>
            </div>
            {errors.weight && (
              <p className="text-sm text-[var(--error)] mt-2">
                {errors.weight.message}
              </p>
            )}

            {/* Estimated Value */}
            {estimatedValue > 0 && (
              <div className="mt-4 p-4 rounded-lg bg-[var(--primary)]/5 border border-[var(--primary)]/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-[var(--primary)]" />
                    <span className="text-sm font-medium">Estimated Value</span>
                  </div>
                  <span className="text-xl font-bold text-[var(--primary)]">
                    ${estimatedValue.toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Photos */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Photos ({photos.length}/5)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ImagePreview images={photos} onRemove={handleRemovePhoto} />

            {photos.length < 5 && (
              <Button
                type="button"
                variant="outline"
                size="lg"
                fullWidth
                onClick={() => setIsCameraOpen(true)}
              >
                <Camera className="w-5 h-5 mr-2" />
                {photos.length === 0 ? "Take Photo" : "Add Another Photo"}
              </Button>
            )}

            {errors.photos && (
              <p className="text-sm text-[var(--error)]">
                {errors.photos.message}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Collection Point (Mock for now) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Collection Point</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--muted)]/30">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[var(--primary)] mt-0.5" />
                <div>
                  <p className="font-medium">Green Recycling Center</p>
                  <p className="text-sm text-[var(--muted-foreground)] mt-0.5">
                    123 Main St, 2.5 km away
                  </p>
                </div>
              </div>
            </div>
            <p className="text-xs text-[var(--muted-foreground)] mt-2">
              Collection point finder coming soon
            </p>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={isSubmitting}
          className="sticky bottom-20 md:bottom-6 shadow-lg"
        >
          Submit Collection
        </Button>
      </form>

      {/* Camera Capture */}
      {isCameraOpen && (
        <CameraCapture
          onCapture={handleCameraCapture}
          onClose={() => setIsCameraOpen(false)}
        />
      )}
    </>
  );
}
