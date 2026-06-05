import type { ReactNode } from "react"
import { CodeBlock } from "@/components/code-block"
import { ShieldCheck, Info, AlertTriangle } from "lucide-react"

function Section({ id, eyebrow, title, children }: { id: string; eyebrow?: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-border/60 pt-12 first:border-t-0 first:pt-0">
      {eyebrow ? <p className="font-mono text-xs font-semibold uppercase tracking-wider text-primary">{eyebrow}</p> : null}
      <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
      <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-muted-foreground">{children}</div>
    </section>
  )
}

function Callout({ tone = "info", children }: { tone?: "info" | "warn" | "secure"; children: ReactNode }) {
  const map = {
    info: { Icon: Info, cls: "border-border bg-card/50 text-foreground" },
    warn: { Icon: AlertTriangle, cls: "border-destructive/30 bg-destructive/10 text-foreground" },
    secure: { Icon: ShieldCheck, cls: "border-primary/30 bg-primary/10 text-foreground" },
  }[tone]
  const { Icon, cls } = map
  return (
    <div className={`flex gap-3 rounded-xl border p-4 text-sm ${cls}`}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
      <div className="space-y-1 [&_code]:rounded [&_code]:bg-secondary [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-xs">
        {children}
      </div>
    </div>
  )
}

function Opt({ name, type, children }: { name: string; type: string; children: ReactNode }) {
  return (
    <div className="border-b border-border/60 py-4 last:border-b-0">
      <div className="flex flex-wrap items-center gap-2">
        <code className="rounded bg-primary/12 px-1.5 py-0.5 font-mono text-xs text-primary">{name}</code>
        <code className="font-mono text-xs text-muted-foreground/80">{type}</code>
      </div>
      <p className="mt-1.5 text-sm text-muted-foreground">{children}</p>
    </div>
  )
}

const INSTALL = `# pnpm
pnpm add nextjs-proxy

# npm
npm install nextjs-proxy

# yarn
yarn add nextjs-proxy`

const QUICK = `// app/api/proxy/route.ts
import { nextProxyHandler } from "nextjs-proxy"

export const POST = nextProxyHandler({
  baseUrl: "https://api.my-service.com",
  allowOrigins: ["https://app.my-domain.com"],
  inMemoryRate: { windowMs: 60_000, max: 100 },
})`

const NAMED = `// app/api/proxy/route.ts
export const POST = nextProxyHandler({
  // The client sends { route: "profile" } — never a URL.
  routes: {
    profile: "https://api.my-service.com/v1/me",
    billing: "https://billing.internal/v2/invoices",
  },
  allowOrigins: ["https://app.my-domain.com"],
})

// Client
await fetch("/api/proxy", {
  method: "POST",
  body: JSON.stringify({ route: "profile" }),
})`

const SSRF = `export const POST = nextProxyHandler({
  // Allowlist of destination hosts for absolute endpoints.
  allowedHosts: ["api.stripe.com", "*.my-service.com"],

  // Block internal / loopback / metadata hosts (default: false).
  allowPrivateHosts: false,
})
// Absolute endpoints outside the allowlist -> 403 "Endpoint not allowed"`

const CORS = `export const POST = nextProxyHandler({
  // Required: explicit allowlist (never "*") when using credentials.
  allowOrigins: ["https://app.my-domain.com"],

  // Emits Access-Control-Allow-Credentials: true and reflects the origin.
  corsCredentials: true,
})`

const RATE = `import { nextProxyHandler, InMemoryRateLimitStore } from "nextjs-proxy"

export const POST = nextProxyHandler({
  inMemoryRate: {
    windowMs: 60_000,
    max: 100,
    key: (req) => req.headers.get("x-api-key") ?? "anon",
    // Plug a shared backend (e.g. Redis) for global limits:
    // store: new RedisRateLimitStore(),
  },
})`

const STREAM = `export const POST = nextProxyHandler({
  baseUrl: process.env.LLM_API_BASE,
  // true | "auto" | (req) => boolean | "auto"
  stream: "auto", // pipe only when upstream Content-Type is stream-like
})
// All guards (auth, CSRF, CORS, rate limit, validate, SSRF)
// run BEFORE the fetch — streaming never bypasses them.`

const TRANSFORM = `export const POST = nextProxyHandler({
  baseUrl: "https://api.my-service.com",

  transformRequest: ({ method, endpoint, data }) => ({
    method,
    endpoint,
    data: { ...data, source: "web" },
  }),

  transformResponse: (res) => ({ ok: true, data: res }),

  maskSensitiveData: (data) => ({ ...data, password: "***" }),
})`

const ERRORS = `export const POST = nextProxyHandler({
  timeoutMs: 30_000, // aborts the upstream fetch; 0 disables. Timeout -> 504
  log: (event) => {
    // "request" | "response" | "error" — full detail stays server-side
    console.log("[proxy]", event)
  },
})`

const MIDDLEWARE = `// Next.js 16: middleware.ts -> proxy.ts, export middleware -> proxy
// proxy.ts
export { proxy } from "./lib/edge-proxy"
export const config = { matcher: "/api/:path*" }`

export function DocsArticle() {
  return (
    <article className="min-w-0 space-y-12 pb-24">
      <header>
        <p className="font-mono text-sm text-primary">Documentation</p>
        <h1 className="mt-2 text-balance text-4xl font-semibold tracking-tight">nextjs-proxy</h1>
        <p className="mt-4 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
          A single, hardened entry point for every outbound API call in the Next.js App Router — SSRF protection, CORS,
          rate limiting, streaming, and request transformation in one handler.
        </p>
        <div className="mt-5 flex flex-wrap gap-2 font-mono text-xs">
          <span className="rounded-full border border-border bg-card/50 px-3 py-1 text-muted-foreground">v2.2.1</span>
          <span className="rounded-full border border-border bg-card/50 px-3 py-1 text-muted-foreground">MIT</span>
          <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-primary">App Router</span>
        </div>
      </header>

      <Section id="introduction" eyebrow="Getting started" title="Introduction">
        <p>
          Without a proxy, a client-facing route that fetches an arbitrary URL leaks credentials and opens you to
          Server-Side Request Forgery. <code className="rounded bg-secondary px-1 py-0.5 font-mono text-xs">nextjs-proxy</code>{" "}
          replaces that pattern with one configurable handler that runs every security guard before any upstream request.
        </p>
        <Callout tone="secure">
          <p>
            <strong>Recommended:</strong> use <code>named routes</code> so the client sends a <code>route</code> name
            instead of a URL — the server decides the destination and client-driven SSRF becomes impossible.
          </p>
        </Callout>
      </Section>

      <Section id="installation" eyebrow="Getting started" title="Installation">
        <p>Install from npm with your package manager of choice. The package is Turbopack-compatible from the registry.</p>
        <CodeBlock filename="terminal" code={INSTALL} />
      </Section>

      <Section id="quick-start" eyebrow="Getting started" title="Quick start">
        <p>
          Create a route handler and export it. The proxy is an App Router route handler — Pages Router API routes
          (<code className="rounded bg-secondary px-1 py-0.5 font-mono text-xs">pages/api/*</code>) are not supported.
        </p>
        <CodeBlock filename="app/api/proxy/route.ts" code={QUICK} />
      </Section>

      <Section id="named-routes" eyebrow="Security" title="Named routes">
        <p>
          The <code className="rounded bg-secondary px-1 py-0.5 font-mono text-xs">routes</code> option maps a name to a
          trusted, server-defined destination. The client never controls where the request goes — the strongest SSRF
          posture and the recommended way to use the proxy.
        </p>
        <CodeBlock filename="app/api/proxy/route.ts" code={NAMED} />
        <Callout tone="info">
          <p>
            Resolved routes bypass <code>allowedHosts</code> but still respect the http/https and internal-host checks.
            An unknown route returns <code>400 Unknown route</code> without disclosing which names exist; inherited keys
            like <code>constructor</code> are never resolved.
          </p>
        </Callout>
      </Section>

      <Section id="ssrf" eyebrow="Security" title="SSRF protection">
        <p>
          For absolute endpoints, host validation is enforced by default (v2.0.0). The host of{" "}
          <code className="rounded bg-secondary px-1 py-0.5 font-mono text-xs">baseUrl</code> is implicitly trusted for
          relative endpoints.
        </p>
        <CodeBlock filename="app/api/proxy/route.ts" code={SSRF} />
        <Callout tone="secure">
          <p>
            With <code>allowPrivateHosts: false</code> the proxy blocks <code>127.0.0.1</code>, <code>localhost</code>,
            cloud metadata (<code>169.254.169.254</code>), and the <code>10/8</code>, <code>172.16/12</code>,{" "}
            <code>192.168/16</code> ranges plus their IPv6 equivalents. Denials return a generic{" "}
            <code>403 Endpoint not allowed</code>; the reason goes only to <code>log</code>.
          </p>
        </Callout>
      </Section>

      <Section id="cors" eyebrow="Security" title="CORS & credentials">
        <p>
          Set the allowlist with <code className="rounded bg-secondary px-1 py-0.5 font-mono text-xs">allowOrigins</code>.
          Preflight handling is zero-config; a denied <code className="rounded bg-secondary px-1 py-0.5 font-mono text-xs">OPTIONS</code>{" "}
          returns a clean 403 with no <code className="rounded bg-secondary px-1 py-0.5 font-mono text-xs">Access-Control-Allow-*</code> headers.
        </p>
        <CodeBlock filename="app/api/proxy/route.ts" code={CORS} />
        <Callout tone="warn">
          <p>
            Combining <code>corsCredentials</code> with a wildcard or unset <code>allowOrigins</code> throws at
            construction — reflecting the origin with credentials would leak a credentialed response to any origin.
          </p>
        </Callout>
      </Section>

      <Section id="rate-limiting" eyebrow="Security" title="Rate limiting">
        <p>
          <code className="rounded bg-secondary px-1 py-0.5 font-mono text-xs">inMemoryRate</code> groups requests by IP
          or a custom key. It is per-instance best-effort on serverless — plug a shared{" "}
          <code className="rounded bg-secondary px-1 py-0.5 font-mono text-xs">RateLimitStore</code> (e.g. Redis) for
          global limits.
        </p>
        <CodeBlock filename="app/api/proxy/route.ts" code={RATE} />
      </Section>

      <Section id="streaming" eyebrow="Features" title="Streaming passthrough">
        <p>
          The <code className="rounded bg-secondary px-1 py-0.5 font-mono text-xs">stream</code> option (v2.2.0) pipes the
          upstream body straight to the client for Server-Sent Events, NDJSON, and LLM token streaming. Additive and
          backward compatible.
        </p>
        <CodeBlock filename="app/api/proxy/route.ts" code={STREAM} />
        <Callout tone="info">
          <p>
            Only <code>content-type</code> and <code>cache-control</code> are forwarded; every other upstream header
            (including <code>Set-Cookie</code>) is dropped. Adds <code>X-Content-Type-Options: nosniff</code> and{" "}
            <code>X-Accel-Buffering: no</code> for event streams. <code>timeoutMs</code> only guards time-to-headers.
          </p>
        </Callout>
      </Section>

      <Section id="transform" eyebrow="Features" title="Transform & masking">
        <p>
          Reshape the request before the upstream fetch, the response before it reaches the client, and mask sensitive
          keys in transit. <code className="rounded bg-secondary px-1 py-0.5 font-mono text-xs">transformResponse</code>{" "}
          is skipped for streamed bodies.
        </p>
        <CodeBlock filename="app/api/proxy/route.ts" code={TRANSFORM} />
        <Callout tone="warn">
          <p>
            If <code>transformRequest</code> rewrites the <code>endpoint</code>, the named-route trust is dropped and the
            resulting URL is re-validated against <code>allowedHosts</code>.
          </p>
        </Callout>
      </Section>

      <Section id="errors" eyebrow="Features" title="Errors & timeouts">
        <p>
          A <code className="rounded bg-secondary px-1 py-0.5 font-mono text-xs">500</code> never serializes the internal
          error to the client (<code className="rounded bg-secondary px-1 py-0.5 font-mono text-xs">Internal proxy error</code>);
          full detail goes only to <code className="rounded bg-secondary px-1 py-0.5 font-mono text-xs">log</code>. Set a
          timeout to abort slow upstreams.
        </p>
        <CodeBlock filename="app/api/proxy/route.ts" code={ERRORS} />
      </Section>

      <Section id="middleware" eyebrow="Features" title="Middleware (Next.js 16)">
        <p>
          In Next.js 16, <code className="rounded bg-secondary px-1 py-0.5 font-mono text-xs">middleware.ts</code> was
          renamed to <code className="rounded bg-secondary px-1 py-0.5 font-mono text-xs">proxy.ts</code> and the export{" "}
          <code className="rounded bg-secondary px-1 py-0.5 font-mono text-xs">middleware</code> to{" "}
          <code className="rounded bg-secondary px-1 py-0.5 font-mono text-xs">proxy</code>. The guidance still applies to
          Next 13–15.
        </p>
        <CodeBlock filename="proxy.ts" code={MIDDLEWARE} />
      </Section>

      <Section id="config" eyebrow="Reference" title="Configuration reference">
        <p>Every option accepted by the handler.</p>
        <div className="rounded-2xl border border-border bg-card/30 px-5">
          <Opt name="routes" type="Record<string, string> | (name, req) => string">
            Named, server-controlled destinations so the client never picks the URL.
          </Opt>
          <Opt name="baseUrl" type="string">Prefix used to resolve relative endpoints; its host is trusted.</Opt>
          <Opt name="allowedHosts" type="string | string[] | (url, req) => boolean">
            Allowlist for absolute endpoints. Supports exact host, <code>*.example.com</code>, and <code>*</code>.
          </Opt>
          <Opt name="allowPrivateHosts" type="boolean (default false)">
            Opt-in escape hatch for internal / loopback / metadata hosts.
          </Opt>
          <Opt name="allowOrigins" type="string[]">CORS allowlist of permitted origins (use a list, not <code>*</code>, with credentials).</Opt>
          <Opt name="corsCredentials" type="boolean">Emit <code>Access-Control-Allow-Credentials: true</code> and reflect the origin.</Opt>
          <Opt name="inMemoryRate" type="{ windowMs, max, key?, store? }">In-memory rate limit by IP or custom key; pluggable store for global limits.</Opt>
          <Opt name="stream" type='boolean | "auto" | (req) => boolean | "auto"'>Pipe the upstream body without buffering for SSE / NDJSON / token streams.</Opt>
          <Opt name="transformRequest" type="({ method, endpoint, data }) => {…}">Modify the payload before the upstream fetch.</Opt>
          <Opt name="transformResponse" type="(res) => any">Adjust the response before sending it (skipped while streaming).</Opt>
          <Opt name="maskSensitiveData" type="(data) => any">Sanitize and mask sensitive keys before transit.</Opt>
          <Opt name="validate" type="(req) => boolean | Promise<boolean>">Block the flow for auth or permission checks.</Opt>
          <Opt name="timeoutMs" type="number (default 30000)">Abort the upstream fetch; <code>0</code> disables. Timeouts return <code>504</code>.</Opt>
          <Opt name="log" type="(info) => void">Receive <code>request</code>, <code>response</code>, and <code>error</code> events.</Opt>
        </div>
      </Section>

      <Section id="changelog" eyebrow="Reference" title="Changelog">
        <div className="space-y-6">
          {CHANGELOG.map((entry) => (
            <div key={entry.version} className="rounded-2xl border border-border bg-card/30 p-5">
              <div className="flex flex-wrap items-baseline gap-3">
                <code className="rounded-full bg-primary/12 px-2.5 py-1 font-mono text-xs font-semibold text-primary">
                  {entry.version}
                </code>
                <span className="font-mono text-xs text-muted-foreground">{entry.date}</span>
                <span className="text-sm font-medium text-foreground">{entry.title}</span>
              </div>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {entry.items.map((it, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary/60" />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>
    </article>
  )
}

const CHANGELOG = [
  {
    version: "v2.2.1",
    date: "2026-06-04",
    title: "Maintenance & tests",
    items: [
      "Normalized repository.url so npm and tooling resolve the repo cleanly.",
      "Removed redundant next/server type shims; tests typecheck against real Next types.",
      "Added a real runtime integration test driving a live upstream over fetch. Suite is now 71/71.",
    ],
  },
  {
    version: "v2.2.0",
    date: "2026-06-04",
    title: "Streaming passthrough",
    items: [
      "New stream option: true | \"auto\" | per-request — pipes SSE, NDJSON, and LLM token streams.",
      "All guards run before the fetch; only content-type & cache-control are forwarded, Set-Cookie dropped.",
      "Adds nosniff and X-Accel-Buffering: no for event streams. 67/67 tests pass.",
    ],
  },
  {
    version: "v2.1.x",
    date: "2026-06-04",
    title: "Named routes, pluggable rate limit & CORS credentials",
    items: [
      "New routes option resolves server-defined destinations, eliminating client-driven SSRF.",
      "RateLimitStore interface + InMemoryRateLimitStore for shared/global limits.",
      "Opt-in corsCredentials, hardened against wildcard origins. Docs rewritten, all English.",
    ],
  },
  {
    version: "v2.0.0",
    date: "2026-06-04",
    title: "SSRF protection (breaking)",
    items: [
      "Added allowedHosts and allowPrivateHosts; absolute endpoints rejected (403) unless allowed.",
      "Added timeoutMs (504 on timeout); internal errors no longer leak to the client.",
      "Removed nextProxyHandlerAsync; preflight no longer reflects denied origins.",
    ],
  },
]
