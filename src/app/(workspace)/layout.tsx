import { Suspense } from "react";

import { DashboardShell, DashboardShellSkeleton } from "@/components/dashboard/dashboard-shell";
import { requireUser } from "@/lib/auth/access";

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<DashboardShellSkeleton />}><ProtectedWorkspace>{children}</ProtectedWorkspace></Suspense>;
}

async function ProtectedWorkspace({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  return <DashboardShell user={{ email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role }}>{children}</DashboardShell>;
}
