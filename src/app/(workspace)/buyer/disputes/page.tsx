import type { Metadata } from "next";
import { Suspense } from "react";
import { DisputeList } from "@/components/disputes/dispute-list";
import { LoadingFeedback } from "@/components/ui/feedback-state";
export const metadata: Metadata = { title: "Disputes" }; type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };
export default function DisputesPage({ searchParams }: Props) { return <Suspense fallback={<LoadingFeedback />}><DisputeList role="BUYER" searchParams={searchParams} /></Suspense>; }
