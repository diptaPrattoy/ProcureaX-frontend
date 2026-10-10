"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { AuthApiError } from "@/lib/auth/api";
import { loginInputSchema, userRoleSchema } from "@/lib/auth/contracts";
import { getDemoCredentials } from "@/lib/auth/demo-access";
import type { DemoLoginActionState, LoginActionState } from "@/lib/auth/form-state";
import { endAuthSession, startPasswordSession } from "@/lib/auth/session";

function getLoginErrorMessage(error: unknown) {
  if (!(error instanceof AuthApiError)) {
    return "We could not sign you in right now. Please try again.";
  }

  if (error.status === 401) return "The email or password is incorrect.";
  if (error.status === 403) return error.message;
  if (error.status === 429) return "Too many sign-in attempts. Please wait a moment and try again.";
  if (error.status >= 500) return "The sign-in service is temporarily unavailable. Please try again shortly.";
  return error.message;
}

export async function loginAction(
  _previousState: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  const email = String(formData.get("email") ?? "");
  const result = loginInputSchema.safeParse({
    email,
    password: formData.get("password"),
  });

  if (!result.success) {
    return {
      status: "error",
      message: "Check the highlighted fields and try again.",
      fieldErrors: result.error.flatten().fieldErrors,
      values: { email },
    };
  }

  try {
    await startPasswordSession(result.data);
  } catch (error) {
    return {
      status: "error",
      message: getLoginErrorMessage(error),
      values: { email: result.data.email },
    };
  }

  revalidatePath("/", "layout");
  redirect("/login?authenticated=true");
}

export async function demoLoginAction(
  _previousState: DemoLoginActionState,
  formData: FormData,
): Promise<DemoLoginActionState> {
  const roleResult = userRoleSchema.safeParse(formData.get("role"));
  if (!roleResult.success) {
    return { status: "error", message: "Choose a valid demo workspace." };
  }

  const credentials = getDemoCredentials(roleResult.data);
  if (!credentials) {
    return { status: "error", message: "Demo access is not enabled in this environment." };
  }

  try {
    await startPasswordSession(credentials);
  } catch (error) {
    return { status: "error", message: getLoginErrorMessage(error) };
  }

  revalidatePath("/", "layout");
  redirect("/login?authenticated=true");
}

export async function logoutAction() {
  try {
    await endAuthSession();
  } catch {
    // The local cookies are cleared in a finally block even if the API is unavailable.
  }

  revalidatePath("/", "layout");
  redirect("/login");
}
