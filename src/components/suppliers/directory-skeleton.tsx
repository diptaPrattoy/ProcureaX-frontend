export function SupplierDirectorySkeleton() {
  return (
    <section aria-busy="true" aria-label="Loading verified suppliers" className="bg-cream py-16 sm:py-20">
      <div className="mx-auto max-w-7xl animate-pulse px-5 sm:px-8 lg:px-10">
        <div className="h-40 rounded-[1.75rem] border border-ink/10 bg-white" />
        <div className="mt-10 flex items-center justify-between gap-4">
          <div className="h-5 w-48 rounded-full bg-ink/10" />
          <div className="h-5 w-24 rounded-full bg-ink/10" />
        </div>
        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <div className="h-[25rem] rounded-[1.75rem] border border-ink/10 bg-white" key={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
