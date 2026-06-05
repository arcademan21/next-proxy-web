import type { Metadata } from "next"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"
import { DocsSidebar } from "@/components/docs-page/docs-sidebar"
import { DocsArticle } from "@/components/docs-page/docs-article"

export const metadata: Metadata = {
  title: "Documentation — nextjs-proxy",
  description:
    "Full documentation for nextjs-proxy: installation, named routes, SSRF protection, CORS, rate limiting, streaming, request transformation, configuration reference, and changelog.",
}

export default function DocsPage() {
  return (
    <main className="min-h-dvh">
      <SiteNav />
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
          <DocsSidebar />
          <DocsArticle />
        </div>
      </div>
      <SiteFooter />
    </main>
  )
}
