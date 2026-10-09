import { authErrorResponse, sessionResponse } from "@/lib/auth/route-response";
import { endAuthSession, getCurrentUser } from "@/lib/auth/session";

export async function GET() {
  try {
    const user = await getCurrentUser();
    return sessionResponse({ authenticated: Boolean(user), user });
  } catch (error) {
    return authErrorResponse(error);
  }
}

export async function DELETE() {
  try {
    await endAuthSession();
    return sessionResponse({ authenticated: false, user: null });
  } catch (error) {
    return authErrorResponse(error);
  }
}
