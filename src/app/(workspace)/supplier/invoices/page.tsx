import type { Metadata } from "next";
import { Suspense } from "react";
import { InvoiceList } from "@/components/invoices/invoice-list";
import { LoadingFeedback } from "@/components/ui/feedback-state";
export const metadata: Metadata = { title: "Supplier invoices" }; type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };
export default function SupplierInvoicesPage({ searchParams }: Props) { return <Suspense fallback={<LoadingFeedback />}><InvoiceList role="SUPPLIER" searchParams={searchParams} /></Suspense>; }
