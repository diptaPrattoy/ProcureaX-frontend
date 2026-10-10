import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";

import { requireUser } from "@/lib/auth/access";

export const metadata: Metadata = { title: "Workspace" };

const destinations = { BUYER: "/buyer", SUPPLIER: "/supplier", ADMIN: "/admin" } as const;

export default function WorkspacePage() {
  return (
    <Suspense fallback={null}>
        <WorkspaceAccess />
    </Suspense>
  );
}

async function WorkspaceAccess() {
  const user = await requireUser("/workspace");
  return redirect(destinations[user.role]);
}
