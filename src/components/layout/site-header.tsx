import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Logo } from "@/components/brand/logo";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { Button } from "@/components/ui/button";
import { publicNavigation } from "@/config/navigation";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-cream/90 backdrop-blur-xl supports-[backdrop-filter]:bg-cream/80">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 sm:h-20 sm:px-8 lg:px-10">
        <Logo />

        <nav className="hidden items-center gap-8 text-sm font-semibold text-ink/65 md:flex" aria-label="Main navigation">
          {publicNavigation.map((item) => (
            <Link className="relative py-2 transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-right after:scale-x-0 after:bg-teal after:transition-transform hover:text-ink hover:after:origin-left hover:after:scale-x-100" href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Button asChild variant="ghost" size="sm">
            <Link href="/login">Sign in</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/register">
              Get started
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>

        <MobileNavigation />
      </div>
    </header>
  );
}
