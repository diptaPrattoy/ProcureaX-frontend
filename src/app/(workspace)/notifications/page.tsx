import type { Metadata } from "next";
import { Suspense } from "react";
import { NotificationCenter } from "@/components/notifications/notification-center";
import { LoadingFeedback } from "@/components/ui/feedback-state";
export const metadata: Metadata = { title: "Notifications" }; type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };
export default function NotificationsPage({ searchParams }: Props) { return <Suspense fallback={<LoadingFeedback />}><NotificationCenter searchParams={searchParams} /></Suspense>; }
