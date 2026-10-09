import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight, BadgeCheck, Building2, CalendarCheck, MapPin, UserRound } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { PageHero } from "@/components/marketing/page-hero";
import { Button } from "@/components/ui/button";
import { ApiRequestError, getVerifiedSupplier, type VerifiedSupplier } from "@/lib/api/procurement";

type SupplierProfilePageProps = {
  params: Promise<{ supplierId: string }>;
};

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

function formatVerifiedDate(value: string | null) {
  if (!value) return "Verification date unavailable";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Verification date unavailable";

  return `Verified ${new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date)}`;
}

function isMissingSupplier(error: unknown) {
  return (
    (error instanceof ApiRequestError && error.status === 404) ||
    (typeof error === "object" && error !== null && "status" in error && error.status === 404)
  );
}

async function loadSupplier(supplierId: string) {
  try {
    return await getVerifiedSupplier(supplierId);
  } catch (error) {
    if (isMissingSupplier(error)) notFound();
    throw error;
  }
}

export async function generateMetadata({ params }: SupplierProfilePageProps): Promise<Metadata> {
  const { supplierId } = await params;

  try {
    const supplier = await getVerifiedSupplier(supplierId);
    return {
      title: supplier.companyName,
      description: `View the verified ProcuraX supplier profile for ${supplier.companyName}.`,
    };
  } catch (error) {
    if (isMissingSupplier(error)) notFound();
    return { title: "Supplier profile" };
  }
}

export default function SupplierProfilePage({ params }: SupplierProfilePageProps) {
  return (
    <Suspense fallback={<SupplierProfileSkeleton />}>
      <SupplierProfile params={params} />
    </Suspense>
  );
}

async function SupplierProfile({ params }: SupplierProfilePageProps) {
  const { supplierId } = await params;
  const supplier = await loadSupplier(supplierId);
  const location = getLocation(supplier);
  const website = getSafeWebsite(supplier.website);
  const representative = `${supplier.user.firstName} ${supplier.user.lastName}`.trim();

  return (
    <main className="bg-background text-foreground">
      <PageHero
        eyebrow="Verified supplier profile"
        title={supplier.companyName}
        description={supplier.legalName && supplier.legalName !== supplier.companyName
          ? `${supplier.legalName} is an approved company in the ProcuraX supplier network.`
          : "An approved company in the ProcuraX supplier network."}
      >
        <Button asChild size="lg" variant="outline">
          <Link href="/suppliers">
            <ArrowLeft aria-hidden="true" />
            Back to directory
          </Link>
        </Button>
        {website ? (
          <Button asChild size="lg">
            <a href={website} rel="noreferrer" target="_blank">
              Visit website
              <ArrowUpRight aria-hidden="true" />
            </a>
          </Button>
        ) : null}
      </PageHero>

      <section className="bg-cream py-16 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 sm:px-8 lg:grid-cols-[1.3fr_0.7fr] lg:px-10">
          <article className="rounded-[2rem] border border-ink/10 bg-white p-7 shadow-[0_24px_80px_-58px_rgba(16,47,45,0.55)] sm:p-10">
            <div className="flex flex-col gap-5 border-b border-ink/10 pb-8 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <span className="flex size-14 items-center justify-center rounded-2xl bg-teal text-white">
                  <Building2 aria-hidden="true" className="size-6" />
                </span>
                <div>
                  <p className="eyebrow">Company overview</p>
                  <p className="mt-1 text-sm text-ink/45">Public supplier information</p>
                </div>
              </div>
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-teal/8 px-3.5 py-2 text-xs font-bold text-teal">
                <BadgeCheck aria-hidden="true" className="size-4" />
                ProcuraX verified
              </span>
            </div>

            <dl className="mt-8 grid gap-7 sm:grid-cols-2">
              <div>
                <dt className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-ink/40">
                  <Building2 aria-hidden="true" className="size-4 text-teal" />
                  Legal name
                </dt>
                <dd className="mt-3 text-base font-semibold text-ink">{supplier.legalName ?? supplier.companyName}</dd>
              </div>
              <div>
                <dt className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-ink/40">
                  <MapPin aria-hidden="true" className="size-4 text-teal" />
                  Location
                </dt>
                <dd className="mt-3 text-base font-semibold text-ink">{location || "Not publicly listed"}</dd>
              </div>
              <div>
                <dt className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-ink/40">
                  <UserRound aria-hidden="true" className="size-4 text-teal" />
                  Representative
                </dt>
                <dd className="mt-3 text-base font-semibold text-ink">{representative || "Not publicly listed"}</dd>
              </div>
              <div>
                <dt className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-ink/40">
                  <CalendarCheck aria-hidden="true" className="size-4 text-teal" />
                  Verification
                </dt>
                <dd className="mt-3 text-base font-semibold text-ink">{formatVerifiedDate(supplier.verifiedAt)}</dd>
              </div>
            </dl>
          </article>

          <aside className="rounded-[2rem] bg-ink p-7 text-white sm:p-9">
            <p className="eyebrow text-mint">Capabilities</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.045em]">Registered categories</h2>
            {supplier.categories.length > 0 ? (
              <ul className="mt-8 space-y-3">
                {supplier.categories.map((category, index) => (
                  <li className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.05] p-4" key={category.id}>
                    <span className="font-mono text-xs font-bold text-mint">{String(index + 1).padStart(2, "0")}</span>
                    <span className="text-sm font-semibold">{category.name}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-7 text-sm leading-6 text-white/55">No public categories are listed for this supplier.</p>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
}

function SupplierProfileSkeleton() {
  return (
    <main aria-busy="true" aria-label="Loading supplier profile" className="min-h-[70vh] animate-pulse bg-cream px-5 py-24 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="h-4 w-48 rounded-full bg-teal/15" />
        <div className="mt-8 h-24 max-w-3xl rounded-3xl bg-ink/10" />
        <div className="mt-14 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="h-96 rounded-[2rem] bg-white" />
          <div className="h-96 rounded-[2rem] bg-ink/10" />
        </div>
      </div>
    </main>
  );
}
