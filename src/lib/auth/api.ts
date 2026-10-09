import "server-only";

import { z } from "zod";

import { getApiBaseUrl } from "@/lib/api/config";
import {
  authSessionSchema,
  buyerRegistrationInputSchema,
  emailInputSchema,
  googleAuthInputSchema,
  loginInputSchema,
  publicUserSchema,
  resetPasswordInputSchema,
  supplierRegistrationInputSchema,
  verifyEmailInputSchema,
  type AuthSession,
  type BuyerRegistrationInput,
  type EmailInput,
  type GoogleAuthInput,
  type LoginInput,
  type PublicUser,
  type ResetPasswordInput,
  type SupplierRegistrationInput,
  type VerifyEmailInput,
} from "@/lib/auth/contracts";

const apiErrorSchema = z.object({
  success: z.literal(false),
  message: z.string(),
  errors: z.array(z.unknown()).optional(),
});

function successEnvelope<TSchema extends z.ZodType>(dataSchema: TSchema) {
  return z.object({
    success: z.literal(true),
    message: z.string(),
    data: dataSchema,
  });
}

const sessionEnvelopeSchema = successEnvelope(authSessionSchema);
const userEnvelopeSchema = successEnvelope(publicUserSchema);
const emptyEnvelopeSchema = successEnvelope(z.null());

export class AuthApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly details: ReadonlyArray<unknown> = [],
  ) {
    super(message);
    this.name = "AuthApiError";
  }
}

type AuthRequestOptions<TSchema extends z.ZodType> = {
  method?: "GET" | "POST";
  body?: unknown;
  schema: TSchema;
  accessToken?: string;
};

async function authRequest<TSchema extends z.ZodType>(
  path: string,
  { method = "GET", body, schema, accessToken }: AuthRequestOptions<TSchema>,
) {
  const headers = new Headers({ Accept: "application/json" });

  if (body !== undefined) headers.set("Content-Type", "application/json");
  if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);

  let response: Response;

  try {
    response = await fetch(new URL(path, getApiBaseUrl()), {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: "no-store",
      signal: AbortSignal.timeout(30_000),
    });
  } catch {
    throw new AuthApiError("The authentication service is temporarily unavailable.", 503);
  }

  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const parsedError = apiErrorSchema.safeParse(payload);
    throw new AuthApiError(
      parsedError.success ? parsedError.data.message : "Authentication request failed.",
      response.status,
      parsedError.success ? (parsedError.data.errors ?? []) : [],
    );
  }

  const parsedPayload = schema.safeParse(payload);
  if (!parsedPayload.success) {
    throw new AuthApiError("The authentication service returned an unexpected response.", 502);
  }

  return parsedPayload.data;
}

export async function loginWithPassword(input: LoginInput): Promise<AuthSession> {
  const body = loginInputSchema.parse(input);
  const response = await authRequest("auth/login", {
    method: "POST",
    body,
    schema: sessionEnvelopeSchema,
  });
  return response.data;
}

export async function registerBuyer(input: BuyerRegistrationInput): Promise<AuthSession> {
  const body = buyerRegistrationInputSchema.parse(input);
  const response = await authRequest("auth/register/buyer", {
    method: "POST",
    body,
    schema: sessionEnvelopeSchema,
  });
  return response.data;
}

export async function registerSupplier(input: SupplierRegistrationInput): Promise<AuthSession> {
  const body = supplierRegistrationInputSchema.parse(input);
  const response = await authRequest("auth/register/supplier", {
    method: "POST",
    body,
    schema: sessionEnvelopeSchema,
  });
  return response.data;
}

export async function authenticateWithGoogle(input: GoogleAuthInput): Promise<AuthSession> {
  const body = googleAuthInputSchema.parse(input);
  const response = await authRequest("auth/google", {
    method: "POST",
    body,
    schema: sessionEnvelopeSchema,
  });
  return response.data;
}

export async function refreshAuthSession(refreshToken: string): Promise<AuthSession> {
  const response = await authRequest("auth/refresh", {
    method: "POST",
    body: { refreshToken },
    schema: sessionEnvelopeSchema,
  });
  return response.data;
}

export async function revokeAuthSession(refreshToken: string) {
  await authRequest("auth/logout", {
    method: "POST",
    body: { refreshToken },
    schema: emptyEnvelopeSchema,
  });
}

export async function fetchCurrentUser(accessToken: string): Promise<PublicUser> {
  const response = await authRequest("auth/me", {
    accessToken,
    schema: userEnvelopeSchema,
  });
  return response.data;
}

export async function resendEmailVerification(input: EmailInput) {
  const body = emailInputSchema.parse(input);
  await authRequest("auth/email/resend-verification", {
    method: "POST",
    body,
    schema: emptyEnvelopeSchema,
  });
}

export async function verifyEmailAddress(input: VerifyEmailInput): Promise<PublicUser> {
  const body = verifyEmailInputSchema.parse(input);
  const response = await authRequest("auth/email/verify", {
    method: "POST",
    body,
    schema: userEnvelopeSchema,
  });
  return response.data;
}

export async function requestPasswordReset(input: EmailInput) {
  const body = emailInputSchema.parse(input);
  await authRequest("auth/forgot-password", {
    method: "POST",
    body,
    schema: emptyEnvelopeSchema,
  });
}

export async function resetPassword(input: ResetPasswordInput) {
  const body = resetPasswordInputSchema.parse(input);
  await authRequest("auth/reset-password", {
    method: "POST",
    body,
    schema: emptyEnvelopeSchema,
  });
}

export function isUnauthorizedAuthError(error: unknown) {
  return (
    (error instanceof AuthApiError && error.status === 401) ||
    (typeof error === "object" && error !== null && "status" in error && error.status === 401)
  );
}
