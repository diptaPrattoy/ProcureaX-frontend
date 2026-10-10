"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { BarChart3, Bell, ChevronRight, CreditCard, FileText, Home, LogOut, Menu, PackageCheck, ReceiptText, Search, Settings, ShieldCheck, ShoppingCart, Truck, Users, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { logoutAction } from "@/app/(auth)/login/actions";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import type { PublicUser, UserRole } from "@/lib/auth/contracts";
import { cn } from "@/lib/utils";

const navigation = {
  BUYER: [
    ["Overview", "/buyer", Home], ["RFQs", "/buyer/rfqs", FileText], ["Quotations", "/buyer/quotations", BarChart3], ["Purchase orders", "/buyer/orders", ShoppingCart], ["Receiving", "/buyer/receiving", PackageCheck], ["Invoices", "/buyer/invoices", ReceiptText], ["Payments", "/buyer/payments", CreditCard],
  ],
  SUPPLIER: [
    ["Overview", "/supplier", Home], ["Opportunities", "/supplier/opportunities", Search], ["Quotations", "/supplier/quotations", FileText], ["Orders", "/supplier/orders", ShoppingCart], ["Deliveries", "/supplier/deliveries", Truck], ["Invoices", "/supplier/invoices", ReceiptText],
  ],
  ADMIN: [
    ["Overview", "/admin", Home], ["Supplier review", "/admin/suppliers", ShieldCheck], ["Users", "/admin/users", Users], ["Analytics", "/admin/analytics", BarChart3], ["Settings", "/admin/settings", Settings],
  ],
} satisfies Record<UserRole, ReadonlyArray<readonly [string, string, typeof Home]>>;

const roleLabel = { BUYER: "Buyer", SUPPLIER: "Supplier", ADMIN: "Administrator" } satisfies Record<UserRole, string>;
type ShellUser = Pick<PublicUser, "email" | "firstName" | "lastName" | "role">;

export function DashboardShell({ children, user }: { children: ReactNode; user: ShellUser }) {
  const links = navigation[user.role];
  return (
    <div className="min-h-svh bg-[#f4f4ee] lg:grid lg:grid-cols-[17.5rem_1fr]">
      <aside className="hidden border-r border-white/10 bg-ink p-5 text-white lg:sticky lg:top-0 lg:flex lg:h-svh lg:flex-col"><SidebarContent links={links} user={user} /></aside>
      <div className="min-w-0">
        <header className="sticky top-0 z-30 flex h-18 items-center justify-between border-b border-ink/10 bg-[#f4f4ee]/90 px-5 backdrop-blur-xl sm:px-8 lg:h-20 lg:px-10">
          <div className="flex items-center gap-3 lg:hidden"><MobileSidebar links={links} user={user} /><Logo /></div>
          <div className="hidden lg:block"><p className="text-xs font-bold uppercase tracking-[0.14em] text-teal">{roleLabel[user.role]} workspace</p><p className="mt-1 text-sm text-ink/45">Procurement command center</p></div>
          <div className="flex items-center gap-2">
            <Button aria-label="Notifications" size="icon" variant="ghost"><Bell /></Button>
            <span className="hidden size-10 items-center justify-center rounded-xl bg-amber text-sm font-black text-ink sm:flex">{user.firstName[0]}{user.lastName[0]}</span>
          </div>
        </header>
        <main className="mx-auto w-full max-w-[92rem] p-5 sm:p-8 lg:p-10">{children}</main>
      </div>
    </div>
  );
}

function SidebarContent({ links, user, hideLogo = false }: { links: (typeof navigation)[UserRole]; user: ShellUser; hideLogo?: boolean }) {
  const pathname = usePathname();
  return (
    <>
      {hideLogo ? null : <Logo className="px-2 text-white" />}
      <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.06] p-4">
        <p className="truncate text-sm font-bold">{user.firstName} {user.lastName}</p><p className="mt-1 truncate text-xs text-white/40">{user.email}</p>
        <p className="mt-3 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-mint">{roleLabel[user.role]}</p>
      </div>
      <nav aria-label="Workspace navigation" className="mt-8 space-y-1.5">
        {links.map(([label, href, Icon]) => {
          const active = pathname === href || (href !== `/${user.role.toLowerCase()}` && pathname.startsWith(`${href}/`));
          return <Link aria-current={active ? "page" : undefined} className={cn("group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition", active ? "bg-white text-ink" : "text-white/55 hover:bg-white/[0.07] hover:text-white")} href={href} key={href}><Icon className={cn("size-4", active ? "text-teal" : "text-white/35")} /><span>{label}</span>{active ? <ChevronRight className="ml-auto size-4 text-teal" /> : null}</Link>;
        })}
      </nav>
      <form action={logoutAction} className="mt-auto"><Button className="w-full border-white/15 text-white hover:bg-white/10 hover:text-white" type="submit" variant="outline"><LogOut /> Sign out</Button></form>
    </>
  );
}

function MobileSidebar({ links, user }: { links: (typeof navigation)[UserRole]; user: ShellUser }) {
  return (
    <Dialog.Root><Dialog.Trigger asChild><Button aria-label="Open workspace menu" size="icon" variant="outline"><Menu /></Button></Dialog.Trigger><Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-sm" />
      <Dialog.Content className="fixed inset-y-0 left-0 z-50 flex w-[min(88vw,18rem)] flex-col bg-ink p-5 text-white shadow-2xl outline-none">
        <Dialog.Title className="sr-only">Workspace menu</Dialog.Title><Dialog.Description className="sr-only">Navigate your role workspace.</Dialog.Description>
        <div className="flex items-center justify-between"><Logo className="text-white" /><Dialog.Close asChild><Button aria-label="Close menu" className="text-white" size="icon" variant="ghost"><X /></Button></Dialog.Close></div>
        <SidebarContent hideLogo links={links} user={user} />
      </Dialog.Content>
    </Dialog.Portal></Dialog.Root>
  );
}

export function DashboardShellSkeleton() {
  return <div className="min-h-svh animate-pulse bg-[#f4f4ee] lg:grid lg:grid-cols-[17.5rem_1fr]"><div className="hidden bg-ink lg:block" /><div><div className="h-20 border-b border-ink/10" /><div className="grid gap-5 p-8 sm:grid-cols-3"><div className="h-32 rounded-3xl bg-white" /><div className="h-32 rounded-3xl bg-white" /><div className="h-32 rounded-3xl bg-white" /></div></div></div>;
}
