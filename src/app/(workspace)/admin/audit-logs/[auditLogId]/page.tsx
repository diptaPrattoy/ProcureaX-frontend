import type { Metadata } from "next";
import { Suspense } from "react";
import { AuditLogDetail } from "@/components/admin/audit-log";
import { LoadingFeedback } from "@/components/ui/feedback-state";
export const metadata: Metadata = { title: "Audit event" }; type Props = { params: Promise<{ auditLogId: string }> };
export default function AuditPage({ params }: Props) { return <Suspense fallback={<LoadingFeedback />}><Content params={params} /></Suspense>; } async function Content({ params }: Props) { const { auditLogId } = await params; return <AuditLogDetail id={auditLogId} />; }
