import type { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import './globals.css'

export const metadata: Metadata = {
  title: 'Meme Market - AI-Powered Viral Trend Prediction',
  description: 'Predict what goes viral 24 hours before it explodes. Multi-platform prediction with Perplexity AI, Reddit, Twitter, TikTok and more.',
  keywords: ['meme prediction', 'viral trends', 'AI prediction', 'Reddit analytics', 'Twitter trends', 'TikTok trends'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Navigation />
        {children}
      </body>
    </html>
  )
}