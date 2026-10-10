import "server-only";

import { redirect } from "next/navigation";

import type { PublicUser, UserRole } from "@/lib/auth/contracts";
import { getCurrentUser } from "@/lib/auth/session";

export function safeReturnPath(value: FormDataEntryValue | string | null | undefined) {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) {
    return "/workspace";
  }
  return value;
}

export async function requireUser(returnPath = "/workspace"): Promise<PublicUser> {
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(returnPath)}`);
  return user;
}

export async function requireRole(allowedRoles: readonly UserRole[], returnPath: string) {
  const user = await requireUser(returnPath);
  if (!allowedRoles.includes(user.role)) redirect("/workspace?access=denied");
  return user;
}
