import type { Metadata } from "next";
import { Suspense } from "react";
import { InvoiceDetailView } from "@/components/invoices/invoice-detail";
import { LoadingFeedback } from "@/components/ui/feedback-state";
export const metadata: Metadata = { title: "Invoice review" }; type Props = { params: Promise<{ invoiceId: string }> };
export default function BuyerInvoicePage({ params }: Props) { return <Suspense fallback={<LoadingFeedback />}><Content params={params} /></Suspense>; } async function Content({ params }: Props) { const { invoiceId } = await params; return <InvoiceDetailView id={invoiceId} role="BUYER" />; }
