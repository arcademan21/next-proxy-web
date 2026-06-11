"use client"

import { useState, type ReactNode } from "react"
import { Check, Copy } from "lucide-react"
import { cn } from "@/lib/utils"

const KEYWORDS = [
  "import",
  "from",
  "export",
  "const",
  "async",
  "await",
  "function",
  "return",
  "default",
  "new",
  "if",
  "else",
  "type",
]

function highlight(line: string, key: number): ReactNode {
  // comments
  if (line.trimStart().startsWith("//")) {
    return (
      <span key={key} className="text-muted-foreground/70">
        {line}
      </span>
    )
  }

  // Tokenize on strings, then highlight keywords/numbers in the rest.
  const parts = line.split(/("(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`|'(?:[^'\\]|\\.)*')/g)

  return (
    <span key={key}>
      {parts.map((part, i) => {
        if (/^["'`]/.test(part)) {
          return (
            <span key={i} className="text-emerald-300/90">
              {part}
            </span>
          )
        }
        const sub = part.split(/(\b[A-Za-z_][A-Za-z0-9_]*\b|\d+)/g)
        return sub.map((tok, j) => {
          if (KEYWORDS.includes(tok)) {
            return (
              <span key={`${i}-${j}`} className="text-primary font-medium">
                {tok}
              </span>
            )
          }
          if (/^\d+$/.test(tok)) {
            return (
              <span key={`${i}-${j}`} className="text-amber-300/90">
                {tok}
              </span>
            )
          }
          if (
            tok === "nextProxyHandler" ||
            tok === "nextProxyHandlerAsync" ||
            tok === "NextResponse" ||
            tok === "NextRequest" ||
            tok === "proxyFetch" ||
            tok === "useProxyFetch" ||
            tok === "ProxyFetchProvider" ||
            tok === "useProxyFetchContext" ||
            tok === "ErrorInfo" ||
            tok === "ProxyFetchResponse"
          ) {
            return (
              <span key={`${i}-${j}`} className="text-sky-300/90">
                {tok}
              </span>
            )
          }
          return <span key={`${i}-${j}`}>{tok}</span>
        })
      })}
    </span>
  )
}

interface CodeBlockProps {
  code: string
  filename?: string
  variant?: "default" | "danger"
  className?: string
}

export function CodeBlock({ code, filename, variant = "default", className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  const lines = code.replace(/\n$/, "").split("\n")

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-[oklch(0.14_0.012_250)] shadow-2xl shadow-black/40",
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-border/80 bg-card/60 px-4 py-2.5">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-red-500/70" />
            <span className="h-3 w-3 rounded-full bg-amber-500/70" />
            <span className="h-3 w-3 rounded-full bg-emerald-500/70" />
          </div>
          {filename && (
            <span
              className={cn(
                "font-mono text-xs",
                variant === "danger" ? "text-red-300/80" : "text-muted-foreground",
              )}
            >
              {filename}
            </span>
          )}
        </div>
        <button
          onClick={copy}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          aria-label="Copy code"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-primary" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-[13px] leading-relaxed">
        <code className="grid font-mono">
          {lines.map((line, i) => (
            <div key={i} className="grid grid-cols-[2ch_1fr] gap-4">
              <span className="select-none text-right tabular-nums text-muted-foreground/40">{i + 1}</span>
              <span className="whitespace-pre-wrap break-words">{highlight(line, i)}</span>
            </div>
          ))}
        </code>
      </pre>
    </div>
  )
}
