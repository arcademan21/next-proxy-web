"use client"

import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { BookOpen, Menu, Rocket, SlidersHorizontal, Sparkles, X } from "lucide-react";
import { GithubIcon } from "@/components/icons";

const links = [
  { label: "Features", href: "/#features", Icon: Sparkles },
  { label: "Quick start", href: "/#docs", Icon: Rocket },
  { label: "Comparison", href: "/#comparison", Icon: SlidersHorizontal },
  { label: "Docs", href: "/docs", Icon: BookOpen },
];

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    hamburgerRef.current?.focus();
  }, []);

  // Resize guard — close drawer when crossing 768px
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const handler = (e: MediaQueryListEvent | MediaQueryList) => {
      if (e.matches) setOpen(false);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Escape key closes drawer
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, close]);

  // Body scroll lock when drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Focus trap inside drawer
  useEffect(() => {
    if (!open) return;
    const drawer = drawerRef.current;
    if (!drawer) return;

    const focusable = drawer.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    const handler = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };

    drawer.addEventListener("keydown", handler);
    first?.focus();
    return () => drawer.removeEventListener("keydown", handler);
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center">
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
            <span className="text-2xl font-semibold tracking-tight">
              Nextjs Proxy
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <l.Icon className="h-4 w-4" />
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
            <button
              ref={hamburgerRef}
              onClick={() => setOpen((v) => !v)}
              className="ml-2 inline-flex h-9 w-9 items-center justify-center rounded-lg md:hidden"
              aria-expanded={open}
              aria-controls="mobile-drawer"
              aria-label={open ? "Close navigation" : "Open navigation"}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Backdrop — outside header to avoid backdrop-filter clipping */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60"
          aria-hidden="true"
          onClick={close}
        />
      )}

      {/* Mobile drawer — outside header to avoid backdrop-filter breaking fixed positioning */}
      <aside
        id="mobile-drawer"
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col bg-background shadow-2xl motion-safe:transition-transform motion-safe:duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between border-b border-border/60 px-6 py-4">
          <Link href="/" className="flex items-center gap-2" onClick={close}>
            <span className="flex h-7 w-7 items-center justify-center">
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
            <span className="text-lg font-semibold tracking-tight">
              Nextjs Proxy
            </span>
          </Link>
          <button
            onClick={close}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground"
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Drawer nav links */}
        <div className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 py-4">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={close}
              className="inline-flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <l.Icon className="h-5 w-5" />
              {l.label}
            </a>
          ))}
        </div>

        {/* Drawer footer */}
        <div className="border-t border-border/60 px-4 py-4">
          <a
            href="https://www.npmjs.com/package/nextjs-proxy"
            target="_blank"
            rel="noreferrer"
            onClick={close}
            className="flex items-center justify-center rounded-lg border border-border px-4 py-3 font-mono text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
          >
            npm i nextjs-proxy
          </a>
        </div>
      </aside>
    </>
  );
}
