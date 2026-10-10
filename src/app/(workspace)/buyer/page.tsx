import type { Metadata } from "next";
import { Suspense } from "react";

import { RoleDashboard } from "@/components/dashboard/role-dashboard";
import { LoadingFeedback } from "@/components/ui/feedback-state";

export const metadata: Metadata = { title: "Buyer dashboard" };
export default function BuyerDashboardPage() { return <Suspense fallback={<LoadingFeedback />}><RoleDashboard role="BUYER" /></Suspense>; }
