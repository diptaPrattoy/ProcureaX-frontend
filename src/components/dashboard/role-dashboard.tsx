import { DashboardOverview } from "@/components/dashboard/dashboard-overview";
import { requireRole } from "@/lib/auth/access";
import type { UserRole } from "@/lib/auth/contracts";

export async function RoleDashboard({ role }: { role: UserRole }) {
  const path = `/${role.toLowerCase()}`;
  const user = await requireRole([role], path);
  return <DashboardOverview user={user} />;
}
