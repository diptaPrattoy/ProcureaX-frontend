import type { Metadata } from "next";
import { ArrowLeft, CalendarClock, MapPin, Package, Scale } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import { Button } from "@/components/ui/button";
import { FeedbackState, LoadingFeedback } from "@/components/ui/feedback-state";
import { requireRole } from "@/lib/auth/access";
import { getBuyerRfq, RfqApiError } from "@/lib/rfqs/api";

export const metadata: Metadata = { title: "RFQ details" };
type PageProps = { params: Promise<{ rfqId: string }> };
export default function BuyerRfqDetailPage({ params }: PageProps) { return <Suspense fallback={<LoadingFeedback />}><RfqDetail params={params} /></Suspense>; }

async function RfqDetail({ params }: PageProps) {
  const { rfqId } = await params;
  await requireRole(["BUYER"], `/buyer/rfqs/${rfqId}`);
  let rfq;
  try { rfq = await getBuyerRfq(rfqId); } catch (error) { return <FeedbackState action={<Button asChild variant="outline"><Link href="/buyer/rfqs">Back to RFQs</Link></Button>} description={error instanceof RfqApiError ? error.message : "This RFQ could not be loaded."} title="Unable to load RFQ" tone="danger" />; }
  const budget = rfq.budgetMin !== null || rfq.budgetMax !== null ? `${rfq.currency} ${rfq.budgetMin ?? "0"} - ${rfq.budgetMax ?? "Open"}` : "Not specified";
  return <div className="mx-auto max-w-6xl"><div className="flex items-center justify-between gap-4"><Button asChild variant="ghost"><Link href="/buyer/rfqs"><ArrowLeft /> Back to RFQs</Link></Button><Button asChild><Link href={`/buyer/rfqs/${rfq.id}/quotations`}><Scale /> Compare quotations ({rfq._count.quotations})</Link></Button></div><div className="mt-6 flex flex-col justify-between gap-5 sm:flex-row sm:items-start"><div><div className="flex items-center gap-2"><span className="rounded-full bg-mint/30 px-3 py-1 text-xs font-bold text-teal">{rfq.status}</span><span className="text-sm font-semibold text-ink/40">{rfq.category.name}</span></div><h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-ink sm:text-5xl">{rfq.title}</h1><p className="mt-4 max-w-3xl whitespace-pre-wrap leading-7 text-ink/55">{rfq.description}</p></div><div className="rounded-2xl border border-ink/10 bg-white px-5 py-4"><p className="text-xs font-bold uppercase tracking-[0.14em] text-ink/35">Budget</p><p className="mt-2 text-lg font-bold text-ink">{budget}</p></div></div>
    <div className="mt-8 grid gap-4 sm:grid-cols-3"><Info icon={CalendarClock} label="Submission deadline" value={new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(rfq.submissionDeadline))} /><Info icon={Package} label="Expected delivery" value={rfq.expectedDeliveryDate ? new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(rfq.expectedDeliveryDate)) : "Not specified"} /><Info icon={MapPin} label="Delivery" value={[rfq.deliveryCity, rfq.deliveryCountry].filter(Boolean).join(", ") || "Not specified"} /></div>
    <section className="mt-8 rounded-[1.75rem] border border-ink/10 bg-white p-6 sm:p-8"><div className="flex items-center justify-between"><div><p className="eyebrow">Requested scope</p><h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-ink">{rfq.items.length} line item{rfq.items.length === 1 ? "" : "s"}</h2></div></div><div className="mt-6 divide-y divide-ink/10 border-y border-ink/10">{rfq.items.map((item, index) => <div className="grid gap-2 py-5 sm:grid-cols-[3rem_1fr_auto] sm:items-center" key={item.id}><span className="font-mono text-xs text-ink/30">{String(index + 1).padStart(2, "0")}</span><div><p className="font-bold text-ink">{item.itemName}</p>{item.description ? <p className="mt-1 text-sm text-ink/45">{item.description}</p> : null}</div><p className="text-sm font-bold text-ink">{String(item.quantity)} {item.unit}</p></div>)}</div></section>
  </div>;
}

function Info({ icon: Icon, label, value }: { icon: typeof CalendarClock; label: string; value: string }) { return <article className="rounded-2xl border border-ink/10 bg-white p-5"><Icon className="size-5 text-teal" /><p className="mt-4 text-xs font-bold uppercase tracking-[0.12em] text-ink/35">{label}</p><p className="mt-2 text-sm font-semibold text-ink">{value}</p></article>; }
