"use client";

import { RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ErrorFeedback } from "@/components/ui/feedback-state";

export default function WorkspaceError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <ErrorFeedback action={<Button onClick={reset}><RotateCcw /> Try again</Button>} />;
}
