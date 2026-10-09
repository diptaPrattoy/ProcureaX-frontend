import "server-only";

import { NextResponse } from "next/server";

import { AuthApiError } from "@/lib/auth/api";

const privateResponseHeaders = {
  "Cache-Control": "no-store, max-age=0",
  Vary: "Cookie",
};

export function sessionResponse(body: unknown, init?: ResponseInit) {
  return NextResponse.json(body, {
    ...init,
    headers: {
      ...privateResponseHeaders,
      ...init?.headers,
    },
  });
}

export function authErrorResponse(error: unknown) {
  if (error instanceof AuthApiError) {
    return sessionResponse(
      { success: false, message: error.message },
      { status: error.status },
    );
  }

  return sessionResponse(
    { success: false, message: "Unable to update the session right now." },
    { status: 500 },
  );
}
