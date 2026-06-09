import { headers } from "next/headers";

import { AppShell } from "@/components/layout/app-shell";
import { PendoIdentify } from "@/components/pendo/pendo-identify";
import { PendoPageLoad } from "@/components/pendo/pendo-page-load";
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
    <>
      <PendoPageLoad />
      <PendoIdentify
        visitor={{
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
          emailVerified: session.user.emailVerified,
          image: session.user.image,
          createdAt: session.user.createdAt,
          updatedAt: session.user.updatedAt,
        }}
        account={{
          id: organization.id,
          name: organization.name,
          slug: organization.slug,
          createdAt: organization.createdAt,
          logo: organization.logo,
        }}
      />
      <AppShell user={session.user} organization={organization}>
        {children}
      </AppShell>
    </>
  );
}
