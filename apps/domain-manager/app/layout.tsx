import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Domain Manager | 11-Domain Portfolio',
  description: 'Gestionnaire de domaines pour le portfolio 11-domaines avec optimisation Pareto',
  manifest: '/manifest.json',
  themeColor: '#00f3ff',
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" data-theme="cyberpunk">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}