import { ArrowLeft, CalendarClock, CircleCheckBig, CreditCard, ExternalLink, ReceiptText } from "lucide-react";
import Link from "next/link";

import { Status } from "@/components/payments/payment-list";
import { RefundRequestForm } from "@/components/refunds/refund-request-form";
import { Button } from "@/components/ui/button";
import { FeedbackState } from "@/components/ui/feedback-state";
import { requireRole } from "@/lib/auth/access";
import { getPayment, PaymentApiError } from "@/lib/payments/api";

export async function PaymentDetail({ id }: { id: string }) {
  await requireRole(["BUYER"], `/buyer/payments/${id}`);
  let payment;
  try {
    payment = await getPayment(id);
  } catch (error) {
    return <FeedbackState action={<Button asChild variant="outline"><Link href="/buyer/payments">Back to payments</Link></Button>} description={error instanceof PaymentApiError ? error.message : "The payment could not be loaded."} title="Unable to load payment" tone="danger" />;
  }
  const supplier = payment.invoice.supplier.supplierProfile?.companyName ?? `${payment.invoice.supplier.firstName} ${payment.invoice.supplier.lastName}`;
  return (
    <div className="mx-auto max-w-5xl">
      <Button asChild variant="ghost"><Link href="/buyer/payments"><ArrowLeft /> Back to payments</Link></Button>
      <section className="relative mt-6 overflow-hidden rounded-[2rem] bg-ink p-7 text-white sm:p-10">
        <div className="absolute -right-16 -top-16 size-56 rounded-full bg-mint/10 blur-2xl" />
        <div className="relative flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
          <div><Status status={payment.status} /><p className="mt-5 text-sm text-white/45">{payment.invoice.invoiceNumber} · {supplier}</p><h1 className="mt-2 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">{money(payment.amount, payment.currency)}</h1></div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-4"><p className="text-xs font-bold uppercase tracking-[0.14em] text-mint">Payment provider</p><p className="mt-2 flex items-center gap-2 font-semibold"><CreditCard className="size-4" /> Stripe</p></div>
        </div>
      </section>
      {payment.failureReason ? <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-5"><p className="text-xs font-bold uppercase tracking-[0.12em] text-red-700">Payment issue</p><p className="mt-2 text-sm text-red-900">{payment.failureReason}</p></div> : null}
      <div className="mt-5 grid gap-5 lg:grid-cols-[1.25fr_.75fr]">
        <section className="rounded-[1.5rem] border border-ink/10 bg-white p-6 sm:p-8">
          <div className="flex items-center gap-3"><CalendarClock className="size-5 text-teal" /><h2 className="text-xl font-semibold">Payment timeline</h2></div>
          <div className="mt-6 space-y-5 border-l border-ink/10 pl-6"><Event icon={CreditCard} label="Checkout initiated" value={date(payment.initiatedAt)} /><Event icon={CircleCheckBig} label="Completed" value={payment.completedAt ? date(payment.completedAt) : "Awaiting confirmation"} muted={!payment.completedAt} />{payment.refundedAt ? <Event icon={ReceiptText} label="Refunded" value={date(payment.refundedAt)} /> : null}</div>
        </section>
        <section className="rounded-[1.5rem] border border-ink/10 bg-white p-6 sm:p-8"><h2 className="text-xl font-semibold">Related record</h2><p className="mt-4 text-xs font-bold uppercase tracking-[0.12em] text-ink/35">Invoice</p><p className="mt-2 font-mono text-sm">{payment.invoice.invoiceNumber}</p><p className="mt-1 text-sm text-ink/45">Due {new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(payment.invoice.dueDate))}</p><Button asChild className="mt-6 w-full" variant="outline"><Link href={`/buyer/invoices/${payment.invoiceId}`}>Open invoice <ArrowLeft className="rotate-180" /></Link></Button>{payment.receiptUrl ? <Button asChild className="mt-3 w-full"><a href={payment.receiptUrl} rel="noreferrer" target="_blank">Stripe receipt <ExternalLink /></a></Button> : null}</section>
      </div>
      {payment.status === "SUCCEEDED" ? <RefundRequestForm amount={payment.amount} currency={payment.currency} paymentId={payment.id} /> : null}
    </div>
  );
}

function Event({ icon: Icon, label, value, muted = false }: { icon: typeof CreditCard; label: string; value: string; muted?: boolean }) { return <div className={muted ? "opacity-45" : ""}><span className="-ml-[2.35rem] inline-flex size-7 items-center justify-center rounded-full bg-cream"><Icon className="size-3.5 text-teal" /></span><p className="-mt-6 ml-1 text-sm font-bold">{label}</p><p className="ml-1 mt-1 text-sm text-ink/45">{value}</p></div>; }
function money(value: string | number, currency: string) { return new Intl.NumberFormat("en", { style: "currency", currency }).format(Number(value)); }
function date(value: string) { return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)); }
