import "server-only";

import { z } from "zod";

import { getApiBaseUrl } from "@/lib/api/config";
import { getStoredAccessToken } from "@/lib/auth/session";
import { categorySchema, createRfqInputSchema, paginationSchema, rfqDetailSchema, rfqListItemSchema, type CreateRfqInput } from "@/lib/rfqs/contracts";

const errorSchema = z.object({ message: z.string() });
const categoriesEnvelope = z.object({ success: z.literal(true), data: z.object({ items: z.array(categorySchema), pagination: paginationSchema }) });
const rfqListEnvelope = z.object({ success: z.literal(true), data: z.object({ items: z.array(rfqListItemSchema), pagination: paginationSchema }) });
const createdRfqEnvelope = z.object({ success: z.literal(true), data: z.object({ id: z.uuid(), status: z.literal("DRAFT") }).passthrough() });
const rfqDetailEnvelope = z.object({ success: z.literal(true), data: rfqDetailSchema });

export class RfqApiError extends Error {
  constructor(message: string, public readonly status: number) { super(message); this.name = "RfqApiError"; }
}

async function request(path: string, init?: RequestInit) {
  const response = await fetch(new URL(path, getApiBaseUrl()), { ...init, cache: "no-store", signal: AbortSignal.timeout(30_000) }).catch(() => null);
  if (!response) throw new RfqApiError("The procurement service is temporarily unavailable.", 503);
  const payload: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const error = errorSchema.safeParse(payload);
    throw new RfqApiError(error.success ? error.data.message : "The RFQ request failed.", response.status);
  }
  return payload;
}

async function authorizationHeaders() {
  const token = await getStoredAccessToken();
  if (!token) throw new RfqApiError("Authentication required.", 401);
  return { Authorization: `Bearer ${token}` };
}

export async function listCategories() {
  return categoriesEnvelope.parse(await request("categories?limit=50")).data.items;
}

export async function listBuyerRfqs(query: URLSearchParams) {
  const headers = await authorizationHeaders();
  return rfqListEnvelope.parse(await request(`rfqs/mine?${query}`, { headers })).data;
}

export async function createRfqDraft(input: CreateRfqInput) {
  const headers = new Headers(await authorizationHeaders());
  headers.set("Content-Type", "application/json");
  return createdRfqEnvelope.parse(await request("rfqs", { method: "POST", headers, body: JSON.stringify(createRfqInputSchema.parse(input)) })).data;
}

export async function getBuyerRfq(rfqId: string) {
  const headers = await authorizationHeaders();
  return rfqDetailEnvelope.parse(await request(`rfqs/mine/${rfqId}`, { headers })).data;
}
