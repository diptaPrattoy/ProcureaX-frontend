import type { ReactNode } from "react";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
};

export function PageHero({ eyebrow, title, description, children }: PageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden border-b border-ink/10 bg-cream">
      <div className="hero-grid pointer-events-none absolute inset-0 -z-20 opacity-65" />
      <div className="pointer-events-none absolute left-[65%] top-0 -z-10 size-[30rem] -translate-y-1/2 rounded-full bg-teal/10 blur-3xl" />
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[0.95fr_0.55fr] lg:items-end lg:px-10 lg:py-32">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="mt-6 max-w-4xl text-balance text-[clamp(3.2rem,7vw,6.4rem)] font-semibold leading-[0.94] tracking-[-0.065em] text-ink">
            {title}
          </h1>
        </div>
        <div className="lg:pb-2">
          <p className="max-w-xl text-pretty text-lg leading-8 text-ink/60">{description}</p>
          {children ? <div className="mt-7 flex flex-col gap-3 sm:flex-row">{children}</div> : null}
        </div>
      </div>
    </section>
  );
}
