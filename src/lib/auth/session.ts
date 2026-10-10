import "server-only";

import { cookies } from "next/headers";
import { z } from "zod";

import {
  authenticateWithGoogle,
  fetchCurrentUser,
  isUnauthorizedAuthError,
  loginWithPassword,
  refreshAuthSession,
  registerBuyer,
  registerSupplier,
  revokeAuthSession,
} from "@/lib/auth/api";
import type {
  AuthSession,
  BuyerRegistrationInput,
  GoogleAuthInput,
  LoginInput,
  PublicUser,
  SupplierRegistrationInput,
} from "@/lib/auth/contracts";

const ACCESS_COOKIE = "procurax_access";
const REFRESH_COOKIE = "procurax_refresh";
const ACCESS_COOKIE_FALLBACK_SECONDS = 15 * 60;
const REFRESH_COOKIE_DEFAULT_DAYS = 30;

const jwtExpirySchema = z.object({ exp: z.number().int().positive() });

function getRefreshCookieDays() {
  const configuredDays = Number.parseInt(process.env.AUTH_REFRESH_COOKIE_MAX_AGE_DAYS ?? "", 10);
  return Number.isSafeInteger(configuredDays) && configuredDays > 0 && configuredDays <= 365
    ? configuredDays
    : REFRESH_COOKIE_DEFAULT_DAYS;
}

function getAccessCookieMaxAge(accessToken: string) {
  try {
    const [, payload] = accessToken.split(".");
    const parsedPayload = jwtExpirySchema.safeParse(
      JSON.parse(Buffer.from(payload, "base64url").toString("utf8")),
    );

    if (parsedPayload.success) {
      return Math.max(1, parsedPayload.data.exp - Math.floor(Date.now() / 1000));
    }
  } catch {
    // Cookie lifetime is only a storage hint; the API still verifies every token.
  }

  return ACCESS_COOKIE_FALLBACK_SECONDS;
}

function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    priority: "high" as const,
    maxAge,
  };
}

export async function persistAuthSession(session: AuthSession) {
  const cookieStore = await cookies();

  cookieStore.set(
    ACCESS_COOKIE,
    session.tokens.accessToken,
    cookieOptions(getAccessCookieMaxAge(session.tokens.accessToken)),
  );
  cookieStore.set(
    REFRESH_COOKIE,
    session.tokens.refreshToken,
    cookieOptions(getRefreshCookieDays() * 24 * 60 * 60),
  );
}

export async function clearAuthSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_COOKIE);
  cookieStore.delete(REFRESH_COOKIE);
}

async function readStoredTokens() {
  const cookieStore = await cookies();

  return {
    accessToken: cookieStore.get(ACCESS_COOKIE)?.value ?? null,
    refreshToken: cookieStore.get(REFRESH_COOKIE)?.value ?? null,
  };
}

export async function getCurrentUser(): Promise<PublicUser | null> {
  const { accessToken } = await readStoredTokens();
  if (!accessToken) return null;

  try {
    return await fetchCurrentUser(accessToken);
  } catch (error) {
    if (isUnauthorizedAuthError(error)) return null;
    throw error;
  }
}

export async function startPasswordSession(input: LoginInput) {
  const session = await loginWithPassword(input);
  await persistAuthSession(session);
  return session.user;
}

export async function startGoogleSession(input: GoogleAuthInput) {
  const session = await authenticateWithGoogle(input);
  await persistAuthSession(session);
  return session.user;
}

export async function startBuyerRegistrationSession(input: BuyerRegistrationInput) {
  const session = await registerBuyer(input);
  await persistAuthSession(session);
  return session.user;
}

export async function startSupplierRegistrationSession(input: SupplierRegistrationInput) {
  const session = await registerSupplier(input);
  await persistAuthSession(session);
  return session.user;
}

export async function rotateAuthSession(): Promise<PublicUser | null> {
  const { refreshToken } = await readStoredTokens();
  if (!refreshToken) return null;

  try {
    const session = await refreshAuthSession(refreshToken);
    await persistAuthSession(session);
    return session.user;
  } catch (error) {
    if (isUnauthorizedAuthError(error)) {
      await clearAuthSession();
      return null;
    }
    throw error;
  }
}

export async function endAuthSession() {
  const { refreshToken } = await readStoredTokens();

  try {
    if (refreshToken) await revokeAuthSession(refreshToken);
  } finally {
    await clearAuthSession();
  }
}
