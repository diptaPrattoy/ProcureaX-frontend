import { z } from "zod";

import { paginationSchema } from "@/lib/rfqs/contracts";

const amount = z.union([z.string(), z.number()]);
export const invoiceStatusSchema = z.enum(["SUBMITTED", "UNDER_REVIEW", "APPROVED", "REJECTED", "PAYMENT_PENDING", "PAID", "CANCELLED"]);
const party = z.object({ id: z.uuid(), firstName: z.string(), lastName: z.string() });
export const invoiceListItemSchema = z.object({
  id: z.uuid(), invoiceNumber: z.string(), purchaseOrderId: z.uuid(), supplierId: z.uuid(), buyerId: z.uuid(), currency: z.string(), subtotal: amount, taxAmount: amount, totalAmount: amount, dueDate: z.string(), status: invoiceStatusSchema,
  submittedAt: z.string(), reviewedAt: z.string().nullable(), approvedAt: z.string().nullable(), rejectedAt: z.string().nullable(), paidAt: z.string().nullable(), updatedAt: z.string(),
  purchaseOrder: z.object({ id: z.uuid(), poNumber: z.string(), status: z.string() }), buyer: party.extend({ buyerProfile: z.object({ companyName: z.string() }).nullable() }), supplier: party.extend({ supplierProfile: z.object({ companyName: z.string() }).nullable() }), _count: z.object({ items: z.number(), payments: z.number() }),
});
export const invoiceDetailSchema = invoiceListItemSchema.extend({ notes: z.string().nullable(), rejectionReason: z.string().nullable(), items: z.array(z.object({ id: z.uuid(), purchaseOrderItemId: z.uuid(), description: z.string().nullable(), quantity: amount, unitPrice: amount, lineTotal: amount, purchaseOrderItem: z.object({ itemName: z.string(), unit: z.string(), quantity: amount }) })) });
const inputAmount = z.coerce.number().nonnegative().max(99_999_999_999);
export const createInvoiceInputSchema = z.object({ invoiceNumber: z.string().trim().min(2).max(80), dueDate: z.iso.date(), taxAmount: inputAmount.default(0), notes: z.string().trim().max(1000).optional(), items: z.array(z.object({ purchaseOrderItemId: z.uuid(), quantity: z.coerce.number().positive().max(999_999_999), description: z.string().trim().max(500).optional() })).min(1).max(50) });
export const invoiceListSchema = z.object({ items: z.array(invoiceListItemSchema), pagination: paginationSchema });
export type InvoiceDetail = z.infer<typeof invoiceDetailSchema>;
export type InvoiceListItem = z.infer<typeof invoiceListItemSchema>;
export type CreateInvoiceInput = z.infer<typeof createInvoiceInputSchema>;
