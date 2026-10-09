import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, Search, SlidersHorizontal, Sparkles } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import { PageHero } from "@/components/marketing/page-hero";
import { SupplierCard } from "@/components/suppliers/supplier-card";
import { SupplierDirectorySkeleton } from "@/components/suppliers/directory-skeleton";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  getProcurementCategories,
  getVerifiedSuppliers,
  type SupplierDirectoryFilters,
} from "@/lib/api/procurement";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Verified suppliers",
  description:
    "Discover verified suppliers by category and location in the public ProcuraX supplier directory.",
};

type DirectorySearchParams = Record<string, string | string[] | undefined>;

type SuppliersPageProps = {
  searchParams: Promise<DirectorySearchParams>;
};

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function cleanText(value: string | undefined, maximumLength: number) {
  const cleaned = value?.trim().slice(0, maximumLength);
  return cleaned || undefined;
}

function getFilters(searchParams: DirectorySearchParams): SupplierDirectoryFilters {
  const requestedPage = Number.parseInt(firstValue(searchParams.page) ?? "1", 10);

  return {
    search: cleanText(firstValue(searchParams.search), 120),
    category: cleanText(firstValue(searchParams.category), 120),
    city: cleanText(firstValue(searchParams.city), 100),
    country: cleanText(firstValue(searchParams.country), 100),
    page: Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1,
    limit: 12,
  };
}

function buildPageHref(filters: SupplierDirectoryFilters, page: number) {
  const query = new URLSearchParams();

  if (filters.search) query.set("search", filters.search);
  if (filters.category) query.set("category", filters.category);
  if (filters.city) query.set("city", filters.city);
  if (filters.country) query.set("country", filters.country);
  if (page > 1) query.set("page", String(page));

  const queryString = query.toString();
  return queryString ? `/suppliers?${queryString}` : "/suppliers";
}

function getVisiblePages(currentPage: number, totalPages: number) {
  const candidates = new Set([1, totalPages, currentPage - 1, currentPage, currentPage + 1]);

  return [...candidates]
    .filter((page) => page > 0 && page <= totalPages)
    .sort((a, b) => a - b);
}

export default function SuppliersPage({ searchParams }: SuppliersPageProps) {
  return (
    <main className="bg-background text-foreground">
      <PageHero
        eyebrow="Verified supplier network"
        title="Find partners ready to deliver."
        description="Search the public ProcuraX network by capability and location. Every company shown here has passed platform verification."
      >
        <Button asChild size="lg">
          <Link href="/register">
            Join as a supplier
            <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
      </PageHero>

      <Suspense fallback={<SupplierDirectorySkeleton />}>
        <SupplierDirectory searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

async function SupplierDirectory({ searchParams }: SuppliersPageProps) {
  const filters = getFilters(await searchParams);
  const [categories, directory] = await Promise.all([
    getProcurementCategories(),
    getVerifiedSuppliers(filters),
  ]);
  const { items: suppliers, pagination } = directory;
  const hasFilters = Boolean(filters.search || filters.category || filters.city || filters.country);
  const visiblePages = getVisiblePages(pagination.page, pagination.totalPages);
  const firstResult = pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1;
  const lastResult = Math.min(pagination.page * pagination.limit, pagination.total);

  return (
    <section className="bg-cream py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <form className="rounded-[1.75rem] border border-ink/10 bg-white p-5 shadow-[0_24px_80px_-58px_rgba(16,47,45,0.55)] sm:p-7" method="get">
          <div className="mb-5 flex items-center gap-2 text-sm font-bold text-ink">
            <SlidersHorizontal aria-hidden="true" className="size-4 text-teal" />
            Refine the directory
          </div>
          <div className="grid gap-4 lg:grid-cols-[1.35fr_1fr_0.8fr_0.8fr_auto] lg:items-end">
            <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.1em] text-ink/45">
              Company or keyword
              <span className="relative block">
                <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-ink/35" />
                <input
                  className="h-12 w-full rounded-xl border border-ink/15 bg-cream/45 pl-11 pr-4 text-sm font-medium normal-case tracking-normal text-ink outline-none transition focus:border-teal focus:bg-white focus:ring-4 focus:ring-teal/10"
                  defaultValue={filters.search}
                  maxLength={120}
                  name="search"
                  placeholder="Search suppliers"
                  type="search"
                />
              </span>
            </label>

            <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.1em] text-ink/45">
              Category
              <select
                className="h-12 w-full rounded-xl border border-ink/15 bg-cream/45 px-4 text-sm font-medium normal-case tracking-normal text-ink outline-none transition focus:border-teal focus:bg-white focus:ring-4 focus:ring-teal/10"
                defaultValue={filters.category ?? ""}
                name="category"
              >
                <option value="">All categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.1em] text-ink/45">
              City
              <input
                className="h-12 w-full rounded-xl border border-ink/15 bg-cream/45 px-4 text-sm font-medium normal-case tracking-normal text-ink outline-none transition focus:border-teal focus:bg-white focus:ring-4 focus:ring-teal/10"
                defaultValue={filters.city}
                maxLength={100}
                name="city"
                placeholder="Dhaka"
              />
            </label>

            <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.1em] text-ink/45">
              Country
              <input
                className="h-12 w-full rounded-xl border border-ink/15 bg-cream/45 px-4 text-sm font-medium normal-case tracking-normal text-ink outline-none transition focus:border-teal focus:bg-white focus:ring-4 focus:ring-teal/10"
                defaultValue={filters.country}
                maxLength={100}
                name="country"
                placeholder="Bangladesh"
              />
            </label>

            <Button className="h-12" type="submit">
              Search
              <ArrowRight aria-hidden="true" />
            </Button>
          </div>
        </form>

        <div className="mt-10 flex flex-col gap-3 border-b border-ink/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Supplier results</p>
            <p className="mt-2 text-sm text-ink/55" aria-live="polite">
              {pagination.total === 0
                ? "No verified suppliers found"
                : `Showing ${firstResult}–${lastResult} of ${pagination.total} verified ${pagination.total === 1 ? "supplier" : "suppliers"}`}
            </p>
          </div>
          {hasFilters ? (
            <Link className="text-sm font-bold text-teal underline-offset-4 hover:underline" href="/suppliers">
              Clear all filters
            </Link>
          ) : null}
        </div>

        {suppliers.length > 0 ? (
          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {suppliers.map((supplier) => (
              <SupplierCard key={supplier.id} supplier={supplier} />
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-[1.75rem] border border-dashed border-ink/20 bg-white px-6 py-16 text-center sm:py-20">
            <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-amber/25 text-ink">
              <Sparkles aria-hidden="true" className="size-6" />
            </span>
            <h2 className="mt-6 text-2xl font-semibold tracking-[-0.035em] text-ink">No exact match yet.</h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-ink/55">
              Try a broader keyword or remove one of the location filters to see more verified partners.
            </p>
            <Link className={cn(buttonVariants({ variant: "outline" }), "mt-7")} href="/suppliers">
              Reset directory
            </Link>
          </div>
        )}

        {pagination.totalPages > 1 ? (
          <nav className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-ink/10 pt-6" aria-label="Supplier directory pages">
            {pagination.page > 1 ? (
              <Link className={buttonVariants({ variant: "outline", size: "sm" })} href={buildPageHref(filters, pagination.page - 1)} prefetch>
                <ArrowLeft aria-hidden="true" />
                Previous
              </Link>
            ) : (
              <span />
            )}

            <div className="flex items-center gap-1.5">
              {visiblePages.map((page, index) => {
                const previousPage = visiblePages[index - 1];
                const showGap = previousPage !== undefined && page - previousPage > 1;

                return (
                  <span className="flex items-center gap-1.5" key={page}>
                    {showGap ? <span className="px-1 text-ink/35">…</span> : null}
                    <Link
                      aria-current={page === pagination.page ? "page" : undefined}
                      aria-label={`Page ${page}`}
                      className={cn(
                        "flex size-10 items-center justify-center rounded-xl text-sm font-bold transition",
                        page === pagination.page ? "bg-ink text-white" : "text-ink/55 hover:bg-white hover:text-ink",
                      )}
                      href={buildPageHref(filters, page)}
                      prefetch
                    >
                      {page}
                    </Link>
                  </span>
                );
              })}
            </div>

            {pagination.page < pagination.totalPages ? (
              <Link className={buttonVariants({ variant: "outline", size: "sm" })} href={buildPageHref(filters, pagination.page + 1)} prefetch>
                Next
                <ArrowRight aria-hidden="true" />
              </Link>
            ) : (
              <span />
            )}
          </nav>
        ) : null}
      </div>
    </section>
  );
}
