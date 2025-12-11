import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'FixieRun - Suivi GPS avec NFTs',
  description: 'Application de suivi GPS en temps réel avec minting de NFTs',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}