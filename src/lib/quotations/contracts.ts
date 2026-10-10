import { z } from "zod";

import { paginationSchema } from "@/lib/rfqs/contracts";

const amount = z.union([z.string(), z.number()]);
export const quotationStatusSchema = z.enum(["SUBMITTED", "UNDER_REVIEW", "AWARDED", "REJECTED", "WITHDRAWN", "EXPIRED"]);
export const buyerQuotationSchema = z.object({
  id: z.uuid(), rfqId: z.uuid(), currency: z.string(), subtotal: amount, taxAmount: amount, totalAmount: amount,
  deliveryDays: z.number(), validUntil: z.string(), terms: z.string().nullable(), notes: z.string().nullable(), status: quotationStatusSchema,
  submittedAt: z.string(), reviewedAt: z.string().nullable(), awardedAt: z.string().nullable(),
  supplier: z.object({ id: z.uuid(), firstName: z.string(), lastName: z.string(), supplierProfile: z.object({ id: z.uuid(), companyName: z.string(), verificationStatus: z.enum(["PENDING", "VERIFIED", "REJECTED"]), city: z.string().nullable(), country: z.string().nullable() }).nullable() }),
  _count: z.object({ items: z.number() }),
});
export const buyerQuotationListSchema = z.object({ items: z.array(buyerQuotationSchema), pagination: paginationSchema });

const amountInput = z.union([z.string(), z.number()]).transform(Number).pipe(z.number().finite().nonnegative().max(999_999_999_999.99));
export const submitQuotationInputSchema = z.object({
  currency: z.string().trim().length(3).transform((value) => value.toUpperCase()),
  taxAmount: amountInput.default(0), deliveryDays: z.coerce.number().int().positive().max(3650), validUntil: z.iso.date(),
  terms: z.string().trim().min(1).max(5000).optional(), notes: z.string().trim().min(1).max(5000).optional(),
  items: z.array(z.object({ rfqItemId: z.uuid(), unitPrice: amountInput.pipe(z.number().positive()), notes: z.string().trim().min(1).max(1000).optional() })).min(1).max(50),
});

export const supplierQuotationSchema = z.object({
  id: z.uuid(), currency: z.string(), subtotal: amount, taxAmount: amount, totalAmount: amount, deliveryDays: z.number(), validUntil: z.string(), status: quotationStatusSchema, submittedAt: z.string(), updatedAt: z.string(),
  rfq: z.object({ id: z.uuid(), title: z.string(), status: z.string(), submissionDeadline: z.string(), updatedAt: z.string(), buyer: z.object({ buyerProfile: z.object({ companyName: z.string() }).nullable() }), category: z.object({ id: z.uuid(), name: z.string(), slug: z.string() }) }),
});
export const supplierQuotationListSchema = z.object({ items: z.array(supplierQuotationSchema), pagination: paginationSchema });
export type BuyerQuotation = z.infer<typeof buyerQuotationSchema>;
export type SubmitQuotationInput = z.infer<typeof submitQuotationInputSchema>;
export type SupplierQuotation = z.infer<typeof supplierQuotationSchema>;
