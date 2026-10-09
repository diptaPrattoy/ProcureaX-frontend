"use client";

import { RotateCcw, TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";

type SuppliersErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function SuppliersError({ error, reset }: SuppliersErrorProps) {
  return (
    <main className="flex min-h-[65vh] items-center bg-cream px-5 py-20 sm:px-8">
      <div className="mx-auto w-full max-w-2xl rounded-[2rem] border border-ink/10 bg-white p-8 text-center shadow-[0_30px_90px_-60px_rgba(16,47,45,0.55)] sm:p-12">
        <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-amber/25 text-ink">
          <TriangleAlert aria-hidden="true" className="size-6" />
        </span>
        <p className="eyebrow mt-7">Directory unavailable</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-ink">We could not load suppliers.</h1>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-ink/55">
          The supplier service may be waking up or temporarily unavailable. Your search is still here, so it is safe to try again.
        </p>
        <Button className="mt-8" onClick={reset}>
          <RotateCcw aria-hidden="true" />
          Try again
        </Button>
        {error.digest ? <p className="mt-6 font-mono text-[0.68rem] text-ink/30">Reference: {error.digest}</p> : null}
      </div>
    </main>
  );
}
