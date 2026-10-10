import type { Metadata } from "next";
import { Suspense } from "react";
import { ReceiptDetailView } from "@/components/goods-receipts/receipt-detail";
import { LoadingFeedback } from "@/components/ui/feedback-state";
export const metadata: Metadata = { title: "Delivery receipt" };
type Props = { params: Promise<{ goodsReceiptId: string }> };
export default function DeliveryReceiptPage({ params }: Props) { return <Suspense fallback={<LoadingFeedback />}><Content params={params} /></Suspense>; }
async function Content({ params }: Props) { const { goodsReceiptId } = await params; return <ReceiptDetailView id={goodsReceiptId} role="SUPPLIER" />; }
