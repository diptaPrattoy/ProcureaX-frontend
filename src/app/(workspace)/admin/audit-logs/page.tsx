import type { Metadata } from "next";
import { Suspense } from "react";
import { AuditLogList } from "@/components/admin/audit-log";
import { LoadingFeedback } from "@/components/ui/feedback-state";
export const metadata: Metadata = { title: "Audit log" }; type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };
export default function AuditLogsPage({ searchParams }: Props) { return <Suspense fallback={<LoadingFeedback />}><AuditLogList searchParams={searchParams} /></Suspense>; }
