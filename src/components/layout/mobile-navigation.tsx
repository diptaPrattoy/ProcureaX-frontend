"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { ArrowRight, Menu, X } from "lucide-react";
import Link from "next/link";

import { Logo } from "@/components/brand/logo";
import { Button, buttonVariants } from "@/components/ui/button";
import { publicNavigation } from "@/config/navigation";
import { cn } from "@/lib/utils";

export function MobileNavigation() {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button className="lg:hidden" size="icon" variant="outline" aria-label="Open navigation menu">
          <Menu aria-hidden="true" />
        </Button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/45 backdrop-blur-sm transition-opacity data-[state=closed]:opacity-0 data-[state=open]:opacity-100 data-[state=closed]:duration-200 data-[state=open]:duration-300" />
        <Dialog.Content className="fixed inset-y-0 right-0 z-50 flex w-[min(90vw,24rem)] flex-col border-l border-ink/10 bg-cream p-5 shadow-[-24px_0_80px_-35px_rgba(16,47,45,0.6)] outline-none transition-transform data-[state=closed]:translate-x-full data-[state=open]:translate-x-0 data-[state=closed]:duration-200 data-[state=open]:duration-300 sm:p-7">
          <Dialog.Title className="sr-only">ProcuraX navigation</Dialog.Title>
          <Dialog.Description className="sr-only">
            Navigate the ProcuraX platform or open an account.
          </Dialog.Description>

          <div className="flex items-center justify-between">
            <Logo />
            <Dialog.Close asChild>
              <Button size="icon" variant="ghost" aria-label="Close navigation menu">
                <X aria-hidden="true" />
              </Button>
            </Dialog.Close>
          </div>

          <nav className="mt-12" aria-label="Mobile navigation">
            <p className="mb-4 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-teal">Explore ProcuraX</p>
            <ul className="divide-y divide-ink/10 border-y border-ink/10">
              {publicNavigation.map((item, index) => (
                <li key={item.href}>
                  <Dialog.Close asChild>
                    <Link className="group flex items-center justify-between py-5 text-xl font-semibold tracking-[-0.03em] text-ink" href={item.href}>
                      <span className="flex items-center gap-4">
                        <span className="font-mono text-xs font-medium text-ink/35">0{index + 1}</span>
                        {item.label}
                      </span>
                      <ArrowRight aria-hidden="true" className="size-5 -rotate-45 text-teal transition-transform group-hover:rotate-0" />
                    </Link>
                  </Dialog.Close>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-auto space-y-3 border-t border-ink/10 pt-6">
            <Dialog.Close asChild>
              <Link className={cn(buttonVariants({ size: "lg" }), "w-full")} href="/register">
                Create your workspace
                <ArrowRight aria-hidden="true" />
              </Link>
            </Dialog.Close>
            <Dialog.Close asChild>
              <Link className={cn(buttonVariants({ size: "lg", variant: "outline" }), "w-full")} href="/login">
                Sign in
              </Link>
            </Dialog.Close>
            <p className="pt-2 text-center text-xs leading-5 text-ink/45">
              Purpose-built for buyers, suppliers, and administrators.
            </p>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
