"use client";

import { useEffect, useState } from "react";

const EVENT_DETAILS = {
  church: "Cherubim and Seraphim Movement Church",
  district: "Christ Royal Mandate District Headquarters (Ayo Ni O)",
  title: "Adullam '26",
  theme: "The Pillar of Our Faith",
  dates: "12th – 14th August, 2026",
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

// Generate scrolling content
const tickerContent = [
  ` ${EVENT_DETAILS.church}`,
  ` ${EVENT_DETAILS.theme}`,
  ` Dates: ${EVENT_DETAILS.dates}`,
  ` Venue: ${EVENT_DETAILS.venue}`,
  ...EVENT_DETAILS.speakers.map((speaker) => ` Minister: ${speaker}`),
];

export default function ScrollingTicker() {
  const [position, setPosition] = useState(0);
  const fullContent = tickerContent.join("   |   ");

  useEffect(() => {
    const interval = setInterval(() => {
      setPosition((prev) => (prev + 1) % (fullContent.length * 8));
    }, 50);

    return () => clearInterval(interval);
  }, [fullContent.length]);

  return (
    <div className="w-full bg-white/10 backdrop-blur-md border-y border-white/20 py-3 overflow-hidden shadow-lg">
      <div className="relative whitespace-nowrap">
        <div
          className="inline-block animate-scroll text-black font-semibold text-sm md:text-base tracking-wide"
          style={{
            transform: `translateX(-${position * 4}px)`,
            transition: "transform 0.05s linear",
            textShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
          }}
        >
          {fullContent}
          {/* Duplicate for seamless loop */}
          <span className="ml-8"> | </span>
          {fullContent}
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }

        .animate-scroll {
          animation: scroll 120s linear infinite;
        }
      `}</style>
    </div>
  );
}
