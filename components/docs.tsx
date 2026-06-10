"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CodeBlock } from "@/components/code-block";
import { cn } from "@/lib/utils";

const INSTALL = `# pnpm
pnpm add nextjs-proxy

# npm
npm install nextjs-proxy`;

const USAGE = `// app/api/proxy/route.ts
import { nextProxyHandler } from "nextjs-proxy"

export const POST = nextProxyHandler({
  baseUrl: "https://api.my-service.com",
  allowOrigins: ["https://app.my-domain.com"],
  inMemoryRate: { windowMs: 60000, max: 100 },
  validate: (req) => {
    const auth = req.headers.get("authorization")
    return !!(auth && auth.includes("Bearer "))
  },
  transformRequest: ({ method, endpoint, data }) => ({
    method: method,
    endpoint: endpoint,
    data: data,
  }),
})`;

const options = [
  {
    name: "routes",
    type: "Record<string, string>",
    desc: "Named, server-controlled destinations so the client never picks the URL.",
  },
  {
    name: "baseUrl",
    type: "string",
    desc: "Prefix used to resolve relative endpoints.",
  },
  {
    name: "allowOrigins",
    type: "string[]",
    desc: "CORS whitelist of permitted origins.",
  },
  {
    name: "allowPrivateHosts",
    type: "boolean",
    desc: "Opt-in escape hatch for internal hosts (off by default).",
  },
  {
    name: "inMemoryRate",
    type: "{ windowMs, max, key? }",
    desc: "Simple in-memory rate limiting grouped by IP or custom key.",
  },
  {
    name: "transformRequest",
    type: "({ method, endpoint, data }) => {…}",
    desc: "Modify the payload before the upstream fetch.",
  },
  {
    name: "transformResponse",
    type: "(res) => any",
    desc: "Adjust the response before sending it to the client.",
  },
  {
    name: "maskSensitiveData",
    type: "(data) => any",
    desc: "Sanitize and mask sensitive keys before transit.",
  },
  {
    name: "validate",
    type: "(req) => boolean | Promise",
    desc: "Block the flow for auth or permission checks.",
  },
  {
    name: "log",
    type: "(info) => void",
    desc: "Receive request, response, and error events.",
  },
];

export function Docs() {
  const [tab, setTab] = useState<"install" | "usage">("install");

  return (
    <section id="docs" className="border-y border-border/60 bg-card/20">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
        <div className="max-w-2xl">
          <p className="font-mono text-sm text-primary">Quick start</p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Up and running in two steps
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground leading-relaxed">
            Install the package, drop a single handler into your route, and
            configure exactly what you need.
          </p>

          <Link
            href="/docs"
            className="mt-6 inline-flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-4 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/15"
          >
            Read the full documentation
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-2">
          <div className="lg:order-2">
            <div className="mb-3 inline-flex rounded-lg border border-border bg-background/60 p-1">
              {(["install", "usage"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={cn(
                    "rounded-md px-4 py-1.5 text-xs font-medium capitalize transition-colors",
                    tab === t
                      ? "bg-primary/15 text-primary"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {t === "install" ? "Installation" : "Usage Example"}
                </button>
              ))}
            </div>

            {tab === "install" ? (
              <CodeBlock filename="terminal" code={INSTALL} />
            ) : (
              <CodeBlock filename="app/api/proxy/route.ts" code={USAGE} />
            )}
          </div>

          <div className="overflow-hidden rounded-2xl border border-border lg:order-1">
            <div className="border-b border-border bg-card/60 px-5 py-3">
              <h3 className="font-mono text-sm font-semibold">
                Configuration options
              </h3>
            </div>
            <div className="max-h-[460px] overflow-y-auto divide-y divide-border/60">
              {options.map((o) => (
                <div
                  key={o.name}
                  className="px-5 py-4 transition-colors hover:bg-secondary/40"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <code className="rounded bg-primary/12 px-1.5 py-0.5 font-mono text-xs text-primary">
                      {o.name}
                    </code>
                    <code className="font-mono text-xs text-muted-foreground/80">
                      {o.type}
                    </code>
                  </div>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    {o.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
