import type { Metadata } from "next";
import { Suspense } from "react";

import { RoleDashboard } from "@/components/dashboard/role-dashboard";
import { LoadingFeedback } from "@/components/ui/feedback-state";

export const metadata: Metadata = { title: "Admin dashboard" };
export default function AdminDashboardPage() { return <Suspense fallback={<LoadingFeedback />}><RoleDashboard role="ADMIN" /></Suspense>; }
