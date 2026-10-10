import { z } from "zod";

import { paginationSchema } from "@/lib/rfqs/contracts";

const quantity = z.union([z.string(), z.number()]);
export const receiptStatusSchema = z.enum(["PENDING", "ACCEPTED", "PARTIALLY_ACCEPTED", "REJECTED"]);
export const receiptListItemSchema = z.object({ id: z.uuid(), receiptNumber: z.string(), status: receiptStatusSchema, receivedAt: z.string(), inspectedAt: z.string().nullable(), notes: z.string().nullable(), purchaseOrderId: z.uuid(), _count: z.object({ items: z.number() }) });
export const receiptDetailSchema = z.object({
  id: z.uuid(), receiptNumber: z.string(), purchaseOrderId: z.uuid(), buyerId: z.uuid(), status: receiptStatusSchema, receivedAt: z.string(), inspectedAt: z.string().nullable(), notes: z.string().nullable(), createdAt: z.string(), updatedAt: z.string(),
  purchaseOrder: z.object({ id: z.uuid(), poNumber: z.string(), status: z.string(), buyerId: z.uuid(), supplierId: z.uuid(), currency: z.string(), supplier: z.object({ supplierProfile: z.object({ companyName: z.string() }).nullable() }), buyer: z.object({ buyerProfile: z.object({ companyName: z.string() }).nullable() }) }),
  items: z.array(z.object({ id: z.uuid(), purchaseOrderItemId: z.uuid(), quantityReceived: quantity, quantityAccepted: quantity, quantityRejected: quantity, notes: z.string().nullable(), purchaseOrderItem: z.object({ itemName: z.string(), quantity, unit: z.string(), unitPrice: quantity }) })),
});
const inputQuantity = z.coerce.number().nonnegative().max(999_999_999);
export const createReceiptInputSchema = z.object({ notes: z.string().trim().max(1000).optional(), items: z.array(z.object({ purchaseOrderItemId: z.uuid(), quantityReceived: inputQuantity.positive(), quantityAccepted: inputQuantity, quantityRejected: inputQuantity, notes: z.string().trim().max(500).optional() })).min(1).max(50) }).superRefine((value, context) => value.items.forEach((item, index) => { if (Math.abs(item.quantityAccepted + item.quantityRejected - item.quantityReceived) > 0.0001) context.addIssue({ code: "custom", path: ["items", index], message: "Accepted plus rejected must equal received." }); }));
export const receiptListSchema = z.object({ items: z.array(receiptListItemSchema), pagination: paginationSchema });
export type ReceiptDetail = z.infer<typeof receiptDetailSchema>;
export type CreateReceiptInput = z.infer<typeof createReceiptInputSchema>;
