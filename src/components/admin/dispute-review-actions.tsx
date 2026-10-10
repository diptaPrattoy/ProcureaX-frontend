"use client";

import { Check, LoaderCircle, SearchCheck, X } from "lucide-react";
import { useActionState } from "react";
import { adminDisputeAction, type AdminActionState } from "@/app/(workspace)/admin-actions";
import { Button } from "@/components/ui/button";

const initial: AdminActionState = { status: "idle" };
export function DisputeReviewActions({ id, status }: { id: string; status: string }) { const [state, action, pending] = useActionState(adminDisputeAction, initial); if (status !== "OPEN" && status !== "UNDER_REVIEW") return null; return <form action={action} className="rounded-[1.5rem] border border-ink/10 bg-white p-6"><input name="disputeId" type="hidden" value={id} /><p className="font-bold">Administrator decision</p>{status === "UNDER_REVIEW" ? <textarea className="mt-4 min-h-28 w-full rounded-xl border border-ink/15 bg-cream p-4 text-sm outline-none" maxLength={5000} minLength={10} name="resolution" placeholder="Document the decision and expected outcome…" required /> : null}<div className="mt-4 flex flex-wrap gap-3">{status === "OPEN" ? <Button disabled={pending} name="action" type="submit" value="review">{pending ? <LoaderCircle className="animate-spin" /> : <SearchCheck />} Start review</Button> : <><Button disabled={pending} name="action" type="submit" value="resolve"><Check /> Resolve</Button><Button disabled={pending} name="action" type="submit" value="reject" variant="outline"><X /> Reject claim</Button></>}</div>{state.message ? <p className={`mt-3 text-sm font-semibold ${state.status === "error" ? "text-red-700" : "text-teal"}`} role="status">{state.message}</p> : null}</form>; }
