import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminRefundQueue } from "@/components/admin/refund-review";
import { LoadingFeedback } from "@/components/ui/feedback-state";
export const metadata: Metadata = { title: "Refund review" }; type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };
export default function RefundsPage({ searchParams }: Props) { return <Suspense fallback={<LoadingFeedback />}><AdminRefundQueue searchParams={searchParams} /></Suspense>; }
