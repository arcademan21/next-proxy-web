import Link from "next/link"
import { ShieldCheck } from "lucide-react"
import { GithubIcon } from "@/components/icons"

const links = [
  { label: "Features", href: "/#features" },
  { label: "Quick start", href: "/#docs" },
  { label: "Comparison", href: "/#comparison" },
  { label: "Docs", href: "/docs" },
]

export function SiteNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary ring-1 ring-primary/30">
            <ShieldCheck className="h-4.5 w-4.5" />
          </span>
          <span className="font-mono text-sm font-semibold tracking-tight">
            nextjs-proxy
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="https://www.npmjs.com/package/nextjs-proxy"
            target="_blank"
            rel="noreferrer"
            className="hidden rounded-lg border border-border px-3 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground sm:inline-block"
          >
            npm i nextjs-proxy
          </a>
          <a
            href="https://github.com/arcademan21/nextjs-proxy"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-secondary px-3 py-1.5 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/70"
          >
            <GithubIcon className="h-4 w-4" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </div>
    </header>
  )
}
