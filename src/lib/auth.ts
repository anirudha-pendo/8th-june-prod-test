import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { betterAuth } from "better-auth";
import { organization } from "better-auth/plugins/organization";

import { mongoClient, mongoDb } from "@/lib/mongodb";

export const auth = betterAuth({
  appName: "Notes App",
  database: mongodbAdapter(mongoDb, {
    client: mongoClient,
  }),
  emailAndPassword: {
    enabled: true,
  },
  experimental: {
    joins: true,
  },
  plugins: [
    organization({
      organizationLimit: 1,
      membershipLimit: 25,
      cancelPendingInvitationsOnReInvite: true,
    }),
  ],
});

export type Session = typeof auth.$Infer.Session;
