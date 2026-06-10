import { Package, ShieldCheck } from "lucide-react";
import { GithubIcon } from "@/components/icons";
import Image from "next/image";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-card/20">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 py-10 sm:px-6 md:flex-row">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center text-primary ">
            <Image
              src="/assets/images/logo.png"
              alt="nextjs-proxy"
              width={50}
              height={50}
              style={{
                filter: "drop-shadow(0 0 1px rgba(0, 0, 0, 0.1))",
                transform: "scale(4)",
              }}
            />
          </span>
          <p className="text-center text-sm text-muted-foreground md:text-left">
            <span className="font-medium text-foreground">MIT Licensed</span>
            {" • "}
            Created by Haroldy Arturo Pérez Rodríguez (ArcadeMan)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://github.com/arcademan21/nextjs-proxy"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
          >
            <GithubIcon className="h-4 w-4" />
            GitHub
          </a>
          <a
            href="https://www.npmjs.com/package/nextjs-proxy"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
          >
            <Package className="h-4 w-4" />
            npm
          </a>
        </div>
      </div>
    </footer>
  );
}
