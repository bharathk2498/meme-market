import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Meme Market - Predict Viral Trends 24 Hours Early',
  description: 'AI-powered platform that predicts what content will go viral on Reddit before it explodes',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}