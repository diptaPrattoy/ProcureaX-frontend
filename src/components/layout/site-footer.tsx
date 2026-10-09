import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { Logo } from "@/components/brand/logo";
import { footerNavigation } from "@/config/navigation";

export function SiteFooter() {
  return (
    <footer className="border-t border-ink/10 bg-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 md:grid-cols-[1.25fr_0.75fr_0.75fr] lg:px-10 lg:py-20">
        <div>
          <Logo />
          <p className="mt-5 max-w-sm text-sm leading-6 text-ink/55">
            One accountable procurement workspace for buyers, suppliers, and platform administrators.
          </p>
          <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-teal/15 bg-teal/5 px-3 py-1.5 text-xs font-bold text-teal">
            <span className="size-1.5 rounded-full bg-teal" />
            Built around real procurement controls
          </div>
        </div>

        <FooterColumn title="Platform" links={footerNavigation.platform} />
        <FooterColumn title="Company" links={footerNavigation.company} />
      </div>

      <div className="border-t border-ink/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-6 text-xs text-ink/45 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
          <p>© 2026 ProcuraX. Purpose-built for accountable B2B procurement.</p>
          <p className="font-semibold uppercase tracking-[0.12em]">Buyer · Supplier · Admin</p>
        </div>
      </div>
    </footer>
  );
}

type FooterColumnProps = {
  title: string;
  links: ReadonlyArray<{ label: string; href: string }>;
};

function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <div>
      <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-ink/40">{title}</h2>
      <ul className="mt-5 space-y-3.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link className="group inline-flex items-center gap-1.5 text-sm font-semibold text-ink/65 transition-colors hover:text-teal" href={link.href}>
              {link.label}
              <ArrowUpRight aria-hidden="true" className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
