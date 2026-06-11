import type { ReactNode } from "react"
import { CodeBlock } from "@/components/code-block"
import { ShieldCheck, Info, AlertTriangle } from "lucide-react"

function Section({ id, eyebrow, title, children }: { id: string; eyebrow?: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-border/60 pt-12 first:border-t-0 first:pt-0">
      {eyebrow ? <p className="font-mono text-xs font-semibold uppercase tracking-wider text-primary">{eyebrow}</p> : null}
      <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
      <div className="mt-5 space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-[15px]">{children}</div>
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

const GUARDS = `export const POST = nextProxyHandler({
  // Guards run top-to-bottom BEFORE the upstream fetch.
  // The first one that fails short-circuits with its status.
  auth: (req) => Boolean(req.headers.get("authorization")),   // 401
  csrf: (req) => req.headers.get("x-csrf") === process.env.CSRF, // 403
  // CORS origin check (allowOrigins) ............................ 403
  inMemoryRate: { windowMs: 60_000, max: 100 },               // 429
  rateLimit: async (req) => myRedisLimiter.check(req),        // 429
  validate: async (req) => userCanAccess(req),                // 401
  // SSRF host check on the resolved endpoint ................... 403
})`

const CLIENT = `// The client always POSTs a JSON body. Shape:
//   { method, endpoint, data?, route? }
// Prefer { route } so the server owns the destination.

// Named route (recommended):
await fetch("/api/proxy", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ route: "profile", method: "GET" }),
})

// Relative endpoint (resolved via baseUrl):
await fetch("/api/proxy", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ method: "POST", endpoint: "/orders", data: { sku: "X1" } }),
})`

const MIDDLEWARE = `// nextjs-proxy is a ROUTE HANDLER, not middleware — it lives in
// app/api/proxy/route.ts. You can still gate that route from the
// framework's edge file if you want a coarse pre-filter.

// Next 13–15:  middleware.ts        | export middleware
// Next 16:     proxy.ts             | export proxy
export function proxy(req) {
  // optional: cheap allowlist / header check before the handler runs
}
export const config = { matcher: "/api/proxy" }`

const CLIENT_INTRO = `import {
  proxyFetch,
  useProxyFetch,
  ProxyFetchProvider,
} from "nextjs-proxy"

// All three are re-exported from the same package.
// No extra dependencies required.`

const PROXY_FETCH = `import { proxyFetch } from "nextjs-proxy"

interface User {
  id: number
  name: string
}

// Basic GET (typed response):
const res = await proxyFetch<User>({
  route: "user",
  data: { id: 42 },
})
//  method defaults to "GET"
//  url defaults to "/api/proxy"

if (res.ok) {
  console.log(res.data.name) // ✅ typed
} else {
  console.log(res.status, res.error)
}

// POST with data:
const created = await proxyFetch({
  route: "users",
  method: "POST",
  data: { name: "Alice" },
  headers: { "X-Request-ID": "abc" },
})

// The proxyFetch function does NOT throw on HTTP errors.
// Only network failures (DNS, CORS, timeout) throw.
// Error classification:
//   "server" ↦ HTTP 4xx/5xx (returned in response.error)
//   "network" ↦ fetch threw TypeError (caught with try/catch)
//   "timeout" ↦ AbortError (caught with try/catch)`

const PROXY_HOOK = `import { useProxyFetch } from "nextjs-proxy"

function UserProfile({ userId }: { userId: number }) {
  const { data, error, loading, refetch } = useProxyFetch<User>({
    route: "user",
    data: { id: userId },
    enabled: true,        // fetch on mount (default)
  })

  if (loading) return <div>Loading...</div>
  if (error)  return <div>{error.message}</div>
  if (!data)  return <div>No data</div>

  return (
    <div>
      <p>{data.name}</p>
      <button onClick={refetch}>Refresh</button>
    </div>
  )
}

// Polling — auto-refetch every 5 s:
function LiveNotifications() {
  const { data: notifications } = useProxyFetch({
    route: "notifications",
    refetchInterval: 5_000, // starts after first response
  })
  return <ul>{notifications?.map(n => <li key={n.id}>{n.message}</li>)}</ul>
}

// Callbacks:
useProxyFetch({
  route: "orders",
  onSuccess: (data) => trackEvent("orders_loaded", data),
  onError:   (err)  => reportError(err),
})`

const PROXY_CONTEXT = `import {
  ProxyFetchProvider,
  proxyFetch,
} from "nextjs-proxy"

// Wrap your app (or a subtree):
<ProxyFetchProvider url="/api/v2/proxy">
  <App />
</ProxyFetchProvider>

// Any component inside the provider:
const res = await proxyFetch({ route: "user" })
// → uses "/api/v2/proxy"

// Per-call url overrides context:
const res2 = await proxyFetch({
  route: "user",
  url: "/custom-proxy", // forces this URL
})`

export function DocsArticle() {
  return (
    <article className="min-w-0 space-y-12 pb-24">
      <header>
        <p className="font-mono text-sm text-primary">Documentation</p>
        <h1 className="mt-2 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">nextjs-proxy</h1>
        <p className="mt-4 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
          A single, hardened entry point for every outbound API call in the Next.js App Router — SSRF protection, CORS,
          rate limiting, streaming, and request transformation in one handler.
        </p>
        <div className="mt-5 flex flex-wrap gap-2 font-mono text-xs">
          <span className="rounded-full border border-border bg-card/50 px-3 py-1 text-muted-foreground">v2.3.0</span>
          <span className="rounded-full border border-border bg-card/50 px-3 py-1 text-muted-foreground">MIT</span>
          <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-primary">App Router</span>
          <span className="rounded-full border border-border bg-card/50 px-3 py-1 text-muted-foreground">Next 13–16</span>
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

      <Section id="request-contract" eyebrow="Getting started" title="The request contract">
        <p>
          The client always sends a JSON body. The proxy reads four fields —{" "}
          <code className="rounded bg-secondary px-1 py-0.5 font-mono text-xs">method</code>,{" "}
          <code className="rounded bg-secondary px-1 py-0.5 font-mono text-xs">endpoint</code>,{" "}
          <code className="rounded bg-secondary px-1 py-0.5 font-mono text-xs">data</code>, and{" "}
          <code className="rounded bg-secondary px-1 py-0.5 font-mono text-xs">route</code> — and never trusts anything
          else from the client. An <code>Authorization</code> header on the incoming request is forwarded upstream as a
          Bearer token.
        </p>
        <CodeBlock filename="client.ts" code={CLIENT} />
        <Callout tone="info">
          <p>
            <code>GET</code> and <code>HEAD</code> are sent without a body. For every other method, <code>data</code> is
            JSON-encoded as the upstream body with <code>Content-Type: application/json</code>. A relative{" "}
            <code>endpoint</code> requires <code>baseUrl</code>; an absolute one must pass the{" "}
            <code>allowedHosts</code> check.
          </p>
        </Callout>
      </Section>

      <Section id="lifecycle" eyebrow="Getting started" title="Request lifecycle & guards">
        <p>
          Every request runs through an ordered chain of guards <strong>before</strong> any upstream fetch. The first
          guard that fails short-circuits the request with its own status code — so streaming, transforms, and the
          outbound call are never reached on a denied request.
        </p>
        <ol className="ml-1 space-y-2 text-sm">
          {[
            ["auth", "401 Unauthorized (auth)"],
            ["csrf", "403 Forbidden (csrf/xss)"],
            ["CORS origin (OPTIONS preflight + actual request)", "403 Origin not allowed"],
            ["inMemoryRate", "429 Rate limit exceeded"],
            ["rateLimit (external hook)", "429 Rate limit exceeded"],
            ["validate", "401 Unauthorized"],
            ["Named-route resolution + SSRF host check", "400 / 403"],
          ].map(([step, status], i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/12 font-mono text-[11px] font-semibold text-primary">
                {i + 1}
              </span>
              <span className="text-foreground/90">
                <code className="rounded bg-secondary px-1 py-0.5 font-mono text-xs">{step}</code>{" "}
                <span className="text-muted-foreground">→ {status} on failure</span>
              </span>
            </li>
          ))}
        </ol>
        <CodeBlock filename="app/api/proxy/route.ts" code={GUARDS} />
        <Callout tone="secure">
          <p>
            Because the SSRF host check is the last guard before the fetch, even an authenticated, in-quota request
            cannot reach a disallowed host. Guards are independent — configure only the ones you need.
          </p>
        </Callout>
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

      <Section id="errors" eyebrow="Features" title="Errors & status codes">
        <p>
          A <code className="rounded bg-secondary px-1 py-0.5 font-mono text-xs">500</code> never serializes the internal
          error to the client (<code className="rounded bg-secondary px-1 py-0.5 font-mono text-xs">Internal proxy error</code>);
          full detail goes only to <code className="rounded bg-secondary px-1 py-0.5 font-mono text-xs">log</code>. Set a
          timeout to abort slow upstreams. Every status the handler can return:
        </p>
        <div className="overflow-hidden rounded-2xl border border-border">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-border bg-card/60 text-left">
                <th className="px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Body</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">When</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 [&_code]:font-mono [&_code]:text-xs">
              {[
                ["401", '{ error: "Unauthorized (auth)" }', "auth hook returns false"],
                ["403", '{ error: "Forbidden (csrf/xss)" }', "csrf hook returns false"],
                ["403", '{ error: "Origin not allowed" }', "origin not in allowOrigins (or onCorsDenied body)"],
                ["429", '{ error: "Rate limit exceeded" }', "inMemoryRate or rateLimit denies"],
                ["401", '{ error: "Unauthorized" }', "validate hook returns false"],
                ["400", '{ error: "Named routes are not configured" }', "client sent route but no routes option"],
                ["400", '{ error: "Unknown route" }', "route name not resolvable"],
                ["400", '{ error: "Missing method or endpoint" }', "neither route nor method+endpoint present"],
                ["400", '{ error: "Relative endpoint without baseUrl" }', "relative endpoint and no baseUrl"],
                ["403", '{ error: "Endpoint not allowed" }', "SSRF: host blocked / not allowlisted"],
                ["504", '{ error: "Upstream request timed out" }', "upstream exceeded timeoutMs"],
                ["500", '{ error: "Internal proxy error" }', "any unexpected error (detail only in log)"],
                ["2xx–5xx", "upstream body (passthrough)", "successful proxy forwards upstream status & body"],
              ].map(([code, body, when], i) => (
                <tr key={i} className="hover:bg-secondary/30">
                  <td className="px-4 py-2.5 align-top">
                    <code className="rounded bg-primary/12 px-1.5 py-0.5 text-primary">{code}</code>
                  </td>
                  <td className="px-4 py-2.5 align-top text-muted-foreground">
                    <code>{body}</code>
                  </td>
                  <td className="px-4 py-2.5 align-top text-muted-foreground">{when}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
        <CodeBlock filename="app/api/proxy/route.ts" code={ERRORS} />
      </Section>

      <Section id="middleware" eyebrow="Features" title="Middleware (Next.js 16)">
        <p>
          <code className="rounded bg-secondary px-1 py-0.5 font-mono text-xs">nextjs-proxy</code> is a route handler, not
          middleware — all guards run inside the handler. If you also want a coarse edge pre-filter, note that Next.js 16
          renamed <code className="rounded bg-secondary px-1 py-0.5 font-mono text-xs">middleware.ts</code> to{" "}
          <code className="rounded bg-secondary px-1 py-0.5 font-mono text-xs">proxy.ts</code> and the export{" "}
          <code className="rounded bg-secondary px-1 py-0.5 font-mono text-xs">middleware</code> to{" "}
          <code className="rounded bg-secondary px-1 py-0.5 font-mono text-xs">proxy</code>. That naming applies to the
          framework file; the package API is unchanged across Next 13–16.
        </p>
        <CodeBlock filename="proxy.ts" code={MIDDLEWARE} />
      </Section>

      <Section id="client-intro" eyebrow="Client" title="Client-side usage (v2.3.0)">
        <p>
          Starting in v2.3.0, the package ships client-side helpers that abstract the POST-to-proxy pattern into a clean,
          typed API. Use them in React Client Components, plain <code className="rounded bg-secondary px-1 py-0.5 font-mono text-xs">.ts</code> modules, or
          anywhere you call <code className="rounded bg-secondary px-1 py-0.5 font-mono text-xs">fetch</code>.
        </p>
        <CodeBlock filename="client.ts" code={CLIENT_INTRO} />
        <Callout tone="info">
          <p>
            The helpers are <strong>client-only</strong>. On the server during SSR, <code>typeof window === "undefined"</code>{" "}
            causes the hook to skip fetching — proxy calls happen only on the client after hydration.
          </p>
        </Callout>
      </Section>

      <Section id="proxy-fetch" eyebrow="Client" title="proxyFetch()">
        <p>
          <code className="rounded bg-secondary px-1 py-0.5 font-mono text-xs">proxyFetch()</code> is the core client
          helper. It constructs the JSON payload (<code>method</code>, <code>route</code>, <code>data</code>,{" "}
          <code>headers</code>), POSTs it to the proxy endpoint, and returns a typed response. HTTP errors (4xx, 5xx) are
          returned in the response — only network failures throw.
        </p>

        <h3 className="mt-6 font-mono text-sm font-semibold text-foreground">Response shape</h3>
        <div className="overflow-hidden rounded-2xl border border-border">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-border bg-card/60 text-left">
                <th className="px-4 py-3 font-medium text-muted-foreground">Field</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Type</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 [&_code]:font-mono [&_code]:text-xs">
              {[
                ["ok", "boolean", "true when HTTP status is 2xx"],
                ["status", "number", "HTTP status code (200, 404, 500, etc.)"],
                ["data", "T | undefined", "Parsed response body (present when ok === true)"],
                ["error", "ErrorInfo | undefined", "Normalized error (present when ok === false)"],
                ["headers", "Headers | undefined", "Response headers from the proxy endpoint"],
              ].map(([field, type, desc], i) => (
                <tr key={i} className="hover:bg-secondary/30">
                  <td className="px-4 py-2.5 align-top">
                    <code className="rounded bg-primary/12 px-1.5 py-0.5 text-primary">{field}</code>
                  </td>
                  <td className="px-4 py-2.5 align-top font-mono text-xs text-muted-foreground">{type}</td>
                  <td className="px-4 py-2.5 align-top text-muted-foreground">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>

        <h3 className="mt-6 font-mono text-sm font-semibold text-foreground">Error classification</h3>
        <div className="overflow-hidden rounded-2xl border border-border">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-border bg-card/60 text-left">
                <th className="px-4 py-3 font-medium text-muted-foreground">Type</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">When</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Behavior</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 [&_code]:font-mono [&_code]:text-xs">
              {[
                ["server", "HTTP 4xx / 5xx", "Returned in response.error — does NOT throw"],
                ["network", "DNS fail, CORS, network down", "proxyFetch() throws TypeError"],
                ["timeout", "AbortController timeout", "proxyFetch() throws AbortError"],
                ["unknown", "Unexpected error shape", "proxyFetch() throws the raw error"],
              ].map(([type, when, behavior], i) => (
                <tr key={i} className="hover:bg-secondary/30">
                  <td className="px-4 py-2.5 align-top">
                    <code className="rounded bg-primary/12 px-1.5 py-0.5 text-primary">{type}</code>
                  </td>
                  <td className="px-4 py-2.5 align-top text-muted-foreground">{when}</td>
                  <td className="px-4 py-2.5 align-top text-muted-foreground">{behavior}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>

        <CodeBlock filename="client.ts" code={PROXY_FETCH} />
      </Section>

      <Section id="proxy-hook" eyebrow="Client" title="useProxyFetch()">
        <p>
          <code className="rounded bg-secondary px-1 py-0.5 font-mono text-xs">useProxyFetch()</code> wraps{" "}
          <code className="rounded bg-secondary px-1 py-0.5 font-mono text-xs">proxyFetch()</code> with React state
          management. It returns <code>loading</code>, <code>data</code>, <code>error</code>, and a{" "}
          <code>refetch()</code> function. Polling via <code>refetchInterval</code> starts after the first response and
          cleans up on unmount — no memory leaks.
        </p>

        <h3 className="mt-6 font-mono text-sm font-semibold text-foreground">Return value</h3>
        <div className="overflow-hidden rounded-2xl border border-border">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-border bg-card/60 text-left">
                <th className="px-4 py-3 font-medium text-muted-foreground">Field</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Type</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 [&_code]:font-mono [&_code]:text-xs">
              {[
                ["data", "T | undefined", "Response data (present on success)"],
                ["error", "ErrorInfo | undefined", "Normalized error (present on failure)"],
                ["loading", "boolean", "true while a fetch is in flight"],
                ["refetch", "() => Promise<void>", "Manually re-run the request (debounced)"],
              ].map(([field, type, desc], i) => (
                <tr key={i} className="hover:bg-secondary/30">
                  <td className="px-4 py-2.5 align-top">
                    <code className="rounded bg-primary/12 px-1.5 py-0.5 text-primary">{field}</code>
                  </td>
                  <td className="px-4 py-2.5 align-top font-mono text-xs text-muted-foreground">{type}</td>
                  <td className="px-4 py-2.5 align-top text-muted-foreground">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>

        <div className="mt-4 space-y-4 text-sm text-muted-foreground">
          <Callout tone="info">
            <p>
              <strong>Polling:</strong> starts <em>after</em> the first response to avoid a race condition on mount.
              Continues on error. Cleaned up on unmount. Manual <code>refetch()</code> restarts the interval.
            </p>
          </Callout>
          <Callout tone="info">
            <p>
              <strong>Debounce:</strong> <code>refetch()</code> is a no-op while a fetch is already in progress. Prevents
              accidental double-clicks or rapid re-renders from firing concurrent requests.
            </p>
          </Callout>
        </div>

        <CodeBlock filename="component.tsx" code={PROXY_HOOK} />
      </Section>

      <Section id="proxy-context" eyebrow="Client" title="ProxyFetchProvider">
        <p>
          <code className="rounded bg-secondary px-1 py-0.5 font-mono text-xs">ProxyFetchProvider</code> is an optional
          React Context provider that injects a proxy endpoint URL into all child{" "}
          <code className="rounded bg-secondary px-1 py-0.5 font-mono text-xs">proxyFetch()</code> and{" "}
          <code className="rounded bg-secondary px-1 py-0.5 font-mono text-xs">useProxyFetch()</code> calls.
        </p>

        <h3 className="mt-6 font-mono text-sm font-semibold text-foreground">URL resolution priority</h3>
        <ol className="ml-1 space-y-2 text-sm">
          {[
            ["Per-call url option", "highest priority — forces this URL for this call only"],
            ["Context URL (from ProxyFetchProvider)", "used when no per-call url is given"],
            ['Default "/api/proxy"', 'used when no provider is present and no url is given'],
          ].map(([step, desc], i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/12 font-mono text-[11px] font-semibold text-primary">
                {i + 1}
              </span>
              <span className="text-foreground/90">
                <code className="rounded bg-secondary px-1 py-0.5 font-mono text-xs">{step}</code>{" "}
                <span className="text-muted-foreground">— {desc}</span>
              </span>
            </li>
          ))}
        </ol>

        <CodeBlock filename="app/layout.tsx" code={PROXY_CONTEXT} />
        <Callout tone="info">
          <p>
            The provider is fully optional. If you don't need a custom URL, skip it — all calls default to{" "}
            <code>/api/proxy</code>. The provider is safe to use outside a Provider (returns the default).
          </p>
        </Callout>
      </Section>

      <Section id="config" eyebrow="Reference" title="Configuration reference">
        <p>
          Every option accepted by <code className="rounded bg-secondary px-1 py-0.5 font-mono text-xs">nextProxyHandler</code>,
          grouped by concern. All are optional; with no options the handler still applies the secure defaults (SSRF
          blocking of internal hosts, no buffered error leaks).
        </p>

        <h3 className="mt-2 font-mono text-sm font-semibold text-foreground">Destinations</h3>
        <div className="rounded-2xl border border-border bg-card/30 px-5">
          <Opt name="routes" type="Record<string, string> | (name, req) => string | undefined">
            Named, server-controlled destinations so the client never picks the URL. Record or resolver function; return
            <code> undefined</code> to reject. The safest mode — eliminates client-driven SSRF.
          </Opt>
          <Opt name="baseUrl" type="string">Prefix used to resolve relative endpoints; its host is implicitly trusted.</Opt>
          <Opt name="allowedHosts" type="string | string[] | (url: URL, req) => boolean">
            Allowlist for absolute endpoints. Supports exact host, <code>*.example.com</code>, and <code>*</code>. Omitted
            ⇒ absolute endpoints are rejected and only <code>baseUrl</code>-relative ones are allowed.
          </Opt>
          <Opt name="allowPrivateHosts" type="boolean (default false)">
            Opt-in escape hatch for internal / loopback / link-local / metadata hosts.
          </Opt>
          <Opt name="timeoutMs" type="number (default 30000)">
            Abort the upstream fetch after N ms; <code>0</code> disables. Timeouts return <code>504</code>. For streams it
            only guards time-to-headers.
          </Opt>
        </div>

        <h3 className="mt-6 font-mono text-sm font-semibold text-foreground">Guards & access control</h3>
        <div className="rounded-2xl border border-border bg-card/30 px-5">
          <Opt name="auth" type="(req) => boolean | Promise<boolean>">
            Authentication check run first. Returning <code>false</code> short-circuits with <code>401 Unauthorized (auth)</code>.
          </Opt>
          <Opt name="csrf" type="(req) => boolean | Promise<boolean>">
            CSRF / XSS check. Returning <code>false</code> short-circuits with <code>403 Forbidden (csrf/xss)</code>.
          </Opt>
          <Opt name="validate" type="(req) => boolean | Promise<boolean>">
            Final pre-fetch authorization / permission check. Returning <code>false</code> ⇒ <code>401 Unauthorized</code>.
          </Opt>
          <Opt name="rateLimit" type="(req) => boolean | Promise<boolean>">
            External rate-limit hook (e.g. backed by Redis). Returning <code>false</code> ⇒ <code>429 Rate limit exceeded</code>.
            Use this for strict global limits instead of <code>inMemoryRate</code>.
          </Opt>
          <Opt name="inMemoryRate" type="{ windowMs, max, key?, store? }">
            In-memory rate limit by IP or custom <code>key</code>; pluggable <code>store</code> for global limits.
            Per-instance / best-effort on serverless.
          </Opt>
        </div>

        <h3 className="mt-6 font-mono text-sm font-semibold text-foreground">CORS</h3>
        <div className="rounded-2xl border border-border bg-card/30 px-5">
          <Opt name="allowOrigins" type="string | string[] | (origin, req) => boolean">
            CORS allowlist of permitted origins. Use a specific origin, list, or function (never <code>*</code>) with credentials.
          </Opt>
          <Opt name="corsCredentials" type="boolean (default false)">
            Emit <code>Access-Control-Allow-Credentials: true</code> and reflect the origin. Throws at construction if combined with a wildcard / unset <code>allowOrigins</code>.
          </Opt>
          <Opt name="corsMethods" type='string[] (default ["POST","OPTIONS"])'>
            Methods advertised in <code>Access-Control-Allow-Methods</code>.
          </Opt>
          <Opt name="corsHeaders" type='string[] (default ["Content-Type","Authorization"])'>
            Headers advertised in <code>Access-Control-Allow-Headers</code>.
          </Opt>
          <Opt name="onCorsDenied" type="(origin) => unknown">
            Custom JSON body returned when an origin is denied (defaults to <code>{`{ error: "Origin not allowed" }`}</code>).
          </Opt>
        </div>

        <h3 className="mt-6 font-mono text-sm font-semibold text-foreground">Transform, mask & observe</h3>
        <div className="rounded-2xl border border-border bg-card/30 px-5">
          <Opt name="stream" type='boolean | "auto" | (req) => boolean | "auto"'>
            Pipe the upstream body without buffering for SSE / NDJSON / token streams. <code>"auto"</code> detects stream-like content types.
          </Opt>
          <Opt name="transformRequest" type="(payload) => Partial<payload> | void">
            Reshape the payload before the upstream fetch. Receives <code>{`{ method, endpoint, data, route }`}</code> and may return only the fields to override (or nothing). Rewriting <code>endpoint</code> drops named-route trust and re-validates against <code>allowedHosts</code>.
          </Opt>
          <Opt name="transformResponse" type="(res: object) => object">
            Adjust the response object before it reaches the client. Must return an object; only runs for object responses and is skipped while streaming.
          </Opt>
          <Opt name="sanitize" type="(data: unknown) => unknown">
            Sanitize the request body before transit (runs before <code>maskSensitiveData</code>).
          </Opt>
          <Opt name="maskSensitiveData" type="(data: unknown) => unknown">
            Mask sensitive keys in the outbound request body before transit.
          </Opt>
          <Opt name="log" type="(info: LogInfo) => void">
            Receive structured <code>request</code> / <code>response</code> / <code>error</code> events (ip, method, origin, endpoint, status, durationMs, payload).
          </Opt>
          <Opt name="monitor" type="(req, res?) => void">
            Suspicious-activity hook called after a response (without the body for streamed responses).
          </Opt>
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
    version: "v2.3.0",
    date: "2026-06-11",
    title: "Client-side helpers (proxyFetch, useProxyFetch, ProxyFetchProvider)",
    items: [
      "New proxyFetch() client helper with error classification, response parsing, and generic typing.",
      "New useProxyFetch() React hook with loading/data/error states, polling, and debounced refetch.",
      "New ProxyFetchProvider React Context for optional URL injection.",
      "All exported from the package entry point — zero extra dependencies.",
      "158 total tests (66 new), client.ts 100% coverage, hooks.ts 98% coverage.",
    ],
  },
  {
    version: "v2.2.3",
    date: "2026-06-06",
    title: "Quality hardening",
    items: [
      "Targeted unit tests raising branch coverage from ~83% to ~91%, statement coverage from ~89% to ~96%.",
      "typecheck script wired as pretest so local test runs the same type gate as CI.",
      "Enabled isolatedModules; migrated project history from CHANGE.log to CHANGELOG.md.",
      "92 tests total, no runtime or API changes.",
    ],
  },
  {
    version: "v2.2.2",
    date: "2026-06-05",
    title: "Formatting & tooling",
    items: [
      "Reformatted the handler source to the project formatter (no runtime change).",
      "No API, behavior, or security changes — the full suite, type-check, lint, build, and the Next 13/14/15 compat matrix stay green.",
    ],
  },
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
