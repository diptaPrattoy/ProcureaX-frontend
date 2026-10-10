import { z } from "zod";
import { paginationSchema } from "@/lib/rfqs/contracts";

const category = z.object({ id: z.uuid(), name: z.string(), slug: z.string() });
export const adminSupplierSchema = z.object({
  id: z.uuid(), companyName: z.string(), legalName: z.string().nullable(), businessRegistrationNo: z.string().nullable(), taxId: z.string().nullable(), website: z.string().nullable(), addressLine1: z.string().nullable(), addressLine2: z.string().nullable(), city: z.string().nullable(), state: z.string().nullable(), postalCode: z.string().nullable(), country: z.string().nullable(), verificationStatus: z.enum(["PENDING", "VERIFIED", "REJECTED"]), verificationNote: z.string().nullable(), deletedAt: z.string().nullable(), verifiedAt: z.string().nullable(), createdAt: z.string(), updatedAt: z.string(), categories: z.array(category),
  user: z.object({ id: z.uuid(), email: z.email(), role: z.literal("SUPPLIER"), status: z.string(), firstName: z.string(), lastName: z.string(), phone: z.string().nullable(), avatarUrl: z.string().nullable(), emailVerifiedAt: z.string().nullable() }),
});
export const adminSupplierListSchema = z.object({ items: z.array(adminSupplierSchema), pagination: paginationSchema });
export const auditLogSchema = z.object({ id: z.uuid(), actorId: z.uuid().nullable(), action: z.string(), entityType: z.string(), entityId: z.string().nullable(), metadata: z.unknown().nullable(), ipAddress: z.string().nullable(), userAgent: z.string().nullable(), createdAt: z.string(), actor: z.object({ id: z.uuid(), email: z.email(), firstName: z.string(), lastName: z.string(), role: z.enum(["BUYER", "SUPPLIER", "ADMIN"]) }).nullable() });
export const auditLogListSchema = z.object({ items: z.array(auditLogSchema), pagination: paginationSchema });
export type AdminSupplier = z.infer<typeof adminSupplierSchema>;
export type AuditLog = z.infer<typeof auditLogSchema>;

const rangeSchema = z.object({ from: z.string(), to: z.string() });
export const adminOverviewSchema = z.object({
  range: rangeSchema,
  users: z.object({ total: z.number(), byRole: z.record(z.string(), z.number()), byStatus: z.record(z.string(), z.number()) }),
  suppliers: z.object({ total: z.number(), byVerificationStatus: z.record(z.string(), z.number()) }),
  periodActivity: z.object({ rfqsCreated: z.number(), quotationsSubmitted: z.number(), purchaseOrdersIssued: z.number(), invoicesSubmitted: z.number(), successfulPayments: z.number(), refundRequests: z.number(), disputesOpened: z.number() }),
  backlog: z.object({ suppliersPendingVerification: z.number(), openRfqs: z.number(), invoicesAwaitingReview: z.number(), paymentsInProgress: z.number(), refundsAwaitingAction: z.number(), activeDisputes: z.number(), overdueInvoices: z.number() }),
  recentActivity: z.array(auditLogSchema),
});
export const financialSummarySchema = z.object({ currency: z.string(), grossCollected: z.union([z.string(), z.number()]), successfulPaymentCount: z.number(), refunded: z.union([z.string(), z.number()]), successfulRefundCount: z.number(), netCashFlow: z.union([z.string(), z.number()]), outstandingApproved: z.union([z.string(), z.number()]), outstandingInvoiceCount: z.number() });
export const adminFinancialsSchema = z.object({ range: rangeSchema, note: z.string(), currencies: z.array(financialSummarySchema) });
export const adminTrendsSchema = z.object({ timezone: z.string(), days: z.number(), from: z.string(), to: z.string(), buckets: z.array(z.object({ date: z.string(), rfqs: z.number(), quotations: z.number(), purchaseOrders: z.number(), invoices: z.number(), successfulPayments: z.number(), refundRequests: z.number(), disputes: z.number() })) });
export type AdminOverview = z.infer<typeof adminOverviewSchema>;
export type AdminFinancials = z.infer<typeof adminFinancialsSchema>;
export type AdminTrends = z.infer<typeof adminTrendsSchema>;
