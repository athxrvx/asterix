import Hero from '@/components/Hero'
import Vision from '@/components/Vision'
import Manifesto from '@/components/Manifesto'
import Featured from '@/components/Featured'
import ProjectTicker from '@/components/ProjectTicker'
import BlogSection from '@/components/BlogSection'
import Events from '@/components/Events'
import Updates from '@/components/Updates'
import Registration from '@/components/Registration'
import FloatingNav from '@/components/FloatingNav'

export default function Home() {
  return (
    <main id="top" className="min-h-screen w-full bg-black text-white relative">
      <section id="hero"><Hero /></section>
      <section id="vision"><Vision /></section>
      <section id="manifesto"><Manifesto /></section>
      <section id="projects"><Featured /></section>
      <ProjectTicker />
      <section id="logs"><BlogSection /></section>
      <section id="events"><Events /></section>
      <Updates />
      <section id="register"><Registration /></section>
      <FloatingNav />
      
      <footer className="py-12 text-center font-mono text-xs text-neutral-500 bg-white">
          <p>© 2026 ASTERIX CLUB. ALL SYSTEMS NOMINAL.</p>
      </footer>
    </main>
  )
}
