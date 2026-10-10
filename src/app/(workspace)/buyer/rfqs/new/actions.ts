"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireRole } from "@/lib/auth/access";
import { createRfqDraft, RfqApiError } from "@/lib/rfqs/api";
import { createRfqInputSchema } from "@/lib/rfqs/contracts";
import type { RfqFormState } from "@/lib/rfqs/form-state";

function optional(formData: FormData, name: string) { const value = String(formData.get(name) ?? "").trim(); return value || undefined; }
function localDateTimeToIso(value: string, offsetMinutes: number) {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(value);
  if (!match) return value;
  const [, year, month, day, hour, minute] = match;
  return new Date(Date.UTC(+year, +month - 1, +day, +hour, +minute) + offsetMinutes * 60_000).toISOString();
}

export async function createRfqAction(_state: RfqFormState, formData: FormData): Promise<RfqFormState> {
  await requireRole(["BUYER"], "/buyer/rfqs/new");
  const offset = Number(formData.get("timezoneOffset") ?? 0);
  let items: unknown = [];
  try { items = JSON.parse(String(formData.get("items") ?? "[]")); } catch { /* validation reports the issue */ }
  const result = createRfqInputSchema.safeParse({
    categoryId: formData.get("categoryId"), title: formData.get("title"), description: formData.get("description"), currency: formData.get("currency"),
    budgetMin: optional(formData, "budgetMin"), budgetMax: optional(formData, "budgetMax"),
    submissionDeadline: localDateTimeToIso(String(formData.get("submissionDeadline") ?? ""), Number.isFinite(offset) ? offset : 0), expectedDeliveryDate: optional(formData, "expectedDeliveryDate"),
    deliveryAddressLine1: optional(formData, "deliveryAddressLine1"), deliveryAddressLine2: optional(formData, "deliveryAddressLine2"), deliveryCity: optional(formData, "deliveryCity"), deliveryState: optional(formData, "deliveryState"), deliveryPostalCode: optional(formData, "deliveryPostalCode"), deliveryCountry: optional(formData, "deliveryCountry"), items,
  });
  if (!result.success) return { status: "error", message: "Review the highlighted sections before saving.", fieldErrors: result.error.flatten().fieldErrors };
  try { await createRfqDraft(result.data); }
  catch (error) { return { status: "error", message: error instanceof RfqApiError ? error.message : "The draft could not be created. Please try again." }; }
  revalidatePath("/buyer/rfqs");
  redirect("/buyer/rfqs?created=true");
}
