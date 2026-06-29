"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function visitorId(): string {
  const KEY = "kf_vid";
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(KEY, id);
  }
  return id;
}

export function TrackPageView() {
  const pathname = usePathname();

  useEffect(() => {
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visitor_id: visitorId(), path: pathname }),
    }).catch(() => {});
  }, [pathname]);

  return null;
}
