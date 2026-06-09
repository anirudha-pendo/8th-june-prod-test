"use client";

import { useEffect, useRef } from "react";

const ANON_ID_KEY = "pendo_anonymous_id";

function getAnonymousId(): string {
  if (typeof window === "undefined") return "";

  let id = localStorage.getItem(ANON_ID_KEY);
  if (!id) {
    id = `anon-${crypto.randomUUID()}`;
    localStorage.setItem(ANON_ID_KEY, id);
  }
  return id;
}

export function PendoAnonymous() {
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const anonId = getAnonymousId();
    if (anonId) {
      pendo.initialize({
        visitor: { id: anonId },
      });
    }
  }, []);

  return null;
}
