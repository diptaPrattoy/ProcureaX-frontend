"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireRole } from "@/lib/auth/access";
import { createStripeCheckout, PaymentApiError } from "@/lib/payments/api";

export type CheckoutActionState = { status: "idle" | "error"; message?: string };

export async function startCheckoutAction(_state: CheckoutActionState, formData: FormData): Promise<CheckoutActionState> {
  const invoiceId = String(formData.get("invoiceId") ?? "");
  await requireRole(["BUYER"], `/buyer/invoices/${invoiceId}`);

  let checkoutUrl: string;
  try {
    const checkout = await createStripeCheckout(invoiceId);
    checkoutUrl = checkout.checkoutUrl;
  } catch (error) {
    return { status: "error", message: error instanceof PaymentApiError ? error.message : "Stripe checkout could not be started." };
  }

  let destination: URL;
  try {
    destination = new URL(checkoutUrl);
  } catch {
    return { status: "error", message: "The payment provider returned an invalid checkout link." };
  }
  if (destination.protocol !== "https:" || !(destination.hostname === "stripe.com" || destination.hostname.endsWith(".stripe.com"))) {
    return { status: "error", message: "The payment provider returned an untrusted checkout link." };
  }

  revalidatePath("/buyer/payments");
  revalidatePath(`/buyer/invoices/${invoiceId}`);
  redirect(destination.toString());
}
