"use client";
import { useState, useRef } from "react";
import { Header, Hero, Form, Preview } from "@/features/Home";

export default function HomePage() {
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState("");
  const previewRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen bg-surface">
      <Header />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 md:px-gutter py-8 sm:py-margin-desktop flex flex-col items-center">
        <Hero />
        <Form />
        {/* <Preview name={name} photo={photo} previewRef={previewRef} /> */}
      </main>
    </div>
  );
}
