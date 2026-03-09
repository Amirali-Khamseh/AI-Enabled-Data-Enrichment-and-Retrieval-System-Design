"use client";

import { useRef, useState } from "react";
import { useInView } from "framer-motion";
import { ChevronRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Empty } from "@/components/ui/empty";

interface Event {
  id: number;
  date: string;
  month: string;
  title: string;
  type: string;
  location: string;
}

const events: Event[] = [
  {
    id: 1,
    date: "17",
    month: "Jun",
    title: "OpenScience: Challenges, Practices and Perspectives",
    type: "Education",
    location: "Online",
  },
  {
    id: 2,
    date: "24",
    month: "Jun",
    title: "Across Summer School 2025",
    type: "Education",
    location: "Chemnitz, Germany",
  },
  {
    id: 3,
    date: "08",
    month: "Jul",
    title: "Alliance Governance Meeting",
    type: "Governance",
    location: "Udine, Italy",
  },
  {
    id: 4,
    date: "15",
    month: "Sep",
    title: "Research & Innovation Workshop",
    type: "Research",
    location: "Girona, Spain",
  },
];

const filters: string[] = [
  "All",
  "Education",
  "Research",
  "Governance",
  "Regional",
];

export function EventsSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeFilter, setActiveFilter] = useState<string>("All");

  const filteredEvents =
    activeFilter === "All"
      ? events
      : events.filter((e) => e.type === activeFilter);

  return (
    <section
      id="events"
      ref={ref}
      className="py-32 md:py-48 bg-background"
      aria-labelledby="events-heading"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div
          className={`transition-all duration-1000 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-12">
            <div>
              <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-4">
                What&apos;s Happening
              </p>
              <h2
                id="events-heading"
                className="text-4xl md:text-5xl lg:text-6xl font-light text-foreground"
              >
                Upcoming <span className="italic font-medium">Events</span>
              </h2>
            </div>

            {/* Filters */}
            <div
              className="flex flex-wrap gap-2"
              role="group"
              aria-label="Filter events by category"
            >
              {filters.map((filter) => (
                <Button
                  key={filter}
                  variant={activeFilter === filter ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveFilter(filter)}
                  aria-pressed={activeFilter === filter}
                  className={
                    activeFilter === filter
                      ? "bg-foreground text-background hover:bg-foreground/90"
                      : "border-border hover:bg-black hover:text-white hover:border-none"
                  }
                >
                  {filter}
                </Button>
              ))}
            </div>
          </div>

          {/* Events List */}
          <div
            className="border-t border-border"
            role="list"
            aria-label="List of events"
          >
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <article
                  key={event.id}
                  className="group py-8 border-b border-border flex flex-col md:flex-row md:items-center gap-6 cursor-pointer hover:bg-muted/50 transition-colors -mx-6 px-6"
                  role="listitem"
                  tabIndex={0}
                  aria-label={`${event.title} on ${event.month} ${event.date} at ${event.location}`}
                >
                  {/* Date */}
                  <div
                    className="flex-shrink-0 w-20 text-center"
                    aria-hidden="true"
                  >
                    <div className="text-4xl font-light text-foreground">
                      {event.date}
                    </div>
                    <div className="text-sm text-muted-foreground uppercase tracking-wide">
                      {event.month}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
                      <Badge
                        variant="outline"
                        className="border-border text-muted-foreground"
                      >
                        {event.type}
                      </Badge>
                      <span>{event.location}</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-light group-hover:text-muted-foreground transition-colors text-foreground">
                      {event.title}
                    </h3>
                  </div>

                  {/* Arrow */}
                  <ChevronRight
                    className="w-6 h-6 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all"
                    aria-hidden="true"
                  />
                </article>
              ))
            ) : (
              <Empty className="py-16">
                <Calendar className="w-12 h-12 text-muted-foreground/50" />
                <p className="text-muted-foreground mt-4">
                  No events in this category
                </p>
              </Empty>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
