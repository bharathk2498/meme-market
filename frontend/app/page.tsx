import Hero from '@/components/Hero'
import Features from '@/components/Features'
import Pricing from '@/components/Pricing'
import LivePredictions from '@/components/LivePredictions'
import CTA from '@/components/CTA'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <LivePredictions />
      <Features />
      <Pricing />
      <CTA />
      <Footer />
    </main>
  )
}