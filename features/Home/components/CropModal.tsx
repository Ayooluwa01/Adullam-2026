/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import Cropper from "react-easy-crop";

interface CropModalProps {
  file: File;
  onClose: () => void;
  onCropComplete: (croppedImageUrl: string) => void;
  imageSrc: string;
}

export default function CropModal({
  file,
  onClose,
  onCropComplete,
  imageSrc,
}: CropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const imageSrcRef = useRef<string>(URL.createObjectURL(file));

  useEffect(() => {
    const url = imageSrcRef.current;
    return () => URL.revokeObjectURL(url);
  }, []);

  const onCropCompleteCallback = useCallback((_: any, pixels: any) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const handleSave = async () => {
    if (!croppedAreaPixels) return;
    setIsSaving(true);
    try {
      const croppedImage = await getCroppedImg(
        imageSrcRef.current,
        croppedAreaPixels,
      );
      onCropComplete(croppedImage);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[92vh] overflow-hidden shadow-2xl flex flex-col">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center shrink-0">
          <h3 className="font-bold text-gray-900 text-sm sm:text-base">
            Position Your Photo
          </h3>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-gray-400 hover:text-gray-700 w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-lg leading-none"
          >
            ✕
          </button>
        </div>

        <div className="relative w-full h-[260px] sm:h-[320px] bg-gray-900 shrink-0">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onCropComplete={onCropCompleteCallback}
            onZoomChange={setZoom}
          />
        </div>

        <div className="p-4 sm:p-6 bg-gray-50 space-y-4 shrink-0">
          <div className="flex items-center gap-3 text-gray-500">
            <span className="text-sm shrink-0">−</span>
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#B28D7F] touch-manipulation"
            />
            <span className="text-base shrink-0">+</span>
          </div>

          <div className="flex gap-3 pt-1">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-white border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 active:scale-95 transition-all min-h-[44px]"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || !croppedAreaPixels}
              className="flex-1 py-3 px-4 bg-[#B28D7F] text-white font-bold rounded-lg hover:bg-[#A37E70] active:scale-95 transition-all shadow-md min-h-[44px] disabled:opacity-60"
            >
              {isSaving ? "Saving..." : "Apply Crop"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const getCroppedImg = async (
  imageSrc: string,
  pixelCrop: any,
): Promise<string> => {
  const image = new window.Image();
  image.src = imageSrc;
  await new Promise((resolve, reject) => {
    image.onload = resolve;
    image.onerror = reject;
  });

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  );

  return canvas.toDataURL("image/jpeg");
};
