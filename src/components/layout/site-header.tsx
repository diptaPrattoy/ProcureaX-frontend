import Link from "next/link";
import { Suspense } from "react";

import { Logo } from "@/components/brand/logo";
import { HeaderSessionActions, HeaderSessionFallback } from "@/components/layout/header-session-actions";
import { publicNavigation } from "@/config/navigation";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-cream/90 backdrop-blur-xl supports-[backdrop-filter]:bg-cream/80">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 sm:h-20 sm:px-8 lg:px-10">
        <Logo />

        <nav className="hidden items-center gap-8 text-sm font-semibold text-ink/65 lg:flex" aria-label="Main navigation">
          {publicNavigation.map((item) => (
            <Link className="relative py-2 transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-right after:scale-x-0 after:bg-teal after:transition-transform hover:text-ink hover:after:origin-left hover:after:scale-x-100" href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <Suspense fallback={<HeaderSessionFallback />}><HeaderSessionActions /></Suspense>
      </div>
    </header>
  );
}
