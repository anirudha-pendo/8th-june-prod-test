"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export function PendoPageLoad() {
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Skip the first render — pendo.initialize() already triggers an initial page load
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (typeof window !== "undefined" && window.pendo) {
      pendo.pageLoad();
    }
  }, [pathname]);

  return null;
}
