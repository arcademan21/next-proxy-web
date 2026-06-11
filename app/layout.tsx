import { Analytics } from '@vercel/analytics/next'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://nextjs-proxy.dev'),
  title: {
    default: 'nextjs-proxy — One secure entry point for every outbound API call',
    template: '%s — nextjs-proxy',
  },
  description:
    'SSRF protection, CORS management, Rate Limiting, and Request Transformation built directly into the Next.js App Router.',
  keywords: [
    'nextjs-proxy',
    'Next.js',
    'API proxy',
    'SSRF protection',
    'CORS',
    'rate limiting',
    'App Router',
    'route handler',
    'streaming',
  ],
  authors: [{ name: 'Haroldy Arturo Pérez Rodríguez' }],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: 'nextjs-proxy',
    title: 'nextjs-proxy — One secure entry point for every outbound API call',
    description:
      'SSRF protection, CORS management, Rate Limiting, and Request Transformation built directly into the Next.js App Router.',
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'nextjs-proxy — Secure API proxy for the Next.js App Router',
    description:
      'SSRF protection, CORS, rate limiting, streaming, and request transformation in one App Router handler.',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`dark scroll-smooth overflow-x-hidden ${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="font-sans antialiased bg-background text-foreground">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
