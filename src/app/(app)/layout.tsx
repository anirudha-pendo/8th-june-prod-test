import { headers } from "next/headers";

import { AppShell } from "@/components/layout/app-shell";
import { ensureUserOrganization } from "@/lib/organizations";
import { requireSession } from "@/lib/session";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireSession();
  const requestHeaders = await headers();
  const organization = await ensureUserOrganization(session, requestHeaders);

  return (
    <AppShell user={session.user} organization={organization}>
      {children}
    </AppShell>
  );
}
