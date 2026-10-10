"use client";

import { Calculator, LoaderCircle, Send } from "lucide-react";
import { useActionState, useMemo, useState } from "react";

import { submitQuotationAction, type SubmitQuotationState } from "@/app/(workspace)/supplier/opportunities/[rfqId]/actions";
import { Button } from "@/components/ui/button";
import type { RfqDetail } from "@/lib/rfqs/contracts";

const initial: SubmitQuotationState = { status: "idle" };
const field = "mt-2 h-12 w-full rounded-xl border border-ink/15 bg-white px-4 text-sm font-medium text-ink outline-none focus:border-teal focus:ring-4 focus:ring-teal/10";

export function QuotationForm({ rfq }: { rfq: RfqDetail }) {
  const [state, action, pending] = useActionState(submitQuotationAction, initial);
  const [prices, setPrices] = useState(() => rfq.items.map((item) => ({ rfqItemId: item.id, unitPrice: "", notes: "" })));
  const [tax, setTax] = useState("0");
  const subtotal = useMemo(() => rfq.items.reduce((sum, item, index) => sum + Number(item.quantity) * Number(prices[index]?.unitPrice || 0), 0), [prices, rfq.items]);
  const total = subtotal + Number(tax || 0);
  const money = (value: number) => new Intl.NumberFormat("en", { style: "currency", currency: rfq.currency }).format(value);
  return <form action={action} className="rounded-[1.75rem] border border-ink/10 bg-white p-6 sm:p-8" noValidate><input name="rfqId" type="hidden" value={rfq.id} /><input name="currency" type="hidden" value={rfq.currency} /><input name="items" type="hidden" value={JSON.stringify(prices)} /><div className="flex items-start justify-between gap-4"><div><p className="eyebrow">Your commercial offer</p><h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-ink">Price every requested item.</h2></div><span className="rounded-xl bg-mint/30 px-3 py-2 text-xs font-bold text-teal">{rfq.currency}</span></div>{state.message ? <p className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-800" role="alert">{state.message}</p> : null}{state.fieldErrors?.items?.[0] ? <p className="mt-3 text-xs font-semibold text-red-700">{state.fieldErrors.items[0]}</p> : null}
    <div className="mt-6 space-y-4">{rfq.items.map((item, index) => <div className="grid gap-3 rounded-2xl bg-cream p-4 sm:grid-cols-[1fr_10rem] sm:items-end" key={item.id}><div><p className="font-bold text-ink">{item.itemName}</p><p className="mt-1 text-xs text-ink/45">{String(item.quantity)} {item.unit}</p></div><label className="text-xs font-bold text-ink/60">Unit price<input className={field} min="0.01" onChange={(event) => setPrices((current) => current.map((price, priceIndex) => priceIndex === index ? { ...price, unitPrice: event.target.value } : price))} placeholder="0.00" required step="0.01" type="number" value={prices[index].unitPrice} /></label></div>)}</div>
    <div className="mt-6 grid gap-5 sm:grid-cols-2"><Label error={state.fieldErrors?.deliveryDays?.[0]} label="Delivery time (days)" name="deliveryDays" required type="number" /><Label error={state.fieldErrors?.validUntil?.[0]} label="Offer valid until" name="validUntil" required type="date" /><Label label="Tax amount" name="taxAmount" onChange={(event) => setTax(event.target.value)} step="0.01" type="number" value={tax} /><Label label="Terms (optional)" name="terms" placeholder="Payment and delivery terms" /><div className="sm:col-span-2"><Label label="Notes (optional)" name="notes" placeholder="Any qualifications or additional context" /></div></div>
    <div className="mt-6 rounded-2xl bg-ink p-5 text-white"><div className="flex items-center gap-2 text-mint"><Calculator className="size-4" /><p className="text-xs font-bold uppercase tracking-[0.14em]">Calculated total</p></div><div className="mt-4 flex items-end justify-between gap-4"><div><p className="text-sm text-white/45">Subtotal {money(subtotal)} + tax {money(Number(tax || 0))}</p><p className="mt-1 text-3xl font-semibold tracking-[-0.04em]">{money(total)}</p></div><Button disabled={pending} type="submit" variant="secondary">{pending ? <LoaderCircle className="animate-spin" /> : <Send />}{pending ? "Submitting..." : "Submit quotation"}</Button></div></div></form>;
}

function Label({ label, name, error, ...props }: { label: string; name: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) { return <label className="text-sm font-bold text-ink">{label}<input className={field} name={name} {...props} />{error ? <span className="mt-1.5 block text-xs text-red-700">{error}</span> : null}</label>; }
