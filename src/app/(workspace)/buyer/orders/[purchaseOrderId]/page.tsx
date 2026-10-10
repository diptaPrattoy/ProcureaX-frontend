import type { Metadata } from "next";
import { Suspense } from "react";
import { PurchaseOrderDetailView } from "@/components/purchase-orders/purchase-order-detail";
import { LoadingFeedback } from "@/components/ui/feedback-state";
export const metadata: Metadata = { title: "Purchase order" };
type Props = { params: Promise<{ purchaseOrderId: string }> };
export default function BuyerOrderPage({ params }: Props) { return <Suspense fallback={<LoadingFeedback />}><Content params={params} /></Suspense>; }
async function Content({ params }: Props) { const { purchaseOrderId } = await params; return <PurchaseOrderDetailView purchaseOrderId={purchaseOrderId} role="BUYER" />; }
