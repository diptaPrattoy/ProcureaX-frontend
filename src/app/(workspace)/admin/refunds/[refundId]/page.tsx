import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminRefundDetail } from "@/components/admin/refund-review";
import { LoadingFeedback } from "@/components/ui/feedback-state";
export const metadata: Metadata = { title: "Refund review" }; type Props = { params: Promise<{ refundId: string }> };
export default function RefundPage({ params }: Props) { return <Suspense fallback={<LoadingFeedback />}><Content params={params} /></Suspense>; } async function Content({ params }: Props) { const { refundId } = await params; return <AdminRefundDetail id={refundId} />; }
