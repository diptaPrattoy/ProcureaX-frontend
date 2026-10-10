import type { Metadata } from "next";
import { Suspense } from "react";
import { SupplierReviewQueue } from "@/components/admin/supplier-review-queue";
import { LoadingFeedback } from "@/components/ui/feedback-state";
export const metadata: Metadata = { title: "Supplier verification" }; type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };
export default function SuppliersPage({ searchParams }: Props) { return <Suspense fallback={<LoadingFeedback />}><SupplierReviewQueue searchParams={searchParams} /></Suspense>; }
