import { z } from "zod";
import { paginationSchema } from "@/lib/rfqs/contracts";

export const notificationSchema = z.object({ id: z.uuid(), userId: z.uuid(), type: z.string(), title: z.string(), message: z.string(), metadata: z.unknown().nullable(), readAt: z.string().nullable(), createdAt: z.string() });
export const notificationListSchema = z.object({ items: z.array(notificationSchema), pagination: paginationSchema });
export type Notification = z.infer<typeof notificationSchema>;
