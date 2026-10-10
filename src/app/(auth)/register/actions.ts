"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { AuthApiError } from "@/lib/auth/api";
import {
  buyerRegistrationInputSchema,
  supplierRegistrationInputSchema,
} from "@/lib/auth/contracts";
import type { RegistrationActionState } from "@/lib/auth/form-state";
import {
  startBuyerRegistrationSession,
  startSupplierRegistrationSession,
} from "@/lib/auth/session";

const roleSchema = z.enum(["BUYER", "SUPPLIER"]);
const confirmationField = { confirmPassword: z.string().min(1, "Confirm your password.") };

function withConfirmation(schema: typeof buyerRegistrationInputSchema) {
  return schema.extend(confirmationField).superRefine((value, context) => {
    if (value.password !== value.confirmPassword) {
      context.addIssue({
        code: "custom",
        message: "Passwords do not match.",
        path: ["confirmPassword"],
      });
    }
  });
}

const buyerFormSchema = withConfirmation(buyerRegistrationInputSchema);
const supplierFormSchema = withConfirmation(supplierRegistrationInputSchema);

function optionalValue(formData: FormData, name: string) {
  const value = String(formData.get(name) ?? "").trim();
  return value || undefined;
}

function registrationError(error: unknown) {
  if (!(error instanceof AuthApiError)) {
    return "We could not create your account right now. Please try again.";
  }
  if (error.status === 409) return "An account with this email already exists. Try signing in instead.";
  if (error.status === 429) return "Too many registration attempts. Please wait a moment and try again.";
  if (error.status >= 500) return "Registration is temporarily unavailable. Please try again shortly.";
  return error.message;
}

export async function registerAction(
  _previousState: RegistrationActionState,
  formData: FormData,
): Promise<RegistrationActionState> {
  const roleResult = roleSchema.safeParse(formData.get("role"));
  const values = {
    role: roleResult.success ? roleResult.data : undefined,
    firstName: String(formData.get("firstName") ?? ""),
    lastName: String(formData.get("lastName") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    companyName: String(formData.get("companyName") ?? ""),
    legalName: String(formData.get("legalName") ?? ""),
    city: String(formData.get("city") ?? ""),
    country: String(formData.get("country") ?? ""),
  } satisfies RegistrationActionState["values"];

  if (!roleResult.success) {
    return { status: "error", message: "Choose a valid account type.", values };
  }

  const input = {
    firstName: values.firstName,
    lastName: values.lastName,
    email: values.email,
    phone: optionalValue(formData, "phone"),
    companyName: values.companyName,
    legalName: optionalValue(formData, "legalName"),
    city: optionalValue(formData, "city"),
    country: optionalValue(formData, "country"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };
  const schema = roleResult.data === "BUYER" ? buyerFormSchema : supplierFormSchema;
  const result = schema.safeParse(input);

  if (!result.success) {
    return {
      status: "error",
      message: "Check the highlighted fields and try again.",
      fieldErrors: result.error.flatten().fieldErrors,
      values,
    };
  }

  const registration = { ...result.data };
  delete (registration as Partial<typeof result.data>).confirmPassword;
  try {
    if (roleResult.data === "BUYER") await startBuyerRegistrationSession(registration);
    else await startSupplierRegistrationSession(registration);
  } catch (error) {
    return { status: "error", message: registrationError(error), values };
  }

  revalidatePath("/", "layout");
  redirect("/register?created=true");
}
