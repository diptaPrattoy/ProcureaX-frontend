import { authErrorResponse, sessionResponse } from "@/lib/auth/route-response";
import { rotateAuthSession } from "@/lib/auth/session";

export async function POST() {
  try {
    const user = await rotateAuthSession();

    if (!user) {
      return sessionResponse(
        { authenticated: false, user: null, message: "No renewable session was found." },
        { status: 401 },
      );
    }

    return sessionResponse({ authenticated: true, user });
  } catch (error) {
    return authErrorResponse(error);
  }
}
