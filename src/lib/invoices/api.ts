import "server-only";

import { z } from "zod";

import { getApiBaseUrl } from "@/lib/api/config";
import { getStoredAccessToken } from "@/lib/auth/session";
import { createInvoiceInputSchema, invoiceDetailSchema, invoiceListSchema, type CreateInvoiceInput } from "@/lib/invoices/contracts";

const errorSchema = z.object({ message: z.string() }); const listEnvelope = z.object({ success: z.literal(true), data: invoiceListSchema }); const detailEnvelope = z.object({ success: z.literal(true), data: invoiceDetailSchema });
export class InvoiceApiError extends Error { constructor(message: string, public readonly status: number) { super(message); this.name = "InvoiceApiError"; } }
async function request(path: string, init?: RequestInit) { const token = await getStoredAccessToken(); if (!token) throw new InvoiceApiError("Authentication required.", 401); const headers = new Headers(init?.headers); headers.set("Authorization", `Bearer ${token}`); headers.set("Accept", "application/json"); const response = await fetch(new URL(path, getApiBaseUrl()), { ...init, headers, cache: "no-store", signal: AbortSignal.timeout(30_000) }).catch(() => null); if (!response) throw new InvoiceApiError("The invoice service is temporarily unavailable.", 503); const payload: unknown = await response.json().catch(() => null); if (!response.ok) { const parsed = errorSchema.safeParse(payload); throw new InvoiceApiError(parsed.success ? parsed.data.message : "The invoice request failed.", response.status); } return payload; }
export async function listInvoices(query: URLSearchParams) { return listEnvelope.parse(await request(`invoices?${query}`)).data; }
export async function listOrderInvoices(orderId: string) { return listEnvelope.parse(await request(`purchase-orders/${orderId}/invoices?limit=50`)).data; }
export async function getInvoice(id: string) { return detailEnvelope.parse(await request(`invoices/${id}`)).data; }
export async function createInvoice(orderId: string, input: CreateInvoiceInput) { const headers = new Headers({ "Content-Type": "application/json" }); return detailEnvelope.parse(await request(`purchase-orders/${orderId}/invoices`, { method: "POST", headers, body: JSON.stringify(createInvoiceInputSchema.parse(input)) })).data; }
export async function transitionInvoice(id: string, action: "start-review" | "approve" | "reject" | "cancel", reason?: string) { const headers = reason ? new Headers({ "Content-Type": "application/json" }) : undefined; return detailEnvelope.parse(await request(`invoices/${id}/${action}`, { method: "POST", headers, body: reason ? JSON.stringify({ reason }) : undefined })).data; }
