import type { Metadata } from "next";
import { ArrowLeft, CalendarClock, MapPin, Package } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import { QuotationForm } from "@/components/quotations/quotation-form";
import { Button } from "@/components/ui/button";
import { FeedbackState, LoadingFeedback } from "@/components/ui/feedback-state";
import { requireRole } from "@/lib/auth/access";
import { getOpenRfq, RfqApiError } from "@/lib/rfqs/api";

export const metadata: Metadata = { title: "Opportunity details" };
type Props = { params: Promise<{ rfqId: string }> };
export default function OpportunityPage({ params }: Props) { return <Suspense fallback={<LoadingFeedback />}><Opportunity params={params} /></Suspense>; }
async function Opportunity({ params }: Props) { const { rfqId } = await params; await requireRole(["SUPPLIER"], `/supplier/opportunities/${rfqId}`); let rfq; try { rfq = await getOpenRfq(rfqId); } catch (error) { return <FeedbackState action={<Button asChild variant="outline"><Link href="/supplier/opportunities">Back to opportunities</Link></Button>} description={error instanceof RfqApiError ? error.message : "This opportunity could not be loaded."} title="Opportunity unavailable" tone="danger" />; }
  return <div className="mx-auto max-w-6xl"><Button asChild variant="ghost"><Link href="/supplier/opportunities"><ArrowLeft /> Back to opportunities</Link></Button><div className="mt-6"><span className="rounded-full bg-mint/30 px-3 py-1 text-xs font-bold text-teal">{rfq.category.name}</span><h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-ink sm:text-5xl">{rfq.title}</h1><p className="mt-3 text-sm font-semibold text-ink/40">{rfq.buyer.buyerProfile?.companyName ?? "Verified buyer"}</p><p className="mt-5 max-w-4xl whitespace-pre-wrap leading-7 text-ink/55">{rfq.description}</p></div><div className="mt-7 grid gap-4 sm:grid-cols-3"><Info icon={CalendarClock} label="Closes" value={new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(rfq.submissionDeadline))} /><Info icon={Package} label="Requested" value={`${rfq.items.length} line items`} /><Info icon={MapPin} label="Delivery" value={[rfq.deliveryCity, rfq.deliveryCountry].filter(Boolean).join(", ") || "Not specified"} /></div><section className="mt-8 rounded-[1.75rem] border border-ink/10 bg-white p-6 sm:p-8"><p className="eyebrow">Requested scope</p><div className="mt-5 divide-y divide-ink/10 border-y border-ink/10">{rfq.items.map((item) => <div className="flex justify-between gap-5 py-4" key={item.id}><div><p className="font-bold text-ink">{item.itemName}</p>{item.description ? <p className="mt-1 text-sm text-ink/45">{item.description}</p> : null}</div><p className="shrink-0 text-sm font-bold text-ink">{String(item.quantity)} {item.unit}</p></div>)}</div></section><div className="mt-8"><QuotationForm rfq={rfq} /></div></div>; }
function Info({ icon: Icon, label, value }: { icon: typeof CalendarClock; label: string; value: string }) { return <div className="rounded-2xl border border-ink/10 bg-white p-5"><Icon className="size-5 text-teal" /><p className="mt-3 text-xs font-bold uppercase tracking-[0.12em] text-ink/35">{label}</p><p className="mt-2 text-sm font-semibold text-ink">{value}</p></div>; }
