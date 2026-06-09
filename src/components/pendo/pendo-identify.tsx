"use client";

import { useEffect, useRef } from "react";

type PendoIdentifyProps = {
  visitor: {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image?: string | null;
    createdAt: Date | string;
    updatedAt: Date | string;
  };
  account: {
    id: string;
    name: string;
    slug: string;
    createdAt: string | Date;
    logo?: string | null;
  };
};

export function PendoIdentify({ visitor, account }: PendoIdentifyProps) {
  const identifiedRef = useRef(false);

  useEffect(() => {
    if (identifiedRef.current) return;
    identifiedRef.current = true;

    pendo.initialize({
      visitor: {
        id: visitor.id,
        email: visitor.email,
        full_name: visitor.name,
        emailVerified: visitor.emailVerified,
        image: visitor.image ?? "",
        createdAt: visitor.createdAt,
        updatedAt: visitor.updatedAt,
      },
      account: {
        id: account.id,
        name: account.name,
        slug: account.slug,
        createdAt: account.createdAt,
        logo: account.logo ?? "",
      },
    });
  }, [visitor, account]);

  return null;
}
