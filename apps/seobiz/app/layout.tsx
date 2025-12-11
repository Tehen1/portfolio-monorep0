export const metadata = {
  title: 'SEOBiz - SEO Analytics Platform',
  description: 'Advanced SEO tools and analytics for modern businesses',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
