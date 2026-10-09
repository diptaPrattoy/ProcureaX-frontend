import { SupplierDirectorySkeleton } from "@/components/suppliers/directory-skeleton";

export default function SuppliersLoading() {
  return (
    <main className="bg-background text-foreground">
      <section className="border-b border-ink/10 bg-cream">
        <div className="mx-auto max-w-7xl animate-pulse px-5 py-20 sm:px-8 sm:py-28 lg:px-10 lg:py-32">
          <div className="h-4 w-44 rounded-full bg-teal/15" />
          <div className="mt-7 h-20 max-w-3xl rounded-3xl bg-ink/10 sm:h-28" />
          <div className="mt-8 h-7 max-w-xl rounded-2xl bg-ink/8" />
        </div>
      </section>
      <SupplierDirectorySkeleton />
    </main>
  );
}
