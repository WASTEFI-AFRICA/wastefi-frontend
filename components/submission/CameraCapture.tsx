"use client";

import { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import { Button } from "@/components/ui";
import { Camera, X, RotateCcw, CheckCircle } from "lucide-react";

/**
 * Camera Capture Component
 * Capture photos using device camera
 */

interface CameraCaptureProps {
  onCapture: (image: string) => void;
  onClose: () => void;
}

export function CameraCapture({ onCapture, onClose }: CameraCaptureProps) {
  const webcamRef = useRef<Webcam>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
    }
  }, [webcamRef]);

  const retake = () => {
    setCapturedImage(null);
  };

  const confirm = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      onClose();
    }
  };

  const toggleCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black animate-fade-in">
      <div className="relative h-full flex flex-col">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 p-4 flex items-center justify-between bg-gradient-to-b from-black/50 to-transparent">
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white"
          >
            <X className="w-6 h-6" />
          </button>
          {!capturedImage && (
            <button
              onClick={toggleCamera}
              className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Camera/Preview */}
        <div className="flex-1 flex items-center justify-center bg-black">
          {capturedImage ? (
            <img
              src={capturedImage}
              alt="Captured"
              className="max-w-full max-h-full object-contain"
            />
          ) : (
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              videoConstraints={{
                facingMode,
              }}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/50 to-transparent">
          <div className="flex items-center justify-center gap-6">
            {capturedImage ? (
              <>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={retake}
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Retake
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={confirm}
                  className="bg-[var(--success)] hover:bg-[var(--success)]/90"
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Use Photo
                </Button>
              </>
            ) : (
              <button
                onClick={capture}
                className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg active:scale-95 transition-transform"
              >
                <Camera className="w-10 h-10 text-[var(--primary)]" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
