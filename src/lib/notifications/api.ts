import "server-only";

import { z } from "zod";
import { getApiBaseUrl } from "@/lib/api/config";
import { getStoredAccessToken } from "@/lib/auth/session";
import { notificationListSchema, notificationSchema } from "@/lib/notifications/contracts";

const errorSchema = z.object({ message: z.string() }); const listEnvelope = z.object({ success: z.literal(true), data: notificationListSchema }); const notificationEnvelope = z.object({ success: z.literal(true), data: notificationSchema }); const allReadEnvelope = z.object({ success: z.literal(true), data: z.object({ updatedCount: z.number() }) });
export class NotificationApiError extends Error { constructor(message: string, public readonly status: number) { super(message); this.name = "NotificationApiError"; } }
async function request(path: string, init?: RequestInit) { const token = await getStoredAccessToken(); if (!token) throw new NotificationApiError("Authentication required.", 401); const headers = new Headers(init?.headers); headers.set("Authorization", `Bearer ${token}`); headers.set("Accept", "application/json"); const response = await fetch(new URL(path, getApiBaseUrl()), { ...init, headers, cache: "no-store", signal: AbortSignal.timeout(30_000) }).catch(() => null); if (!response) throw new NotificationApiError("Notifications are temporarily unavailable.", 503); const payload: unknown = await response.json().catch(() => null); if (!response.ok) { const parsed = errorSchema.safeParse(payload); throw new NotificationApiError(parsed.success ? parsed.data.message : "The notification request failed.", response.status); } return payload; }
export async function listNotifications(query: URLSearchParams) { return listEnvelope.parse(await request(`notifications?${query}`)).data; }
export async function markNotificationRead(id: string) { return notificationEnvelope.parse(await request(`notifications/${id}/read`, { method: "PATCH" })).data; }
export async function markAllNotificationsRead() { return allReadEnvelope.parse(await request("notifications/read-all", { method: "PATCH" })).data; }
