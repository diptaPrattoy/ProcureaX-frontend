import type { Metadata } from "next";
import { CalendarClock, FilePlus2, Search } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import { Button } from "@/components/ui/button";
import { FeedbackState, LoadingFeedback } from "@/components/ui/feedback-state";
import { requireRole } from "@/lib/auth/access";
import { listBuyerRfqs, RfqApiError } from "@/lib/rfqs/api";
import type { RfqListItem } from "@/lib/rfqs/contracts";

export const metadata: Metadata = { title: "Buyer RFQs" };
type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };
export default function BuyerRfqsPage({ searchParams }: PageProps) { return <Suspense fallback={<LoadingFeedback />}><RfqList searchParams={searchParams} /></Suspense>; }

async function RfqList({ searchParams }: PageProps) {
  await requireRole(["BUYER"], "/buyer/rfqs");
  const params = await searchParams;
  const query = new URLSearchParams({ limit: "20" });
  if (typeof params.search === "string" && params.search.trim()) query.set("search", params.search.trim().slice(0, 120));
  if (typeof params.status === "string" && ["DRAFT", "OPEN", "EVALUATING", "AWARDED", "CLOSED", "CANCELLED", "EXPIRED"].includes(params.status)) query.set("status", params.status);
  let data;
  try { data = await listBuyerRfqs(query); } catch (error) { return <FeedbackState description={error instanceof RfqApiError ? error.message : "RFQs could not be loaded."} title="Unable to load RFQs" tone="danger" />; }
  return <div><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="eyebrow">Sourcing workspace</p><h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-ink sm:text-5xl">Requests for quotation.</h1><p className="mt-3 text-ink/50">Create, publish, and track every sourcing request.</p></div><Button asChild size="lg"><Link href="/buyer/rfqs/new"><FilePlus2 /> Create RFQ</Link></Button></div>
    {params.created === "true" ? <div className="mt-6 rounded-xl border border-teal/20 bg-mint/25 px-4 py-3 text-sm font-semibold text-teal">RFQ draft created successfully.</div> : null}
    <form className="mt-7 flex flex-col gap-3 rounded-2xl border border-ink/10 bg-white p-3 sm:flex-row"><div className="relative flex-1"><Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-ink/30" /><input className="h-11 w-full rounded-xl bg-cream pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-teal/20" defaultValue={typeof params.search === "string" ? params.search : ""} name="search" placeholder="Search RFQs or line items" /></div><select className="h-11 rounded-xl bg-cream px-4 text-sm font-semibold text-ink" defaultValue={typeof params.status === "string" ? params.status : ""} name="status"><option value="">All statuses</option>{["DRAFT", "OPEN", "EVALUATING", "AWARDED", "CLOSED", "CANCELLED", "EXPIRED"].map((status) => <option key={status}>{status}</option>)}</select><Button type="submit" variant="outline">Filter</Button></form>
    <div className="mt-6">{data.items.length ? <div className="grid gap-4">{data.items.map((rfq) => <RfqCard key={rfq.id} rfq={rfq} />)}</div> : <FeedbackState action={<Button asChild><Link href="/buyer/rfqs/new"><FilePlus2 /> Create first RFQ</Link></Button>} compact description="Create a draft to define your requirements and invite comparable supplier responses." title="No RFQs found" />}</div>
    {data.pagination.total > 0 ? <p className="mt-5 text-sm text-ink/45">Showing {data.items.length} of {data.pagination.total} RFQs</p> : null}
  </div>;
}

function RfqCard({ rfq }: { rfq: RfqListItem }) { const deadline = new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(rfq.submissionDeadline)); return <article className="group grid gap-5 rounded-[1.5rem] border border-ink/10 bg-white p-5 transition hover:-translate-y-0.5 hover:border-teal/25 hover:shadow-lg hover:shadow-ink/5 sm:grid-cols-[1fr_auto] sm:items-center"><div><div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-mint/30 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-[0.12em] text-teal">{rfq.status}</span><span className="text-xs font-semibold text-ink/35">{rfq.category.name}</span></div><h2 className="mt-3 text-xl font-semibold tracking-[-0.03em] text-ink">{rfq.title}</h2><div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-ink/45"><span>{rfq._count.items} item{rfq._count.items === 1 ? "" : "s"}</span><span>{rfq._count.quotations} quotation{rfq._count.quotations === 1 ? "" : "s"}</span><span className="inline-flex items-center gap-1.5"><CalendarClock className="size-3.5" /> {deadline}</span></div></div><Button asChild variant="outline"><Link href={`/buyer/rfqs/${rfq.id}`}>View RFQ</Link></Button></article>; }
