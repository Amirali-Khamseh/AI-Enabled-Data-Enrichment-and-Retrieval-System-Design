"use client"

import { useRef } from "react"
import { useInView } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface University {
  id: number
  name: string
  country: string
  associated?: boolean
}

const universities: University[] = [
  { id: 1, name: "University of Banja Luka", country: "Bosnia & Herzegovina" },
  { id: 2, name: "Bialystok University of Technology", country: "Poland" },
  { id: 3, name: "Chemnitz University of Technology", country: "Germany" },
  { id: 4, name: "University of Craiova", country: "Romania" },
  { id: 5, name: "University of Girona", country: "Spain" },
  { id: 6, name: "Ivan Franko National University of Lviv", country: "Ukraine", associated: true },
  { id: 7, name: "University of Nova Gorica", country: "Slovenia" },
  { id: 8, name: "University of Perpignan Via Domitia", country: "France" },
  { id: 9, name: "University of Ruse", country: "Bulgaria" },
  { id: 10, name: "University of Udine", country: "Italy" },
]

export function UniversitiesSection() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section 
      id="universities" 
      ref={ref}
      className="py-32 md:py-48 bg-primary text-primary-foreground"
      aria-labelledby="universities-heading"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div
          className={`transition-all duration-1000 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          {/* Header */}
          <div className="mb-16 md:mb-24">
            <p className="text-primary-foreground/70 text-sm tracking-[0.3em] uppercase mb-4">
              Our Network
            </p>
            <h2 
              id="universities-heading"
              className="text-4xl md:text-5xl lg:text-6xl font-light leading-[1.15] max-w-4xl"
            >
              10 Universities. 10 Countries.
              <br />
              <span className="italic font-medium">One Alliance.</span>
            </h2>
          </div>

          {/* Universities Grid */}
          <ul 
            className="grid md:grid-cols-2 gap-0 border-t border-primary-foreground/20"
            role="list"
            aria-label="List of partner universities"
          >
            {universities.map((uni, index) => (
              <li
                key={uni.id}
                className={`group py-6 md:py-8 border-b border-primary-foreground/20 transition-all duration-300 ${
                  index % 2 === 0 ? "md:pr-12 md:border-r" : "md:pl-12"
                }`}
                style={{
                  transitionDelay: `${index * 50}ms`,
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <span className="text-sm text-primary-foreground/50 font-mono mt-1" aria-hidden="true">
                      {String(uni.id).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="text-lg md:text-xl font-light group-hover:text-primary-foreground/80 transition-colors">
                        {uni.name}
                        {uni.associated && (
                          <Badge variant="outline" className="ml-2 text-xs border-primary-foreground/40 text-primary-foreground/60">
                            Associated
                          </Badge>
                        )}
                      </h3>
                      <p className="text-sm text-primary-foreground/60 mt-1">{uni.country}</p>
                    </div>
                  </div>
                  <ArrowUpRight 
                    className="w-5 h-5 text-primary-foreground/40 group-hover:text-primary-foreground transition-colors opacity-0 group-hover:opacity-100" 
                    aria-hidden="true"
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
