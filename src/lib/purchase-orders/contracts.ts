import { z } from "zod";

import { paginationSchema } from "@/lib/rfqs/contracts";

const amount = z.union([z.string(), z.number()]);
export const purchaseOrderStatusSchema = z.enum(["ISSUED", "ACCEPTED", "REJECTED", "IN_PROGRESS", "PARTIALLY_DELIVERED", "DELIVERED", "COMPLETED", "CANCELLED"]);
const partySchema = z.object({ id: z.uuid(), firstName: z.string(), lastName: z.string() });
export const purchaseOrderListItemSchema = z.object({
  id: z.uuid(), poNumber: z.string(), rfqId: z.uuid(), quotationId: z.uuid(), currency: z.string(), subtotal: amount, taxAmount: amount, totalAmount: amount, status: purchaseOrderStatusSchema,
  issuedAt: z.string(), acceptedAt: z.string().nullable(), rejectedAt: z.string().nullable(), deliveredAt: z.string().nullable(), completedAt: z.string().nullable(), cancelledAt: z.string().nullable(), updatedAt: z.string(),
  rfq: z.object({ id: z.uuid(), title: z.string(), expectedDeliveryDate: z.string().nullable() }),
  buyer: partySchema.extend({ buyerProfile: z.object({ companyName: z.string() }).nullable() }),
  supplier: partySchema.extend({ supplierProfile: z.object({ id: z.uuid(), companyName: z.string(), verificationStatus: z.string() }).nullable() }),
  _count: z.object({ items: z.number(), goodsReceipts: z.number(), invoices: z.number() }),
});
export const purchaseOrderDetailSchema = purchaseOrderListItemSchema.extend({
  shippingAddress: z.unknown(), notes: z.string().nullable(),
  items: z.array(z.object({ id: z.uuid(), rfqItemId: z.uuid(), itemName: z.string(), description: z.string().nullable(), specifications: z.unknown(), quantity: amount, unit: z.string(), unitPrice: amount, lineTotal: amount })),
});
export const purchaseOrderListSchema = z.object({ items: z.array(purchaseOrderListItemSchema), pagination: paginationSchema });
export type PurchaseOrderListItem = z.infer<typeof purchaseOrderListItemSchema>;
export type PurchaseOrderDetail = z.infer<typeof purchaseOrderDetailSchema>;
export type PurchaseOrderStatus = z.infer<typeof purchaseOrderStatusSchema>;
