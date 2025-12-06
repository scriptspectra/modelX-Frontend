'use client';

import { ChartAreaGradient } from "@/components/KeywordCard";
import { useEffect, useRef } from "react";

export default function Home() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  }, []);

  return (
    <div className="relative font-sans">

      {/* Hero Section */}
      <div className="relative w-full h-[60vh] md:h-screen">
        
        {/* Video Background */}
        <video
          ref={videoRef}
          autoPlay
          muted
          className="absolute top-0 left-0 w-full h-full object-cover z-[-1]"
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Desktop Floating Chart */}
        <div className="hidden md:block fixed bottom-6 left-70 z-20">
          <ChartAreaGradient />
        </div>

      </div>

      {/* Mobile Layout: Chart Below Hero */}
      <div className="md:hidden px-4 py-6">
        <ChartAreaGradient />
      </div>

      {/* Other page content – visible ONLY on mobile */}
      <div className="md:hidden px-4 py-10 bg-black">
        <h2 className="text-2xl font-semibold mb-4">Other Content</h2>
        <p>Your page content goes here...</p>
      </div>

    </div>
  );
}
