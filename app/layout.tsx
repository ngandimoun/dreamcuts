import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'

import Script from "next/script"; // Importez le composant Script de Next.js

export const metadata: Metadata = {
  title: 'dreamcut',
  description: 'Created with minatoai',
  generator: 'minatoai',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <script src="https://accounts.google.com/gsi/client" async defer></script>
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        {children}

      </body>
    </html>
  )
}
