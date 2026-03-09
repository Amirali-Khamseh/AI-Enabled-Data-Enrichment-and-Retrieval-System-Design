"use client";

import { useEffect, useRef } from "react";
import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.75;
    }
  }, []);

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          poster="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop"
          aria-hidden="true"
        >
          <source
            src="https://player.vimeo.com/external/434045526.sd.mp4?s=c27eecc69a27dbc4ff2b87d38afc35f1a9e7c02d&profile_id=164&oauth2_token_id=57447761"
            type="video/mp4"
          />
        </video>
        {/* High contrast overlay for accessibility */}
        <div className="absolute inset-0 bg-primary/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <p className="text-primary-foreground text-sm tracking-[0.3em] uppercase mb-6 animate-fade-in">
          Cross-Border Education Alliance
        </p>
        <h1
          id="hero-heading"
          className="text-5xl md:text-7xl lg:text-8xl font-light text-primary-foreground leading-[1.1] tracking-tight mb-8 text-balance"
        >
          We believe in an
          <br />
          <span className="font-medium italic">educational future</span>
          <br />
          without borders.
        </h1>
        <p className="text-primary-foreground/90 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed text-pretty">
          Through joint education, research &amp; innovation, we create positive
          impact on Europe&apos;s cross-border regions.
        </p>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10">
        <Button
          variant="ghost"
          size="lg"
          className="flex flex-col items-center gap-3 text-primary-foreground hover:text-primary-foreground/80 hover:bg-transparent"
          onClick={() =>
            document
              .getElementById("about")
              ?.scrollIntoView({ behavior: "smooth" })
          }
          aria-label="Scroll to About section"
        >
          <span className="text-xs tracking-[0.2em] uppercase">Discover</span>
          <ArrowDown className="w-5 h-5 animate-bounce" />
        </Button>
      </div>
    </section>
  );
}
