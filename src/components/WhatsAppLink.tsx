"use client";

import type { ReactNode } from "react";
import { gtagEvent } from "@/lib/gtag";

export function WhatsAppLink({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "33600000000";

  return (
    <a
      href={`https://wa.me/${number}`}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => gtagEvent("generate_lead", { method: "whatsapp" })}
    >
      {children}
    </a>
  );
}
