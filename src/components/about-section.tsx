"use client"

import { useRef } from "react"
import { useInView } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface Stat {
  value: string
  label: string
}

const stats: Stat[] = [
  { value: "10", label: "Universities" },
  { value: "10", label: "Countries" },
  { value: "1", label: "Alliance" },
]

export function AboutSection() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section 
      id="about" 
      ref={ref}
      className="py-32 md:py-48 bg-background"
      aria-labelledby="about-heading"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div
          className={`transition-all duration-1000 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          {/* Header */}
          <div className="mb-20">
            <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-4">
              About the Alliance
            </p>
            <h2 
              id="about-heading"
              className="text-4xl md:text-5xl lg:text-6xl font-light leading-[1.15] max-w-4xl text-foreground"
            >
              We are <span className="italic font-medium">Across</span>
            </h2>
          </div>

          {/* Content Grid */}
          <div className="grid md:grid-cols-2 gap-16 md:gap-24">
            {/* Left Column */}
            <div className="space-y-8">
              <p className="text-lg md:text-xl leading-relaxed text-foreground">
                Across is an alliance of 10 universities across Europe. Spanning 10 
                different countries, we are dedicated to fostering cross-border 
                cooperation, promoting academic excellence, and enriching the 
                educational landscape of Europe.
              </p>
              <p className="text-lg leading-relaxed text-muted-foreground">
                Together, we strive to break down barriers, inspire innovation, 
                and empower students, staff, and life-long learners to thrive 
                in a diverse and interconnected world.
              </p>
            </div>

            {/* Right Column - Stats */}
            <div className="flex items-start">
              <div className="grid grid-cols-3 gap-8 w-full">
                {stats.map((stat, index) => (
                  <Card
                    key={stat.label}
                    className="border-0 shadow-none bg-transparent text-center"
                    style={{
                      transitionDelay: `${index * 150}ms`,
                    }}
                  >
                    <CardContent className="p-0">
                      <div className="text-6xl md:text-7xl font-light text-foreground mb-2">
                        {stat.value}
                      </div>
                      <div className="text-sm text-muted-foreground tracking-wide uppercase">
                        {stat.label}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
