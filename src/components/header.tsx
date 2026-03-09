"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { SearchModal } from "@/components/search-modal";

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: "About", href: "#about" },
  { label: "Universities", href: "#universities" },
  { label: "News", href: "#news" },
  { label: "Events", href: "#events" },
  { label: "Contact", href: "#contact" },
];

const logoText = "Across";

export function Header() {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchOpen, setSearchOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (<>
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md border-b border-border"
          : "bg-transparent"
      }`}
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            href="/"
            className="relative z-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Across Alliance Home"
          >
            <span
              className={`text-2xl font-medium tracking-tight transition-colors ${
                isScrolled ? "text-foreground" : "text-primary-foreground"
              }`}
            >
              {logoText.split("").map((letter, index) => (
                <span
                  key={`${letter}-${index}`}
                  className="animate-logo-letter inline-block"
                  style={{ animationDelay: `${index * 90}ms` }}
                >
                  {letter === " " ? "\u00a0" : letter}
                </span>
              ))}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav
            className="hidden md:flex items-center gap-8"
            aria-label="Main navigation"
          >
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`text-sm tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring hover:opacity-80 ${
                  isScrolled ? "text-foreground" : "text-primary-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <button
              onClick={() => setSearchOpen(true)}
              className={`transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring hover:opacity-80 ${
                isScrolled ? "text-foreground" : "text-primary-foreground"
              }`}
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
            <Button
              variant="outline"
              asChild
              className={`${
                isScrolled
                  ? "border-foreground text-foreground hover:bg-foreground hover:text-background"
                  : "border-primary-foreground text-foreground hover:bg-primary-foreground hover:text-foreground"
              }`}
            >
              <Link href="#ecampus">eCampus</Link>
            </Button>
          </nav>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={`md:hidden ${
                  isScrolled ? "text-foreground" : "text-primary-foreground"
                }`}
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-full sm:w-[400px] bg-background"
            >
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <nav
                className="flex flex-col items-center justify-center h-full gap-8"
                aria-label="Mobile navigation"
              >
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="text-3xl font-light text-foreground hover:text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {item.label}
                  </Link>
                ))}
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setSearchOpen(true);
                  }}
                  className="flex items-center gap-2 text-3xl font-light text-foreground hover:text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Search className="h-6 w-6" />
                  Search
                </button>
                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="mt-4 border-foreground text-foreground hover:bg-foreground hover:text-background"
                >
                  <Link href="#ecampus" onClick={() => setIsOpen(false)}>
                    eCampus
                  </Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>

    <SearchModal open={searchOpen} onOpenChange={setSearchOpen} />
    </>);
}
