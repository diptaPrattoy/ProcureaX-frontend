import { ArrowRight, ClipboardList } from "lucide-react";
import Link from "next/link";

import { ReceiptForm } from "@/components/goods-receipts/receipt-form";
import { Button } from "@/components/ui/button";
import { getGoodsReceipt, listGoodsReceipts } from "@/lib/goods-receipts/api";
import type { UserRole } from "@/lib/auth/contracts";
import type { PurchaseOrderDetail } from "@/lib/purchase-orders/contracts";

export async function OrderReceipts({ order, role }: { order: PurchaseOrderDetail; role: Extract<UserRole, "BUYER" | "SUPPLIER"> }) {
  const list = await listGoodsReceipts(order.id); const details = await Promise.all(list.items.map((item) => getGoodsReceipt(item.id))); const base = role === "BUYER" ? "/buyer/receiving" : "/supplier/deliveries";
  return <section className="mt-8 rounded-[1.75rem] border border-ink/10 bg-white p-6 sm:p-8"><div className="flex items-center justify-between"><div><p className="eyebrow">Delivery record</p><h2 className="mt-2 text-2xl font-semibold text-ink">Goods receipts</h2></div><span className="rounded-full bg-cream px-3 py-1.5 text-xs font-bold text-ink/45">{list.pagination.total} receipts</span></div>{list.items.length ? <div className="mt-6 divide-y divide-ink/10 border-y border-ink/10">{list.items.map((receipt) => <div className="flex flex-col justify-between gap-3 py-4 sm:flex-row sm:items-center" key={receipt.id}><div><div className="flex items-center gap-2"><ClipboardList className="size-4 text-teal" /><p className="font-mono text-sm font-bold text-ink">{receipt.receiptNumber}</p><span className="rounded-full bg-mint/30 px-2 py-0.5 text-[0.62rem] font-bold text-teal">{receipt.status.replaceAll("_", " ")}</span></div><p className="mt-1 text-xs text-ink/40">Received {new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(receipt.receivedAt))}</p></div><Button asChild size="sm" variant="ghost"><Link href={`${base}/${receipt.id}`}>View <ArrowRight /></Link></Button></div>)}</div> : <p className="mt-6 rounded-2xl bg-cream p-5 text-sm text-ink/45">No deliveries have been recorded yet.</p>}{role === "BUYER" && ["IN_PROGRESS", "PARTIALLY_DELIVERED"].includes(order.status) ? <ReceiptForm key={details.length} order={order} receipts={details} /> : null}</section>;
}
