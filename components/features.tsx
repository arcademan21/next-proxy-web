import { ShieldOff, Globe, Gauge, Cpu, Wand2, ScrollText } from "lucide-react"

const features = [
  {
    icon: ShieldOff,
    title: "SSRF Shield",
    desc: "Automatically blocks internal and private hosts like 127.0.0.1 and 169.254.169.254. Named routes mean the client never controls the destination URL.",
    span: "lg:col-span-2",
  },
  {
    icon: Globe,
    title: "Zero-Config CORS",
    desc: "Handles preflight OPTIONS requests automatically with secure, credentialed CORS matching only the origins you whitelist.",
    span: "",
  },
  {
    icon: Gauge,
    title: "Flex Rate Limiting",
    desc: "An in-memory process counter out of the box, with pluggable Redis storage support for distributed deployments.",
    span: "",
  },
  {
    icon: Cpu,
    title: "Fully Edge-Ready",
    desc: "Built natively on the Web Fetch API (NextRequest / NextResponse). Compatible with Node.js and Edge runtimes, Next.js 13 to 16+.",
    span: "lg:col-span-2",
  },
  {
    icon: Wand2,
    title: "Request / Response Transformer",
    desc: "Reshape payloads before they reach upstream and adjust responses before they return to the client.",
    span: "",
  },
  {
    icon: ScrollText,
    title: "Audit & Masking",
    desc: "Mask sensitive keys and log every request, response, and error through a single structured logging hook.",
    span: "lg:col-span-2",
  },
]

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
      <div className="max-w-2xl">
        <p className="font-mono text-sm text-primary">Core features</p>
        <h2 className="mt-3 text-balance text-2xl font-semibold tracking-tight sm:text-4xl">
          Governance and security for every outbound request
        </h2>
        <p className="mt-4 text-pretty text-muted-foreground leading-relaxed">
          A single, audited entry point that controls how your app talks to the outside world.
        </p>
      </div>

      <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <div
            key={f.title}
            className={`group rounded-2xl border border-border bg-card/50 p-6 transition-colors hover:border-primary/40 ${f.span}`}
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/12 text-primary ring-1 ring-primary/20">
              <f.icon className="h-5 w-5" />
            </span>
            <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
