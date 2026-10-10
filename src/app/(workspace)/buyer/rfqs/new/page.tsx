import type { Metadata } from "next";
import { Suspense } from "react";

import { RfqWizard } from "@/components/rfqs/rfq-wizard";
import { LoadingFeedback } from "@/components/ui/feedback-state";
import { requireRole } from "@/lib/auth/access";
import { listCategories } from "@/lib/rfqs/api";

export const metadata: Metadata = { title: "Create RFQ" };
export default function NewRfqPage() { return <Suspense fallback={<LoadingFeedback />}><NewRfq /></Suspense>; }
async function NewRfq() { await requireRole(["BUYER"], "/buyer/rfqs/new"); const categories = await listCategories(); return <div className="mx-auto max-w-5xl"><p className="eyebrow">New request for quotation</p><h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-ink sm:text-5xl">Create a clear, comparable request.</h1><p className="mt-3 text-ink/50">Build the scope in three focused steps, then save it as a private draft.</p><div className="mt-8"><RfqWizard categories={categories} /></div></div>; }
