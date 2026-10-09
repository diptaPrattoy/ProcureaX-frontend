import Link from "next/link";

import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
};

export function Logo({ className }: LogoProps) {
  return (
    <Link className={cn("inline-flex items-center gap-2.5 text-ink", className)} href="/" aria-label="ProcuraX home">
      <span className="relative flex size-9 items-center justify-center overflow-hidden rounded-xl bg-teal shadow-sm shadow-teal/20" aria-hidden="true">
        <span className="absolute h-5 w-1.5 -rotate-45 rounded-full bg-mint" />
        <span className="absolute h-1.5 w-5 -rotate-45 rounded-full bg-white" />
      </span>
      <span className="text-xl font-bold tracking-[-0.045em]">
        procura<span className="text-teal">X</span>
      </span>
    </Link>
  );
}
