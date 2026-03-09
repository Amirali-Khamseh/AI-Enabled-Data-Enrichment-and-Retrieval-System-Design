"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface FooterLink {
  label: string;
  href: string;
}

interface FooterLinks {
  alliance: FooterLink[];
  discover: FooterLink[];
  resources: FooterLink[];
  legal: FooterLink[];
}

const footerLinks: FooterLinks = {
  alliance: [
    { label: "About", href: "#about" },
    { label: "Universities", href: "#universities" },
    { label: "Vision", href: "#vision" },
    { label: "Governance", href: "#" },
  ],
  discover: [
    { label: "News", href: "#news" },
    { label: "Events", href: "#events" },
    { label: "Publications", href: "#" },
    { label: "Media", href: "#" },
  ],
  resources: [
    { label: "eCampus", href: "#ecampus" },
    { label: "Student Portal", href: "#" },
    { label: "Staff Portal", href: "#" },
    { label: "Research Hub", href: "#" },
  ],
  legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Use", href: "#" },
    { label: "Cookies", href: "#" },
    { label: "Accessibility", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer
      id="contact"
      className="bg-primary text-primary-foreground"
      role="contentinfo"
    >
      {/* Contact CTA */}
      <div className="border-b border-primary-foreground/20">
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-primary-foreground/70 text-sm tracking-[0.3em] uppercase mb-4">
                Get in Touch
              </p>
              <h2 className="text-4xl md:text-5xl font-light leading-[1.15] text-primary-foreground">
                Ready to collaborate?
                <br />
                <span className="italic font-medium">Let&apos;s connect.</span>
              </h2>
            </div>
            <div className="flex justify-start md:justify-end">
              <Button
                variant="outline"
                size="lg"
                asChild
                className="group border-primary-foreground text-primary hover:bg-black hover:text-white hover:border-none text-lg px-10 py-6 h-auto"
              >
                <Link href="mailto:contact@across-alliance.eu">
                  Contact Us
                  <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Links Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8">
          <nav aria-label="Alliance links">
            <h4 className="text-sm tracking-wide mb-6 text-primary-foreground/70">
              Alliance
            </h4>
            <ul className="space-y-4">
              {footerLinks.alliance.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Discover links">
            <h4 className="text-sm tracking-wide mb-6 text-primary-foreground/70">
              Discover
            </h4>
            <ul className="space-y-4">
              {footerLinks.discover.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Resources links">
            <h4 className="text-sm tracking-wide mb-6 text-primary-foreground/70">
              Resources
            </h4>
            <ul className="space-y-4">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Legal links">
            <h4 className="text-sm tracking-wide mb-6 text-primary-foreground/70">
              Legal
            </h4>
            <ul className="space-y-4">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Bottom Bar */}
      <Separator className="bg-primary-foreground/20" />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-8">
            <span className="text-2xl font-medium tracking-tight text-primary-foreground">
              Across
            </span>
            <span className="text-sm text-primary-foreground/60">
              Co-funded by the European Union
            </span>
          </div>
          <p className="text-sm text-primary-foreground/60">
            &copy; {new Date().getFullYear()} Across Alliance. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
