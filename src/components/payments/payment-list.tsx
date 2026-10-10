import { ArrowRight, CreditCard } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { FeedbackState } from "@/components/ui/feedback-state";
import { requireRole } from "@/lib/auth/access";
import { listPayments, PaymentApiError } from "@/lib/payments/api";
import { paymentStatusSchema } from "@/lib/payments/contracts";

const statuses = paymentStatusSchema.options;

export async function PaymentList({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requireRole(["BUYER"], "/buyer/payments");
  const params = await searchParams;
  const query = new URLSearchParams({ limit: "50", sortOrder: "desc" });
  if (typeof params.status === "string" && statuses.includes(params.status as (typeof statuses)[number])) query.set("status", params.status);

  let data;
  try {
    data = await listPayments(query);
  } catch (error) {
    return <FeedbackState description={error instanceof PaymentApiError ? error.message : "Payments could not be loaded."} title="Unable to load payments" tone="danger" />;
  }

  return (
    <div>
      <p className="eyebrow">Accounts payable</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-ink sm:text-5xl">Payments.</h1>
      <p className="mt-3 text-ink/50">Follow every Stripe payment from checkout to settlement.</p>
      <form className="mt-7 flex max-w-xl gap-3 rounded-2xl border border-ink/10 bg-white p-3">
        <select className="h-11 flex-1 rounded-xl bg-cream px-4 text-sm font-semibold" defaultValue={typeof params.status === "string" ? params.status : ""} name="status">
          <option value="">All payment statuses</option>
          {statuses.map((status) => <option key={status}>{status}</option>)}
        </select>
        <Button type="submit" variant="outline">Filter</Button>
      </form>
      <div className="mt-6">
        {data.items.length ? <div className="grid gap-4">{data.items.map((payment) => {
          const supplier = payment.invoice.supplier.supplierProfile?.companyName ?? `${payment.invoice.supplier.firstName} ${payment.invoice.supplier.lastName}`;
          return (
            <article className="grid gap-5 rounded-[1.5rem] border border-ink/10 bg-white p-6 sm:grid-cols-[1fr_auto] sm:items-center" key={payment.id}>
              <div>
                <div className="flex flex-wrap items-center gap-2"><Status status={payment.status} /><span className="font-mono text-xs text-ink/35">{payment.invoice.invoiceNumber}</span></div>
                <h2 className="mt-3 text-xl font-semibold text-ink">{money(payment.amount, payment.currency)}</h2>
                <p className="mt-1 text-sm text-ink/45">{supplier} · Stripe</p>
                <p className="mt-3 text-xs text-ink/40">Started {date(payment.initiatedAt)}</p>
              </div>
              <Button asChild variant="outline"><Link href={`/buyer/payments/${payment.id}`}>View payment <ArrowRight /></Link></Button>
            </article>
          );
        })}</div> : <FeedbackState compact description="A payment record appears here as soon as you open Stripe checkout for an approved invoice." icon={CreditCard} title="No payments found" />}
      </div>
    </div>
  );
}

export function Status({ status }: { status: string }) {
  const tone = status === "SUCCEEDED" ? "bg-mint/35 text-teal" : status === "FAILED" || status === "CANCELLED" ? "bg-red-50 text-red-700" : status === "REFUNDED" ? "bg-blue-50 text-blue-700" : "bg-amber/25 text-ink";
  return <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${tone}`}>{status.replaceAll("_", " ")}</span>;
}

function money(value: string | number, currency: string) { return new Intl.NumberFormat("en", { style: "currency", currency }).format(Number(value)); }
function date(value: string) { return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)); }
