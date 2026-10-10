"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth/access";
import { markAllNotificationsRead, markNotificationRead } from "@/lib/notifications/api";

export async function markNotificationReadAction(formData: FormData) { await requireUser("/notifications"); const id = String(formData.get("notificationId") ?? ""); await markNotificationRead(id); revalidatePath("/notifications"); }
export async function markAllNotificationsReadAction() { await requireUser("/notifications"); await markAllNotificationsRead(); revalidatePath("/notifications"); }
