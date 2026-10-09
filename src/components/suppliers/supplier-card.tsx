import { ArrowUpRight, BadgeCheck, Building2, MapPin, UserRound } from "lucide-react";
import Link from "next/link";

import type { VerifiedSupplier } from "@/lib/api/procurement";

type SupplierCardProps = {
  supplier: VerifiedSupplier;
};

function getInitials(companyName: string) {
  return companyName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");
}

function getLocation(supplier: VerifiedSupplier) {
  return [...new Set([supplier.city, supplier.state, supplier.country].filter(Boolean))].join(", ");
}

function getSafeWebsite(website: string | null) {
  if (!website) return null;

  try {
    const url = new URL(website);
    return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

export function SupplierCard({ supplier }: SupplierCardProps) {
  const location = getLocation(supplier);
  const website = getSafeWebsite(supplier.website);
  const representative = `${supplier.user.firstName} ${supplier.user.lastName}`.trim();

  return (
    <article className="group flex min-h-[25rem] flex-col rounded-[1.75rem] border border-ink/10 bg-white p-6 shadow-[0_20px_70px_-50px_rgba(16,47,45,0.45)] transition duration-300 hover:-translate-y-1 hover:border-teal/25 hover:shadow-[0_26px_80px_-44px_rgba(8,127,117,0.32)] sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-teal text-lg font-bold tracking-[-0.04em] text-white shadow-sm shadow-teal/20">
          {getInitials(supplier.companyName) || <Building2 aria-hidden="true" className="size-5" />}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-teal/8 px-3 py-1.5 text-xs font-bold text-teal">
          <BadgeCheck aria-hidden="true" className="size-4" />
          Verified
        </span>
      </div>

      <div className="mt-7">
        <h2 className="text-2xl font-semibold leading-tight tracking-[-0.04em] text-ink">
          <Link className="transition-colors hover:text-teal" href={`/suppliers/${supplier.id}`}>
            {supplier.companyName}
          </Link>
        </h2>
        {supplier.legalName && supplier.legalName !== supplier.companyName ? (
          <p className="mt-2 text-sm leading-6 text-ink/45">{supplier.legalName}</p>
        ) : null}
      </div>

      <div className="mt-6 space-y-3 text-sm text-ink/55">
        {location ? (
          <p className="flex items-start gap-2.5">
            <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-teal" />
            <span>{location}</span>
          </p>
        ) : null}
        {representative ? (
          <p className="flex items-start gap-2.5">
            <UserRound aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-teal" />
            <span>{representative}</span>
          </p>
        ) : null}
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {supplier.categories.slice(0, 3).map((category) => (
          <span className="rounded-full border border-ink/10 bg-cream px-3 py-1.5 text-xs font-semibold text-ink/60" key={category.id}>
            {category.name}
          </span>
        ))}
        {supplier.categories.length > 3 ? (
          <span className="rounded-full border border-ink/10 px-3 py-1.5 text-xs font-semibold text-ink/45">
            +{supplier.categories.length - 3}
          </span>
        ) : null}
      </div>

      <div className="mt-auto flex items-center justify-between gap-4 border-t border-ink/10 pt-6">
        <Link className="inline-flex items-center gap-2 text-sm font-bold text-teal hover:text-[#066d65]" href={`/suppliers/${supplier.id}`}>
          View profile
          <ArrowUpRight aria-hidden="true" className="size-4" />
        </Link>
        {website ? (
          <a className="text-xs font-semibold text-ink/45 underline-offset-4 hover:text-ink hover:underline" href={website} rel="noreferrer" target="_blank">
            Website
          </a>
        ) : null}
      </div>
    </article>
  );
}
