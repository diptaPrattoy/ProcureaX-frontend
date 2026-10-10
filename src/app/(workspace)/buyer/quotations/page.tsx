import type { Metadata } from "next";
import { ArrowRight, Scale } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import { Button } from "@/components/ui/button";
import { FeedbackState, LoadingFeedback } from "@/components/ui/feedback-state";
import { requireRole } from "@/lib/auth/access";
import { listBuyerRfqs } from "@/lib/rfqs/api";

export const metadata: Metadata = { title: "Quotation evaluations" };
export default function BuyerQuotationsPage() { return <Suspense fallback={<LoadingFeedback />}><EvaluationQueue /></Suspense>; }
async function EvaluationQueue() { await requireRole(["BUYER"], "/buyer/quotations"); const data = await listBuyerRfqs(new URLSearchParams({ status: "EVALUATING", limit: "50" })); return <div><p className="eyebrow">Decision queue</p><h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-ink sm:text-5xl">Quotation evaluations.</h1><p className="mt-3 text-ink/50">Compare active offers and turn the best response into a purchase order.</p><div className="mt-8">{data.items.length ? <div className="grid gap-4">{data.items.map((rfq) => <article className="flex flex-col justify-between gap-5 rounded-[1.5rem] border border-ink/10 bg-white p-6 sm:flex-row sm:items-center" key={rfq.id}><div><div className="flex items-center gap-2"><Scale className="size-4 text-teal" /><p className="text-xs font-bold uppercase tracking-[0.12em] text-teal">{rfq._count.quotations} offers under review</p></div><h2 className="mt-3 text-xl font-semibold text-ink">{rfq.title}</h2><p className="mt-1 text-sm text-ink/45">{rfq.category.name}</p></div><Button asChild><Link href={`/buyer/rfqs/${rfq.id}/quotations`}>Evaluate <ArrowRight /></Link></Button></article>)}</div> : <FeedbackState action={<Button asChild variant="outline"><Link href="/buyer/rfqs">View RFQs</Link></Button>} compact description="Start evaluation from an open RFQ after supplier quotations arrive." title="No active evaluations" />}</div></div>; }
