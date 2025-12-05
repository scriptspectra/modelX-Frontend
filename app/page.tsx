'use client';

import { useEffect, useRef } from "react";

export default function Home() {
  // Type the ref as HTMLVideoElement or null
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    // Play video once on page load
    if (videoRef.current) {
      videoRef.current.play();
    }
  }, []);

  return (
    <div className="relative flex min-h-screen items-center justify-center font-sans">
      {/* Background Video */}
      <video
        ref={videoRef}
        autoPlay
        muted
        className="fixed top-0 left-0 w-full h-full object-cover z-[-1]"
      >
        <source src="/videos/hero.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Page Content */}
      <div className="">
        
      </div>
    </div>
  );
}
