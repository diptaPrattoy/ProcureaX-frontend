import type { Metadata } from "next";
import { Suspense } from "react";
import { PurchaseOrderList } from "@/components/purchase-orders/purchase-order-list";
import { LoadingFeedback } from "@/components/ui/feedback-state";
export const metadata: Metadata = { title: "Buyer purchase orders" };
type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };
export default function BuyerOrdersPage({ searchParams }: Props) { return <Suspense fallback={<LoadingFeedback />}><PurchaseOrderList role="BUYER" searchParams={searchParams} /></Suspense>; }
