import { SiteNav } from "@/components/site-nav"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { Docs } from "@/components/docs"
import { Comparison } from "@/components/comparison"
import { SiteFooter } from "@/components/site-footer"

export default function Page() {
  return (
    <main className="min-h-screen">
      <SiteNav />
      <Hero />
      <Features />
      <Docs />
      <Comparison />
      <SiteFooter />
    </main>
  )
}
