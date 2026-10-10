import type { Metadata } from "next";
import { Suspense } from "react";
import { DisputeDetail } from "@/components/disputes/dispute-detail";
import { LoadingFeedback } from "@/components/ui/feedback-state";
export const metadata: Metadata = { title: "Dispute details" }; type Props = { params: Promise<{ disputeId: string }> };
export default function DisputePage({ params }: Props) { return <Suspense fallback={<LoadingFeedback />}><Content params={params} /></Suspense>; } async function Content({ params }: Props) { const { disputeId } = await params; return <DisputeDetail id={disputeId} role="BUYER" />; }
