import type { Metadata } from "next";
import { Suspense } from "react";
import { RefundList } from "@/components/refunds/refund-list";
import { LoadingFeedback } from "@/components/ui/feedback-state";
export const metadata: Metadata = { title: "Refunds" }; type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };
export default function RefundsPage({ searchParams }: Props) { return <Suspense fallback={<LoadingFeedback />}><RefundList searchParams={searchParams} /></Suspense>; }
