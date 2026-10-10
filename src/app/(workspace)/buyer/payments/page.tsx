import type { Metadata } from "next";
import { Suspense } from "react";

import { PaymentList } from "@/components/payments/payment-list";
import { LoadingFeedback } from "@/components/ui/feedback-state";

export const metadata: Metadata = { title: "Payments" };
type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };
export default function PaymentsPage({ searchParams }: Props) { return <Suspense fallback={<LoadingFeedback />}><PaymentList searchParams={searchParams} /></Suspense>; }
