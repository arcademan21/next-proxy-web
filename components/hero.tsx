"use client"

import { useState } from "react"
import { ArrowRight, ShieldCheck } from "lucide-react"
import { CodeBlock } from "@/components/code-block"
import { GithubIcon } from "@/components/icons"
import { cn } from "@/lib/utils"

const BEFORE = `// app/api/users/route.ts
// The client controls the destination URL.
export async function POST(req) {
  const { url } = await req.json()

  // No SSRF guard, no CORS, no rate limit,
  // credentials leak straight to the client.
  const res = await fetch(url, {
    headers: { authorization: process.env.API_KEY },
  })

  return Response.json(await res.json())
}`

const AFTER = `// app/api/proxy/route.ts
import { nextProxyHandler } from "nextjs-proxy"

export const POST = nextProxyHandler({
  baseUrl: process.env.EXTERNAL_API_BASE,
  allowOrigins: ["https://app.my-domain.com"],
  inMemoryRate: { windowMs: 60000, max: 100 },
  maskSensitiveData: (data) => ({ ...data, password: "***" }),
  log: (e) => console.log("[proxy]", e),
})`

const stats = [
  { value: "SSRF", label: "Blocked by default" },
  { value: "0-config", label: "CORS preflight" },
  { value: "Edge", label: "& Node runtime" },
]

export function Hero() {
  const [tab, setTab] = useState<"before" | "after">("after")

  return (
    <section className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-60"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, oklch(0.72 0.16 162 / 0.18), transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(70%_50%_at_50%_0%,black,transparent)]"
        style={{
          backgroundImage:
            "linear-gradient(to right, oklch(1 0 0 / 0.04) 1px, transparent 1px), linear-gradient(to bottom, oklch(1 0 0 / 0.04) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:py-28">
        <div className="max-lg:w-[76%]">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <ShieldCheck className="h-3.5 w-3.5" />
            Secure API proxy for the App Router
          </div>

          <h1 className="mt-6 text-balance text-3xl font-semibold tracking-tight sm:text-5xl lg:text-[3.4rem] lg:leading-[1.05]">
            One secure entry point for every outbound API call in Next.js
          </h1>

          <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground max-lg:pr-10">
            SSRF protection, CORS management, Rate Limiting, and Request
            Transformation built directly into the App Router.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#docs"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-transform hover:-translate-y-0.5"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="https://github.com/arcademan21/nextjs-proxy"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card/40 px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/40"
            >
              <GithubIcon className="h-4 w-4" />
              View on GitHub
            </a>
          </div>

          <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-border/60 pt-6">
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="font-mono text-xl font-semibold text-primary">{s.value}</dt>
                <dd className="mt-1 text-xs text-muted-foreground">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="max-lg:w-[68%]">
          <div className="mb-3 inline-flex rounded-lg border border-border bg-card/50 p-1">
            <button
              onClick={() => setTab("before")}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                tab === "before"
                  ? "bg-destructive/15 text-red-300"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              The Problem (Before)
            </button>
            <button
              onClick={() => setTab("after")}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                tab === "after"
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              The Solution (After)
            </button>
          </div>

          {tab === "before" ? (
            <CodeBlock filename="app/api/users/route.ts" code={BEFORE} variant="danger" />
          ) : (
            <CodeBlock filename="app/api/proxy/route.ts" code={AFTER} />
          )}
        </div>
      </div>
    </section>
  )
}
