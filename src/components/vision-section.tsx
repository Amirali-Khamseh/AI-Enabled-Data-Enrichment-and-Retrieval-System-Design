"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface KeyArea {
  title: string;
  description: string;
}

const keyAreas: KeyArea[] = [
  { title: "Education", description: "Joint programs & mobility" },
  { title: "Research", description: "Cross-border innovation" },
  { title: "Impact", description: "Regional engagement" },
];

export function VisionSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="py-32 md:py-48 bg-background overflow-hidden"
      aria-labelledby="vision-heading"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div
          className={`transition-all duration-1000 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <div className="grid lg:grid-cols-2 gap-16 md:gap-24 items-center">
            {/* Image */}
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src="/vision-section.avif"
                alt="Students collaborating on a project in a modern university setting"
                fill
                className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-foreground/5" />
            </div>

            {/* Content */}
            <div className="lg:py-12">
              <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-6">
                Our Vision
              </p>
              <h2
                id="vision-heading"
                className="text-3xl md:text-4xl lg:text-5xl font-light leading-[1.2] mb-8 text-foreground text-balance"
              >
                Creating unique
                <br />
                <span className="italic font-medium">learning pathways</span>
                <br />
                without barriers.
              </h2>
              <p className="text-lg leading-relaxed text-foreground mb-8">
                We help students, staff and regional stakeholders to realise
                their full potential by co-creating new and exciting
                opportunities and experiences for our cross-border regions.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Increasing and streamlining mobility between our institutions
                with their individual strengths is key to create unique learning
                pathways without barriers.
              </p>

              {/* Key Areas */}
              <Separator className="my-12" />
              <div className="grid grid-cols-3 gap-8">
                {keyAreas.map((area) => (
                  <div key={area.title}>
                    <h4 className="text-sm font-medium tracking-wide mb-2 text-foreground">
                      {area.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {area.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
