import { z } from "zod";
import { paginationSchema } from "@/lib/rfqs/contracts";

const amount = z.union([z.string(), z.number()]);
const party = z.object({ id: z.uuid(), email: z.email(), role: z.enum(["BUYER", "SUPPLIER", "ADMIN"]), firstName: z.string(), lastName: z.string(), buyerProfile: z.object({ companyName: z.string() }).nullable(), supplierProfile: z.object({ companyName: z.string() }).nullable() });
export const disputeStatusSchema = z.enum(["OPEN", "UNDER_REVIEW", "RESOLVED", "REJECTED"]);
export const disputeSchema = z.object({
  id: z.uuid(), purchaseOrderId: z.uuid().nullable(), invoiceId: z.uuid().nullable(), openedById: z.uuid(), againstUserId: z.uuid(), resolvedById: z.uuid().nullable(), subject: z.string(), description: z.string(), status: disputeStatusSchema, resolution: z.string().nullable(), resolvedAt: z.string().nullable(), createdAt: z.string(), updatedAt: z.string(),
  purchaseOrder: z.object({ id: z.uuid(), poNumber: z.string(), status: z.string(), totalAmount: amount, currency: z.string() }).nullable(),
  invoice: z.object({ id: z.uuid(), invoiceNumber: z.string(), status: z.string(), totalAmount: amount, currency: z.string() }).nullable(),
  openedBy: party, againstUser: party,
  resolvedBy: z.object({ id: z.uuid(), email: z.email(), firstName: z.string(), lastName: z.string() }).nullable(),
});
export const disputeListSchema = z.object({ items: z.array(disputeSchema), pagination: paginationSchema });
export const openDisputeSchema = z.object({ subject: z.string().trim().min(5, "Use at least 5 characters for the subject.").max(160), description: z.string().trim().min(20, "Describe the issue in at least 20 characters.").max(5000) });
export type Dispute = z.infer<typeof disputeSchema>;
