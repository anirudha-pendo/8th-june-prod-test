import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { ensureUserOrganization } from "@/lib/organizations";
import { requireApiSession } from "@/lib/session";
import { settingsUpdateSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function GET() {
  const session = await requireApiSession();

  if (!session) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const requestHeaders = await headers();
  const organization = await ensureUserOrganization(session, requestHeaders);

  return Response.json({
    user: session.user,
    organization,
  });
}

export async function PATCH(request: Request) {
  const session = await requireApiSession();

  if (!session) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const parsed = settingsUpdateSchema.safeParse(await request.json());

  if (!parsed.success) {
    return Response.json(
      { message: parsed.error.issues[0]?.message ?? "Invalid settings payload" },
      { status: 400 }
    );
  }

  const requestHeaders = await headers();
  const organization = await ensureUserOrganization(session, requestHeaders);
  const userUpdate: {
    name?: string;
    image?: string | null;
  } = {};

  if (parsed.data.name) {
    userUpdate.name = parsed.data.name;
  }

  if ("image" in parsed.data) {
    userUpdate.image = parsed.data.image ?? null;
  }

  if (Object.keys(userUpdate).length > 0) {
    await auth.api.updateUser({
      headers: requestHeaders,
      body: userUpdate,
    });
  }

  let updatedOrganization = organization;

  if (parsed.data.organizationName) {
    updatedOrganization =
      (await auth.api.updateOrganization({
        headers: requestHeaders,
        body: {
          organizationId: organization.id,
          data: {
            name: parsed.data.organizationName,
          },
        },
      })) ?? organization;
  }

  const updatedSession = await auth.api.getSession({
    headers: requestHeaders,
  });

  return Response.json({
    user: updatedSession?.user ?? session.user,
    organization: updatedOrganization,
  });
}
