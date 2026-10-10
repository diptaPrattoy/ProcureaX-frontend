import "server-only";

import { z } from "zod";

import { getApiBaseUrl } from "@/lib/api/config";
import { getStoredAccessToken } from "@/lib/auth/session";
import { checkoutSchema, paymentListSchema, paymentSchema } from "@/lib/payments/contracts";

const errorSchema = z.object({ message: z.string() });
const listEnvelope = z.object({ success: z.literal(true), data: paymentListSchema });
const detailEnvelope = z.object({ success: z.literal(true), data: paymentSchema });
const checkoutEnvelope = z.object({ success: z.literal(true), data: checkoutSchema });

export class PaymentApiError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    this.name = "PaymentApiError";
  }
}

async function request(path: string, init?: RequestInit) {
  const token = await getStoredAccessToken();
  if (!token) throw new PaymentApiError("Authentication required.", 401);
  const headers = new Headers(init?.headers);
  headers.set("Authorization", `Bearer ${token}`);
  headers.set("Accept", "application/json");
  const response = await fetch(new URL(path, getApiBaseUrl()), { ...init, headers, cache: "no-store", signal: AbortSignal.timeout(30_000) }).catch(() => null);
  if (!response) throw new PaymentApiError("The payment service is temporarily unavailable.", 503);
  const payload: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const parsed = errorSchema.safeParse(payload);
    throw new PaymentApiError(parsed.success ? parsed.data.message : "The payment request failed.", response.status);
  }
  return payload;
}

export async function listPayments(query: URLSearchParams) {
  return listEnvelope.parse(await request(`payments?${query}`)).data;
}

export async function getPayment(id: string) {
  return detailEnvelope.parse(await request(`payments/${id}`)).data;
}

export async function createStripeCheckout(invoiceId: string) {
  return checkoutEnvelope.parse(await request(`invoices/${invoiceId}/payments/checkout`, { method: "POST" })).data;
}
