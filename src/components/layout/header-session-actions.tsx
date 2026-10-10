import { ArrowRight, LogOut } from "lucide-react";
import Link from "next/link";

import { logoutAction } from "@/app/(auth)/login/actions";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth/session";

export async function HeaderSessionActions() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <>
        <div className="hidden items-center gap-2 lg:flex">
          <Button asChild size="sm" variant="ghost"><Link href="/login">Sign in</Link></Button>
          <Button asChild size="sm"><Link href="/register">Get started <ArrowRight aria-hidden="true" /></Link></Button>
        </div>
        <MobileNavigation />
      </>
    );
  }

  return (
    <>
      <div className="hidden items-center gap-3 lg:flex">
        <span className="max-w-36 truncate text-sm font-semibold text-ink/55">Hi, {user.firstName}</span>
        <Button asChild size="sm"><Link href="/workspace">Open workspace <ArrowRight aria-hidden="true" /></Link></Button>
        <form action={logoutAction}><Button aria-label="Sign out" size="icon" type="submit" variant="ghost"><LogOut aria-hidden="true" /></Button></form>
      </div>
      <MobileNavigation user={{ email: user.email, firstName: user.firstName, role: user.role }} />
    </>
  );
}

export function HeaderSessionFallback() {
  return <div aria-hidden="true" className="h-10 w-36 animate-pulse rounded-xl bg-ink/5" />;
}
