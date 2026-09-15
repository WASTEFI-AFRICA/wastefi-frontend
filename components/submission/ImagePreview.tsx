"use client";

import { X } from "lucide-react";

/**
 * Image Preview Component
 * Display and remove captured images
 */

interface ImagePreviewProps {
  images: string[];
  onRemove: (index: number) => void;
}

export function ImagePreview({ images, onRemove }: ImagePreviewProps) {
  if (images.length === 0) return null;

  return (
    <div className="grid grid-cols-3 gap-3">
      {images.map((image, index) => (
        <div key={index} className="relative aspect-square rounded-lg overflow-hidden group">
          <img
            src={image}
            alt={`Capture ${index + 1}`}
            className="w-full h-full object-cover"
          />
          <button
            onClick={() => onRemove(index)}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/70 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
