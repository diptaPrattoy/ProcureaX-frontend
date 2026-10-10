import { z } from "zod";

import { paginationSchema } from "@/lib/rfqs/contracts";

const amount = z.union([z.string(), z.number()]);

export const paymentStatusSchema = z.enum(["PENDING", "PROCESSING", "SUCCEEDED", "FAILED", "CANCELLED", "REFUNDED"]);

export const paymentSchema = z.object({
  id: z.uuid(),
  invoiceId: z.uuid(),
  buyerId: z.uuid(),
  provider: z.literal("STRIPE"),
  status: paymentStatusSchema,
  currency: z.string(),
  amount,
  providerPaymentIntentId: z.string().nullable(),
  providerCheckoutSessionId: z.string().nullable(),
  failureReason: z.string().nullable(),
  receiptUrl: z.string().nullable(),
  initiatedAt: z.string(),
  completedAt: z.string().nullable(),
  refundedAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  invoice: z.object({
    invoiceNumber: z.string(),
    status: z.string(),
    totalAmount: amount,
    dueDate: z.string(),
    supplier: z.object({
      id: z.uuid(),
      firstName: z.string(),
      lastName: z.string(),
      supplierProfile: z.object({ companyName: z.string() }).nullable(),
    }),
  }),
});

export const paymentListSchema = z.object({ items: z.array(paymentSchema), pagination: paginationSchema });

export const checkoutSchema = z.object({
  paymentId: z.uuid(),
  invoiceId: z.uuid(),
  status: paymentStatusSchema,
  checkoutSessionId: z.string(),
  checkoutUrl: z.url(),
  expiresAt: z.number().nullable(),
  reused: z.boolean(),
});

export type Payment = z.infer<typeof paymentSchema>;
export type PaymentStatus = z.infer<typeof paymentStatusSchema>;
