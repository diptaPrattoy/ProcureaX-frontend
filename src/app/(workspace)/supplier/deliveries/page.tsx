import type { Metadata } from "next";
import { Suspense } from "react";
import { DeliveryTracking } from "@/components/goods-receipts/delivery-tracking";
import { LoadingFeedback } from "@/components/ui/feedback-state";
export const metadata: Metadata = { title: "Delivery tracking" };
export default function DeliveriesPage() { return <Suspense fallback={<LoadingFeedback />}><DeliveryTracking role="SUPPLIER" /></Suspense>; }
