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
