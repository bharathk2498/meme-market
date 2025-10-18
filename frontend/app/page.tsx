import Hero from '@/components/Hero'
import Features from '@/components/Features'
import Pricing from '@/components/Pricing'
import LivePredictions from '@/components/LivePredictions'
import CTA from '@/components/CTA'
import Footer from '@/components/Footer'
import DashboardPreview from '@/components/DashboardPreview'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <DashboardPreview />
      <LivePredictions />
      <Features />
      <Pricing />
      <CTA />
      <Footer />
    </main>
  )
}