import "server-only";

import { z } from "zod";
import { getApiBaseUrl } from "@/lib/api/config";
import { getStoredAccessToken } from "@/lib/auth/session";
import { adminFinancialsSchema, adminOverviewSchema, adminSupplierListSchema, adminSupplierSchema, adminTrendsSchema, auditLogListSchema, auditLogSchema } from "@/lib/admin/contracts";

const errorSchema = z.object({ message: z.string() }); const supplierListEnvelope = z.object({ success: z.literal(true), data: adminSupplierListSchema }); const supplierEnvelope = z.object({ success: z.literal(true), data: adminSupplierSchema }); const auditListEnvelope = z.object({ success: z.literal(true), data: auditLogListSchema }); const auditEnvelope = z.object({ success: z.literal(true), data: auditLogSchema }); const overviewEnvelope = z.object({ success: z.literal(true), data: adminOverviewSchema }); const financialsEnvelope = z.object({ success: z.literal(true), data: adminFinancialsSchema }); const trendsEnvelope = z.object({ success: z.literal(true), data: adminTrendsSchema });
export class AdminApiError extends Error { constructor(message: string, public readonly status: number) { super(message); this.name = "AdminApiError"; } }
async function request(path: string, init?: RequestInit) { const token = await getStoredAccessToken(); if (!token) throw new AdminApiError("Authentication required.", 401); const headers = new Headers(init?.headers); headers.set("Authorization", `Bearer ${token}`); headers.set("Accept", "application/json"); const response = await fetch(new URL(path, getApiBaseUrl()), { ...init, headers, cache: "no-store", signal: AbortSignal.timeout(30_000) }).catch(() => null); if (!response) throw new AdminApiError("Admin services are temporarily unavailable.", 503); const payload: unknown = await response.json().catch(() => null); if (!response.ok) { const parsed = errorSchema.safeParse(payload); throw new AdminApiError(parsed.success ? parsed.data.message : "The admin request failed.", response.status); } return payload; }
export async function listAdminSuppliers(query: URLSearchParams) { return supplierListEnvelope.parse(await request(`admin/suppliers?${query}`)).data; }
export async function verifySupplier(id: string, input: { status: "VERIFIED" | "REJECTED"; note?: string }) { const headers = new Headers({ "Content-Type": "application/json" }); return supplierEnvelope.parse(await request(`admin/suppliers/${id}/verification`, { method: "PATCH", headers, body: JSON.stringify(input) })).data; }
export async function listAuditLogs(query: URLSearchParams) { return auditListEnvelope.parse(await request(`admin/audit-logs?${query}`)).data; }
export async function getAuditLog(id: string) { return auditEnvelope.parse(await request(`admin/audit-logs/${id}`)).data; }
export async function getAdminOverview(query: URLSearchParams) { return overviewEnvelope.parse(await request(`admin/dashboard/overview?${query}`)).data; }
export async function getAdminFinancials(query: URLSearchParams) { return financialsEnvelope.parse(await request(`admin/dashboard/financials?${query}`)).data; }
export async function getAdminTrends(query: URLSearchParams) { return trendsEnvelope.parse(await request(`admin/dashboard/trends?${query}`)).data; }
