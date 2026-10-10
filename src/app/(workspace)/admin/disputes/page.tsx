import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminDisputeQueue } from "@/components/admin/dispute-review";
import { LoadingFeedback } from "@/components/ui/feedback-state";
export const metadata: Metadata = { title: "Dispute review" }; type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };
export default function DisputesPage({ searchParams }: Props) { return <Suspense fallback={<LoadingFeedback />}><AdminDisputeQueue searchParams={searchParams} /></Suspense>; }
