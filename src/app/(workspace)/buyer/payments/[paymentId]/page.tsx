import type { Metadata } from "next";
import { Suspense } from "react";

import { PaymentDetail } from "@/components/payments/payment-detail";
import { LoadingFeedback } from "@/components/ui/feedback-state";

export const metadata: Metadata = { title: "Payment details" };
type Props = { params: Promise<{ paymentId: string }> };
export default function PaymentPage({ params }: Props) { return <Suspense fallback={<LoadingFeedback />}><Content params={params} /></Suspense>; }
async function Content({ params }: Props) { const { paymentId } = await params; return <PaymentDetail id={paymentId} />; }
