import type { Metadata } from "next";
import { Suspense } from "react";

import { AnalyticsDashboard } from "@/components/admin/analytics-dashboard";
import { LoadingFeedback } from "@/components/ui/feedback-state";

export const metadata: Metadata = { title: "Platform analytics" };
type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };
export default function AnalyticsPage({ searchParams }: Props) { return <Suspense fallback={<LoadingFeedback />}><AnalyticsDashboard searchParams={searchParams} /></Suspense>; }
