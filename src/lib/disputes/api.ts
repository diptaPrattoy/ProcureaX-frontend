import "server-only";

import { z } from "zod";
import { getApiBaseUrl } from "@/lib/api/config";
import { getStoredAccessToken } from "@/lib/auth/session";
import { disputeListSchema, disputeSchema } from "@/lib/disputes/contracts";

const errorSchema = z.object({ message: z.string() }); const listEnvelope = z.object({ success: z.literal(true), data: disputeListSchema }); const detailEnvelope = z.object({ success: z.literal(true), data: disputeSchema });
export class DisputeApiError extends Error { constructor(message: string, public readonly status: number) { super(message); this.name = "DisputeApiError"; } }
async function request(path: string, init?: RequestInit) { const token = await getStoredAccessToken(); if (!token) throw new DisputeApiError("Authentication required.", 401); const headers = new Headers(init?.headers); headers.set("Authorization", `Bearer ${token}`); headers.set("Accept", "application/json"); const response = await fetch(new URL(path, getApiBaseUrl()), { ...init, headers, cache: "no-store", signal: AbortSignal.timeout(30_000) }).catch(() => null); if (!response) throw new DisputeApiError("The dispute service is temporarily unavailable.", 503); const payload: unknown = await response.json().catch(() => null); if (!response.ok) { const parsed = errorSchema.safeParse(payload); throw new DisputeApiError(parsed.success ? parsed.data.message : "The dispute request failed.", response.status); } return payload; }
export async function listDisputes(query: URLSearchParams) { return listEnvelope.parse(await request(`disputes?${query}`)).data; }
export async function getDispute(id: string) { return detailEnvelope.parse(await request(`disputes/${id}`)).data; }
export async function openDispute(target: "invoices" | "purchase-orders", id: string, input: { subject: string; description: string }) { const headers = new Headers({ "Content-Type": "application/json" }); return detailEnvelope.parse(await request(`${target}/${id}/disputes`, { method: "POST", headers, body: JSON.stringify(input) })).data; }
export async function listAdminDisputes(query: URLSearchParams) { return listEnvelope.parse(await request(`admin/disputes?${query}`)).data; }
export async function getAdminDispute(id: string) { return detailEnvelope.parse(await request(`admin/disputes/${id}`)).data; }
export async function reviewDispute(id: string, action: "review" | "resolve" | "reject", resolution?: string) { const headers = resolution !== undefined ? new Headers({ "Content-Type": "application/json" }) : undefined; return detailEnvelope.parse(await request(`admin/disputes/${id}/${action}`, { method: "POST", headers, body: resolution !== undefined ? JSON.stringify({ resolution }) : undefined })).data; }
