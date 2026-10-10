"use client";

import { RotateCcw } from "lucide-react";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <html lang="en"><body className="flex min-h-svh items-center justify-center bg-[#f8f5ec] p-5 text-[#102f2d]"><main className="max-w-lg rounded-[2rem] border border-[#102f2d]/10 bg-white p-8 text-center shadow-xl"><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#087f75]">ProcuraX</p><h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em]">Something needs another try.</h1><p className="mt-3 text-sm leading-6 text-[#102f2d]/60">The page could not finish loading. Your saved work is not changed.</p><button className="mt-7 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#087f75] px-5 text-sm font-bold text-white" onClick={reset} type="button"><RotateCcw className="size-4" /> Try again</button></main></body></html>;
}
