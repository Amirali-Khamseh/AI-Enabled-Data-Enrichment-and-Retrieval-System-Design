"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import {
  Monitor,
  MessageSquare,
  BookOpen,
  Lightbulb,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: Monitor,
    title: "Digital Learning",
    description:
      "Seamlessly integrated components for modern education delivery.",
  },
  {
    icon: MessageSquare,
    title: "Communication",
    description:
      "Connect with peers and faculty across all partner institutions.",
  },
  {
    icon: BookOpen,
    title: "Resources",
    description: "Access shared educational materials and research databases.",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description:
      "Collaborate on research and innovation projects across borders.",
  },
];

export function ECampusSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="ecampus"
      ref={ref}
      className="py-32 md:py-48 bg-primary text-primary-foreground"
      aria-labelledby="ecampus-heading"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div
          className={`transition-all duration-1000 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-20">
            <p className="text-primary-foreground/70 text-sm tracking-[0.3em] uppercase mb-6">
              Coming Soon
            </p>
            <h2
              id="ecampus-heading"
              className="text-4xl md:text-5xl lg:text-6xl font-light leading-[1.15] mb-8"
            >
              The <span className="italic font-medium">eCampus</span>
            </h2>
            <p className="text-lg md:text-xl text-primary-foreground/90 leading-relaxed">
              A joint digital space equipped with seamlessly integrated
              components for communication, education and R&amp;I — the digital
              heart of our university alliance.
            </p>
          </div>

          {/* Features Grid */}
          <div
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12"
            role="list"
            aria-label="eCampus features"
          >
            {features.map((feature, index) => (
              <Card
                key={feature.title}
                className="group text-center bg-transparent border-0 shadow-none"
                style={{
                  transitionDelay: `${index * 100}ms`,
                }}
                role="listitem"
              >
                <CardContent className="p-0">
                  <div
                    className="w-16 h-16 mx-auto mb-6 border border-primary-foreground/30 flex items-center justify-center group-hover:border-primary-foreground/60 transition-colors"
                    aria-hidden="true"
                  >
                    <feature.icon className="w-7 h-7 text-primary-foreground/80 group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <h3 className="text-lg font-light mb-3 text-primary-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-primary-foreground/70 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-20 text-center">
            <Button
              variant="outline"
              size="lg"
              className="border-primary-foreground text-primary hover:bg-black hover:text-white hover:border-none"
            >
              Notify Me When Available
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
