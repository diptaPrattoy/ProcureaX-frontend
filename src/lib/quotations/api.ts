import "server-only";

import { z } from "zod";

import { getApiBaseUrl } from "@/lib/api/config";
import { getStoredAccessToken } from "@/lib/auth/session";
import { buyerQuotationListSchema } from "@/lib/quotations/contracts";

const errorSchema = z.object({ message: z.string() });
const quotationListEnvelope = z.object({ success: z.literal(true), data: buyerQuotationListSchema });
const evaluationEnvelope = z.object({ success: z.literal(true), data: z.object({ id: z.uuid(), status: z.literal("EVALUATING") }).passthrough() });
const awardEnvelope = z.object({ success: z.literal(true), data: z.object({ id: z.uuid(), poNumber: z.string(), status: z.string() }).passthrough() });

export class QuotationApiError extends Error {
  constructor(message: string, public readonly status: number) { super(message); this.name = "QuotationApiError"; }
}

async function authorizedRequest(path: string, init?: RequestInit) {
  const token = await getStoredAccessToken();
  if (!token) throw new QuotationApiError("Authentication required.", 401);
  const headers = new Headers(init?.headers); headers.set("Authorization", `Bearer ${token}`); headers.set("Accept", "application/json");
  const response = await fetch(new URL(path, getApiBaseUrl()), { ...init, headers, cache: "no-store", signal: AbortSignal.timeout(30_000) }).catch(() => null);
  if (!response) throw new QuotationApiError("The quotation service is temporarily unavailable.", 503);
  const payload: unknown = await response.json().catch(() => null);
  if (!response.ok) { const parsed = errorSchema.safeParse(payload); throw new QuotationApiError(parsed.success ? parsed.data.message : "The quotation request failed.", response.status); }
  return payload;
}

export async function listRfqQuotations(rfqId: string) {
  return quotationListEnvelope.parse(await authorizedRequest(`rfqs/${rfqId}/quotations?limit=50&sortBy=totalAmount&sortOrder=asc`)).data;
}
export async function startRfqEvaluation(rfqId: string) {
  return evaluationEnvelope.parse(await authorizedRequest(`rfqs/${rfqId}/evaluation/start`, { method: "POST" })).data;
}
export async function awardQuotation(rfqId: string, quotationId: string) {
  return awardEnvelope.parse(await authorizedRequest(`rfqs/${rfqId}/quotations/${quotationId}/award`, { method: "POST" })).data;
}
