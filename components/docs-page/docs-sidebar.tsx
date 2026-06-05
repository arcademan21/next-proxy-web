"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export type DocsSection = { id: string; label: string }

export const DOCS_SECTIONS: { group: string; items: DocsSection[] }[] = [
  {
    group: "Getting started",
    items: [
      { id: "introduction", label: "Introduction" },
      { id: "installation", label: "Installation" },
      { id: "quick-start", label: "Quick start" },
    ],
  },
  {
    group: "Security",
    items: [
      { id: "named-routes", label: "Named routes" },
      { id: "ssrf", label: "SSRF protection" },
      { id: "cors", label: "CORS & credentials" },
      { id: "rate-limiting", label: "Rate limiting" },
    ],
  },
  {
    group: "Features",
    items: [
      { id: "streaming", label: "Streaming passthrough" },
      { id: "transform", label: "Transform & masking" },
      { id: "errors", label: "Errors & timeouts" },
      { id: "middleware", label: "Middleware (Next 16)" },
    ],
  },
  {
    group: "Reference",
    items: [
      { id: "config", label: "Configuration reference" },
      { id: "changelog", label: "Changelog" },
    ],
  },
]

export function DocsSidebar() {
  const [active, setActive] = useState("introduction")

  useEffect(() => {
    const ids = DOCS_SECTIONS.flatMap((g) => g.items.map((i) => i.id))
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id)
        }
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 },
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  return (
    <nav className="sticky top-24 hidden max-h-[calc(100vh-7rem)] overflow-y-auto pr-4 lg:block">
      <ul className="space-y-6">
        {DOCS_SECTIONS.map((group) => (
          <li key={group.group}>
            <p className="mb-2 font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
              {group.group}
            </p>
            <ul className="space-y-0.5 border-l border-border/60">
              {group.items.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className={cn(
                      "-ml-px block border-l py-1.5 pl-4 text-sm transition-colors",
                      active === item.id
                        ? "border-primary font-medium text-primary"
                        : "border-transparent text-muted-foreground hover:border-border hover:text-foreground",
                    )}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </nav>
  )
}
