import { Check, Minus, X } from "lucide-react"

type RowValue = boolean | "partial"

const rows: { label: string; rewrites: RowValue; middleware: RowValue; proxy: RowValue }[] = [
  { label: "Security & SSRF protection", rewrites: false, middleware: "partial", proxy: true },
  { label: "Auditing & structured logging", rewrites: false, middleware: "partial", proxy: true },
  { label: "Governance over destinations", rewrites: false, middleware: "partial", proxy: true },
  { label: "Header & credential control", rewrites: false, middleware: true, proxy: true },
  { label: "Rate limiting built in", rewrites: false, middleware: false, proxy: true },
  { label: "Request / response transform", rewrites: false, middleware: "partial", proxy: true },
  { label: "Native to App Router", rewrites: true, middleware: false, proxy: true },
  { label: "Minimal boilerplate", rewrites: true, middleware: false, proxy: true },
]

function Cell({ value }: { value: RowValue }) {
  if (value === "partial")
    return <Minus className="mx-auto h-4 w-4 text-amber-400" aria-label="Partial" />
  return value ? (
    <Check className="mx-auto h-4 w-4 text-primary" aria-label="Yes" />
  ) : (
    <X className="mx-auto h-4 w-4 text-muted-foreground/50" aria-label="No" />
  )
}

export function Comparison() {
  return (
    <section id="comparison" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
      <div className="max-w-2xl">
        <p className="font-mono text-sm text-primary">Why it matters</p>
        <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          Rewrites vs custom middleware vs nextjs-proxy
        </h2>
        <p className="mt-4 text-pretty text-muted-foreground leading-relaxed">
          Rewrites are great for simple path forwarding. For security, auditing, and governance, nextjs-proxy wins.
        </p>
      </div>

      <div className="mt-12 overflow-hidden rounded-2xl border border-border">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-card/60 text-left">
              <th className="px-5 py-4 font-medium text-muted-foreground">Capability</th>
              <th className="px-3 py-4 text-center font-medium text-muted-foreground">Rewrites</th>
              <th className="hidden px-3 py-4 text-center font-medium text-muted-foreground sm:table-cell">Custom middleware</th>
              <th className="px-3 py-4 text-center">
                <span className="rounded-md bg-primary/15 px-2.5 py-1 font-mono text-xs font-semibold text-primary">
                  nextjs-proxy
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {rows.map((r) => (
              <tr key={r.label} className="transition-colors hover:bg-secondary/30">
                <td className="px-5 py-3.5 text-foreground/90">{r.label}</td>
                <td className="px-3 py-3.5">
                  <Cell value={r.rewrites} />
                </td>
                <td className="hidden px-3 py-3.5 sm:table-cell">
                  <Cell value={r.middleware} />
                </td>
                <td className="bg-primary/[0.04] px-3 py-3.5">
                  <Cell value={r.proxy} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </section>
  )
}
