"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface NewsItem {
  id: number;
  category: string;
  date: string;
  title: string;
  description: string;
  image: string;
}

const news: NewsItem[] = [
  {
    id: 1,
    category: "Education",
    date: "07 May 2025",
    title: "OpenScience: Challenges, Practices and Perspectives",
    description:
      "Join us for a day of exploration and exchange on Open Science! Let's study, share, and shape the future of research together.",
    image: "/news-section-education.avif",
  },
  {
    id: 2,
    category: "Education",
    date: "28 April 2025",
    title: "Summer School: How Much Science Is in Science Fiction?",
    description:
      "Are you fascinated by the intersection of science and science fiction? Join us for the Across Summer School 2025.",
    image: "/news-section-education-1.avif",
  },
  {
    id: 3,
    category: "Alliance",
    date: "15 April 2025",
    title: "Rectors' Forum in Montenegro",
    description:
      "The Vice-Rector participated in the 10th Rectors' Forum of Southeast Europe and the Western Balkans.",
    image: "/news-section-education-2.avif",
  },
];

export function NewsSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="news"
      ref={ref}
      className="py-32 md:py-48 bg-muted"
      aria-labelledby="news-heading"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div
          className={`transition-all duration-1000 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16 md:mb-20">
            <div>
              <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-4">
                Latest Updates
              </p>
              <h2
                id="news-heading"
                className="text-4xl md:text-5xl lg:text-6xl font-light text-foreground"
              >
                Across <span className="italic font-medium">News</span>
              </h2>
            </div>
            <Button
              variant="ghost"
              className="group self-start md:self-auto hover:bg-black hover:text-white hover:border-none"
            >
              View all news
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* News Grid */}
          <div
            className="grid md:grid-cols-3 gap-8"
            role="list"
            aria-label="News articles"
          >
            {news.map((item, index) => (
              <article
                key={item.id}
                className="group cursor-pointer"
                style={{
                  transitionDelay: `${index * 150}ms`,
                }}
                role="listitem"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden mb-6 bg-muted-foreground/10">
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                  />
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Badge
                      variant="outline"
                      className="text-muted-foreground border-border"
                    >
                      {item.category}
                    </Badge>
                    <span className="text-muted-foreground">{item.date}</span>
                  </div>
                  <h3 className="text-xl font-light leading-snug group-hover:text-muted-foreground transition-colors text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
