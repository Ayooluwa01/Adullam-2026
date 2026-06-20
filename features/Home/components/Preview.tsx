"use client";
/* eslint-disable @next/next/no-img-element */
import { CircleUser } from "lucide-react";
import Image from "next/image";

interface PreviewProps {
  name: string;
  photo: string;
  previewRef: React.RefObject<HTMLDivElement | null>;
}

export default function Preview({ name, photo, previewRef }: PreviewProps) {
  return (
    <section className="w-full flex flex-col items-center px-4 pb-16">
      {/* Live Preview Header Indicator */}
      <div className="flex items-center gap-2 mb-6">
        <span className="w-1.5 h-1.5 rounded-full bg-[#B28D7F] animate-pulse"></span>
        <span className="text-xs text-[#8C7468] font-bold uppercase tracking-[0.25em]">
          Live Preview
        </span>
      </div>

      {/* Flyer Canvas — fully fluid, scales via container queries instead of fixed breakpoints */}
      <div
        ref={previewRef}
        className="relative w-full max-w-[440px] aspect-square mx-auto bg-[#FAF5F2] overflow-hidden rounded-2xl sm:rounded-3xl shadow-[0_20px_50px_-12px_rgba(61,38,28,0.12)] border border-[#EDE1DA]"
        style={{ containerType: "inline-size" }}
      >
        {/* Layer 1: Background artwork (confirmed 1:1, object-cover with no crop) */}
        {/* <Image
          alt="Sacred Event Background"
          src="/AttendingAdullam.png"
          fill
          className="object-cover"
          sizes="(max-width: 440px) 100vw, 440px"
          priority
        /> */}

        {/* Layer 2: Bottom gap region — distributes photo + name + status across the open space */}
        <div
          className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-between"
          style={{ top: "58%", padding: "3cqw 6cqw 4cqw" }}
        >
          {/* Attendee photo */}
          <div
            className="relative bg-white border-[3px] border-[#3D261C] rounded-full overflow-hidden shadow-xl flex items-center justify-center shrink-0"
            style={{ width: "28cqw", aspectRatio: "1 / 1" }}
          >
            {photo ? (
              <img
                className="w-full h-full object-cover"
                src={photo}
                alt="Attendee Crop"
              />
            ) : (
              <div className="text-[#C4B2A9] w-1/2 h-1/2">
                <CircleUser className="w-full h-full stroke-[1.25]" />
              </div>
            )}
          </div>

          {/* Name + status, anchored to the very bottom of the gap */}
          <div className="flex flex-col items-center" style={{ gap: "1cqw" }}>
            <div
              className="text-center rounded-xl shadow-md border border-[#EDE1DA] bg-white/85 max-w-full"
              style={{ padding: "1.2cqw 3cqw" }}
            >
              <span
                className="font-serif text-[#3D261C] uppercase tracking-[0.1em] block truncate"
                style={{ fontSize: "4cqw" }}
              >
                {name.trim() === "" ? "Your Name" : name}
              </span>
            </div>
            <h4
              className="font-serif italic text-[#3D261C] font-semibold tracking-wide mix-blend-multiply opacity-75 whitespace-nowrap"
              style={{ fontSize: "2.6cqw" }}
            >
              Will be attending
            </h4>
          </div>
        </div>
      </div>
    </section>
  );
}
