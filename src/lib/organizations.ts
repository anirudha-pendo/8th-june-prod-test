import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import type { Session } from "@/lib/auth";
import type { OrganizationSummary } from "@/lib/types";

function slugify(value: string) {
  const slug = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);

  return slug || "workspace";
}

export async function ensureUserOrganization(
  session: Session,
  requestHeaders?: Headers
): Promise<OrganizationSummary> {
  const authHeaders = requestHeaders ?? (await headers());
  const organizations = await auth.api.listOrganizations({
    headers: authHeaders,
  });

  if (organizations[0]) {
    return organizations[0];
  }

  const db = await getDb();
  const baseName = session.user.name
    ? `${session.user.name}'s Organization`
    : "Personal Organization";
  const baseSlug = `${slugify(session.user.name || "workspace")}-${session.user.id.slice(0, 8)}`;
  let slug = baseSlug;

  for (let suffix = 1; suffix < 5; suffix += 1) {
    const existing = await db.collection("organization").findOne({ slug });

    if (!existing) {
      break;
    }

    slug = `${baseSlug}-${suffix}`;
  }

  const organization = await auth.api.createOrganization({
    headers: authHeaders,
    body: {
      name: baseName,
      slug,
      keepCurrentActiveOrganization: false,
    },
  });

  return organization;
}
