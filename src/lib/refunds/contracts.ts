import { z } from "zod";

import { paginationSchema } from "@/lib/rfqs/contracts";

const amount = z.union([z.string(), z.number()]);
export const refundStatusSchema = z.enum(["REQUESTED", "APPROVED", "PROCESSING", "SUCCEEDED", "REJECTED", "FAILED", "CANCELLED"]);
export const refundSchema = z.object({
  id: z.uuid(), paymentId: z.uuid(), invoiceId: z.uuid(), requestedById: z.uuid(), reviewedById: z.uuid().nullable(), status: refundStatusSchema, currency: z.string(), amount, reason: z.string(), adminNote: z.string().nullable(), providerRefundId: z.string().nullable(), providerStatus: z.string().nullable(), failureReason: z.string().nullable(), requestedAt: z.string(), reviewedAt: z.string().nullable(), completedAt: z.string().nullable(), createdAt: z.string(), updatedAt: z.string(),
  invoice: z.object({ invoiceNumber: z.string(), supplierId: z.uuid(), buyerId: z.uuid(), totalAmount: amount, purchaseOrder: z.object({ poNumber: z.string() }) }),
  payment: z.object({ status: z.string(), amount, currency: z.string(), providerPaymentIntentId: z.string().nullable() }),
  requestedBy: z.object({ id: z.uuid(), email: z.email(), firstName: z.string(), lastName: z.string(), buyerProfile: z.object({ companyName: z.string() }).nullable() }),
  reviewedBy: z.object({ id: z.uuid(), email: z.email(), firstName: z.string(), lastName: z.string() }).nullable(),
});
export const refundListSchema = z.object({ items: z.array(refundSchema), pagination: paginationSchema });
export const requestRefundSchema = z.object({ amount: z.coerce.number().positive().max(99_999_999_999).optional(), reason: z.string().trim().min(10, "Explain the reason in at least 10 characters.").max(1000) });
export type Refund = z.infer<typeof refundSchema>;
