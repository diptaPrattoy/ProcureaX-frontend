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
export type BuyerQuotation = z.infer<typeof buyerQuotationSchema>;
