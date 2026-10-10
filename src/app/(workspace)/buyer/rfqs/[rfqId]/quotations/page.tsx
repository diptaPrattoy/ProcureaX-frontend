import type { Metadata } from "next";
import { ArrowLeft, Scale } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import { StartEvaluationButton } from "@/components/quotations/evaluation-actions";
import { QuotationComparison } from "@/components/quotations/quotation-comparison";
import { Button } from "@/components/ui/button";
import { FeedbackState, LoadingFeedback } from "@/components/ui/feedback-state";
import { requireRole } from "@/lib/auth/access";
import { listRfqQuotations, QuotationApiError } from "@/lib/quotations/api";
import { getBuyerRfq } from "@/lib/rfqs/api";

export const metadata: Metadata = { title: "Quotation evaluation" };
type PageProps = { params: Promise<{ rfqId: string }> };
export default function QuotationEvaluationPage({ params }: PageProps) { return <Suspense fallback={<LoadingFeedback />}><Evaluation params={params} /></Suspense>; }

async function Evaluation({ params }: PageProps) {
  const { rfqId } = await params; await requireRole(["BUYER"], `/buyer/rfqs/${rfqId}/quotations`);
  let rfq; let data;
  try { [rfq, data] = await Promise.all([getBuyerRfq(rfqId), listRfqQuotations(rfqId)]); } catch (error) { return <FeedbackState action={<Button asChild variant="outline"><Link href={`/buyer/rfqs/${rfqId}`}>Back to RFQ</Link></Button>} description={error instanceof QuotationApiError ? error.message : "The evaluation workspace could not be loaded."} title="Unable to load quotations" tone="danger" />; }
  return <div><Button asChild variant="ghost"><Link href={`/buyer/rfqs/${rfqId}`}><ArrowLeft /> Back to RFQ</Link></Button><div className="mt-6 flex flex-col justify-between gap-6 sm:flex-row sm:items-end"><div><p className="eyebrow">Commercial evaluation</p><h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-ink sm:text-5xl">Compare {data.pagination.total} quotation{data.pagination.total === 1 ? "" : "s"}.</h1><p className="mt-3 max-w-2xl text-ink/50">{rfq.title} · {rfq.currency}</p></div>{rfq.status === "OPEN" && data.items.length > 0 ? <StartEvaluationButton rfqId={rfqId} /> : null}</div>{rfq.status === "OPEN" ? <div className="mt-7 flex items-start gap-3 rounded-2xl border border-amber/35 bg-amber/15 p-4 text-sm leading-6 text-ink/60"><Scale className="mt-0.5 size-5 shrink-0 text-ink" /> Start evaluation when submissions are complete. This locks the RFQ and moves eligible quotations under review.</div> : null}<div className="mt-7">{data.items.length ? <QuotationComparison quotations={data.items} rfqId={rfqId} rfqStatus={rfq.status} /> : <FeedbackState compact description="Supplier responses will appear here after they submit quotations." title="No quotations received" />}</div></div>;
}
