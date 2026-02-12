import HeroCarousel from '@/components/HeroCarousel'
import Hero from '@/components/Hero'
import Manifesto from '@/components/Manifesto'
import Featured from '@/components/Featured'
import BlogSection from '@/components/BlogSection'
import Events from '@/components/Events'
import Updates from '@/components/Updates'
import Registration from '@/components/Registration'

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-black text-white relative">
      <HeroCarousel />
      <Hero />
      <Manifesto />
      <Featured />
      <BlogSection />
      <Events />
      <Updates />
      <Registration />
      
      <footer className="py-12 text-center font-mono text-xs text-neutral-500 bg-white">
          <p>© 2026 ASTERIX CLUB. ALL SYSTEMS NOMINAL.</p>
      </footer>
    </main>
  )
}
