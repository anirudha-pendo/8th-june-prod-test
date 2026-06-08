import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { connectMongoClient } from "@/lib/mongodb";

export async function getCurrentSession() {
  await connectMongoClient();

  return auth.api.getSession({
    headers: await headers(),
  });
}

export async function requireSession() {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/login");
  }

  return session;
}

export async function requireApiSession() {
  const session = await getCurrentSession();

  if (!session) {
    return null;
  }

  return session;
}
