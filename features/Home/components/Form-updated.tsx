/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useRef, useCallback } from "react";
import { Camera, Download, X } from "lucide-react";
import * as htmlToImage from "html-to-image";
import Cropper, { Area } from "react-easy-crop";

// Pulled directly from the Adullam '26 flyer artwork
const EVENT_DETAILS = {
  church: "Cherubim and Seraphim Movement Church",
  district: "Christ Royal Mandate District Headquarters (Ayo Ni O)",
  title: "Adullam '26",
  theme: "The Pillar of Our Faith",
  dates: "13th – 15th August",
  venue:
    "The Mandate Arena, 31 Balogun Ketiku Street, Igando, Oko-Filling B/Stop, Lagos",
  speakers: [
    "Pro. Femi Ologbe",
    "Pro. Musa Michael",
    "Pst. Bayo Ojo",
    "Pro. Abraham Adebayo",
    "Pro. (Dr) Tunji Komolafe",
    "Pst. Segun Michael",
    "Pro. Moses Labade",
    "Pro. Charles Oluwole",
    "Pst. Moses Okesola",
  ],
};

// ---- local crop helpers (no remote upload — everything stays on-device) ----

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.src = url;
  });
}

async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area,
): Promise<string> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");

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

  return canvas.toDataURL("image/png");
}

export default function AttendanceFlyerBuilder() {
  const [name, setName] = useState<string>("");
  const [previewPhoto, setPreviewPhoto] = useState<string>("");
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [nameError, setNameError] = useState<boolean>(false);
  const [fileError, setFileError] = useState<boolean>(false);
  const flyerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cropper state
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState<boolean>(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Images only
    if (!file.type.startsWith("image/")) {
      setFileError(true);
      e.target.value = "";
      return;
    }
    setFileError(false);

    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedAreaPixels(null);
      setShowCropper(true);
    };
    reader.readAsDataURL(file);
    e.target.value = ""; // allow re-selecting the same file later
  };

  const onCropComplete = useCallback((_croppedArea: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const handleConfirmCrop = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    try {
      const cropped = await getCroppedImg(imageSrc, croppedAreaPixels);
      setPreviewPhoto(cropped);
      setShowCropper(false);
      setImageSrc(null);
    } catch (error) {
      console.error("Crop failed:", error);
    }
  };

  const handleCancelCrop = () => {
    setShowCropper(false);
    setImageSrc(null);
  };

  const handleDownload = async () => {
    // Name is required before a download can happen
    if (!name.trim()) {
      setNameError(true);
      return;
    }
    setNameError(false);

    if (!flyerRef.current) return;
    setIsDownloading(true);

    try {
      await new Promise((r) => setTimeout(r, 500));
      // const dataUrl = await htmlToImage.toPng(flyerRef.current, {
      //   pixelRatio: 2,
      //   quality: 1,
      //   cacheBust: true,
      //   skipFonts: false,
      // });
      const dataUrl = await htmlToImage.toPng(flyerRef.current, {
        pixelRatio: 3, // Increase to 3 for higher density
        quality: 1.0,
        cacheBust: true,
        // Force the canvas size to be larger than the displayed element
        width: flyerRef.current.scrollWidth * 2,
        height: flyerRef.current.scrollHeight * 2,
        style: {
          transform: "scale(2)",
          transformOrigin: "top left",
          width: flyerRef.current.scrollWidth + "px",
          height: flyerRef.current.scrollHeight + "px",
        },
      });
      const link = document.createElement("a");
      link.download = `${name.trim().replace(/\s+/g, "-")}-Adullam26-Flyer.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsDownloading(false);
    }
  };
  const isLongName = name.length > 18;

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 460,
        margin: "0 auto",
        padding: "24px 16px 48px",
        fontFamily: "Georgia, 'Times New Roman', serif",
        boxSizing: "border-box",
      }}
      id="trend-section"
    >
      {/* 1. INPUTS (Not captured in image) */}
      <div style={{ marginBottom: 24, fontFamily: "Arial, sans-serif" }}>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (e.target.value.trim()) setNameError(false);
          }}
          required
          style={{
            width: "100%",
            padding: 12,
            marginBottom: nameError ? 4 : 10,
            borderRadius: 8,
            border: nameError ? "1px solid #c0392b" : "1px solid #ccc",
            boxSizing: "border-box",
            fontSize: 15,
          }}
        />
        {nameError && (
          <p style={{ margin: "0 0 10px", color: "#c0392b", fontSize: 12 }}>
            Please enter your name before downloading.
          </p>
        )}

        {/* Hidden local file input — images only */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          style={{
            width: "100%",
            padding: previewPhoto ? "10px 15px" : "20px 15px",
            background: previewPhoto ? "#fff" : "#faf6f2",
            border: previewPhoto ? "1px solid #d8cdc6" : "2px dashed #c2a89c",
            color: "#4a332d",
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: previewPhoto ? "flex-start" : "center",
            gap: 12,
            fontSize: 15,
            cursor: "pointer",
            boxSizing: "border-box",
            flexDirection: previewPhoto ? "row" : "column",
            textAlign: previewPhoto ? "left" : "center",
            transition: "background 0.15s ease, border-color 0.15s ease",
          }}
        >
          {previewPhoto ? (
            <>
              <img
                src={previewPhoto}
                alt="Selected"
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  objectFit: "cover",
                  flexShrink: 0,
                }}
              />
              <span style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontWeight: 600 }}>Photo selected</span>
                <span style={{ fontSize: 12, color: "#8c6b61" }}>
                  Tap to change photo
                </span>
              </span>
            </>
          ) : (
            <>
              <Camera size={26} color="#8c6b61" />
              <span style={{ fontWeight: 600 }}>Upload Profile Photo</span>
              <span style={{ fontSize: 12, color: "#a98f86" }}>
                Images only — JPG, PNG or WEBP
              </span>
            </>
          )}
        </button>
        {fileError && (
          <p style={{ margin: "6px 0 0", color: "#c0392b", fontSize: 12 }}>
            Please select an image file (JPG, PNG or WEBP).
          </p>
        )}

        <button
          onClick={handleDownload}
          disabled={isDownloading}
          style={{
            width: "100%",
            marginTop: 10,
            padding: 15,
            background: "#8c6b61",
            color: "white",
            border: "none",
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            fontSize: 15,
            cursor: isDownloading ? "default" : "pointer",
            opacity: isDownloading ? 0.7 : 1,
            boxSizing: "border-box",
          }}
        >
          <Download size={18} />
          {isDownloading ? "Generating..." : "Download Flyer"}
        </button>
      </div>

      {/* 2. FLYER PREVIEW (Captured as Image) — locked to a true 1:1 square */}
      <div
        ref={flyerRef}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 440,
          aspectRatio: "1 / 1",
          margin: "0 auto",
          borderRadius: 16,
          overflow: "hidden",
        }}
      >
        {/* Background Flyer — square artwork, no portrait stretching */}
        <img
          src="/AttendingAdullam.png"
          alt="Flyer"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            position: "absolute",
            inset: 0,
            zIndex: 0,
          }}
        />

        {/* Profile Picture — sized as a % of the square so it scales with it */}
        {previewPhoto && (
          <div
            style={{
              position: "absolute",
              top: "72%",
              left: "51%",
              transform: "translate(-50%, -10%)",
              width: "26%",
              height: "26%",
              borderRadius: "10%",
              border: "clamp(2px, 0.8vw, 4px) solid white",
              overflow: "hidden",
              zIndex: 1,
              boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
            }}
          >
            <img
              src={previewPhoto}
              alt="User"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            {/* Name Overlay — directly under the picture */}
            {/* <div
              style={{
                position: "absolute",
                top: "90%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "40%",
                textAlign: "center",
                color: "#4a332d",
                fontSize: "12px",
                fontWeight: "bold",
                zIndex: 2,

                textOverflow: "ellipsis",
              }}
            >
              will be attending
            </div> */}
          </div>
        )}

        <div
          style={{
            position: "absolute",
            top: "98%",
            left: "51%",
            transform: "translate(-50%, -50%)",
            width: "100%",
            overflow: "visible",
            // backgroundColor: "#360410",
            fontSize: "clamp(9px, 2.2vw, 16px)",
            lineHeight: 1.1,
            whiteSpace: "normal",
            wordBreak: "break-word",
            maxWidth: "85%",
            textAlign: "center",
            textOverflow: "unset",

            color: "#360410",
            fontWeight: "bold",
            zIndex: 2,
          }}
        >
          {name} will be attending
        </div>
      </div>

      {/* CROP MODAL — mandatory, no skip; user must confirm a crop to proceed */}
      {showCropper && imageSrc && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.65)",
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 16px",
              background: "#fff",
              fontFamily: "Arial, sans-serif",
            }}
          >
            <span style={{ fontWeight: 600, color: "#4a332d", fontSize: 15 }}>
              Crop your photo
            </span>
            <button
              onClick={handleCancelCrop}
              aria-label="Cancel"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#4a332d",
                padding: 4,
                display: "flex",
              }}
            >
              <X size={22} />
            </button>
          </div>

          <div style={{ position: "relative", flex: 1, background: "#222" }}>
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              showGrid={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>

          <div
            style={{
              padding: 16,
              background: "#fff",
              display: "flex",
              flexDirection: "column",
              gap: 12,
              fontFamily: "Arial, sans-serif",
            }}
          >
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              style={{ width: "100%", accentColor: "#8c6b61" }}
              aria-label="Zoom"
            />
            <button
              onClick={handleConfirmCrop}
              disabled={!croppedAreaPixels}
              style={{
                width: "100%",
                padding: 15,
                background: "#8c6b61",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                fontWeight: 600,
                fontSize: 15,
                cursor: croppedAreaPixels ? "pointer" : "default",
                opacity: croppedAreaPixels ? 1 : 0.6,
              }}
            >
              Use Photo
            </button>
          </div>
        </div>
      )}

      {/* EVENT HEADER — extracted from the flyer artwork */}
      <div style={{ textAlign: "center", marginBottom: 12 }} className="mt-4">
        <p
          style={{
            margin: 0,
            fontSize: "clamp(10px, 2.6vw, 11px)",
            letterSpacing: 1.5,
            textTransform: "uppercase",
            color: "#8c6b61",
            fontFamily: "Arial, sans-serif",
          }}
        >
          {EVENT_DETAILS.church}
        </p>
        <p
          style={{
            margin: "2px 0 10px",
            fontSize: "clamp(10px, 2.4vw, 11px)",
            letterSpacing: 1,
            color: "#a98f86",
            fontFamily: "Arial, sans-serif",
          }}
        >
          {EVENT_DETAILS.district}
        </p>
        {/* <h1
          style={{
            margin: 0,
            fontSize: "clamp(28px, 8vw, 38px)",
            color: "#4a332d",
            fontWeight: 700,
            letterSpacing: 0.5,
          }}
        >
          {EVENT_DETAILS.title}
        </h1> */}
        <div
          style={{
            display: "inline-block",
            marginTop: 8,
            padding: "4px 14px",
            background: "#4a332d",
            color: "#f5d98c",
            fontSize: "clamp(11px, 2.8vw, 12px)",
            fontFamily: "Arial, sans-serif",
            letterSpacing: 1,
            borderRadius: 3,
          }}
        >
          {EVENT_DETAILS.theme}
        </div>
        <p
          style={{
            margin: "14px 0 0",
            fontSize: "clamp(13px, 3.4vw, 14px)",
            color: "#4a332d",
            fontFamily: "Arial, sans-serif",
          }}
        >
          <strong>Date:</strong> {EVENT_DETAILS.dates}
        </p>
        <p
          style={{
            margin: "4px 0 0",
            fontSize: "clamp(12px, 3.2vw, 13px)",
            color: "#6b5650",
            fontFamily: "Arial, sans-serif",
            lineHeight: 1.4,
          }}
        >
          <strong>Venue:</strong> {EVENT_DETAILS.venue}
        </p>
      </div>
    </div>
  );
}
