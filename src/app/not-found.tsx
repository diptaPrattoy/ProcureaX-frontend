import { ArrowLeft, Compass } from "lucide-react";
import Link from "next/link";

import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return <main className="flex min-h-svh items-center justify-center bg-cream p-5" id="main-content" tabIndex={-1}><section className="w-full max-w-xl rounded-[2rem] border border-ink/10 bg-white p-8 text-center shadow-xl sm:p-12"><Logo className="justify-center" /><span className="mx-auto mt-10 flex size-16 items-center justify-center rounded-2xl bg-mint/30 text-teal"><Compass className="size-8" /></span><p className="eyebrow mt-7">404 · Page not found</p><h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em]">This route is not on the map.</h1><p className="mt-4 text-ink/55">The page may have moved, or the link may be incomplete.</p><Button asChild className="mt-8" size="lg"><Link href="/"><ArrowLeft /> Return home</Link></Button></section></main>;
}
