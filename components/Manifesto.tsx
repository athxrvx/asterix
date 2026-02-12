'use client'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

export default function Manifesto() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  // Parallax for text elements
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -50])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 50])

  return (
    <section ref={containerRef} className="relative min-h-[80vh] flex items-center justify-center p-6 md:p-24 overflow-hidden bg-white text-black">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        {/* Left: Code Logic */}
        <div className="font-mono text-xs md:text-sm tracking-tight opacity-70 order-2 md:order-1">
            <div className="mb-4 text-neutral-500">
                01001000 01010101 01001101 01000001 01001110
            </div>
            <p className="mb-6 max-w-sm">
                The machine does not dream. It computes. 
                But in that computation, we find a new kind of dreaming—
                structured, infinite, and emergent.
            </p>
            <ul className="space-y-2 border-l border-black/20 pl-4">
                <li>&gt; PRECISION × CHAOS</li>
                <li>&gt; CODE × ART</li>
                <li>&gt; LOGIC × IMAGINATION</li>
                <li>&gt; STRUCTURE × EMERGENCE</li>
            </ul>
        </div>

        {/* Right: Creative Expression */}
        <div className="relative order-1 md:order-2">
            <motion.h2 style={{ y: y1 }} className="text-5xl md:text-7xl font-serif leading-tight">
                We are building<br/>
                <span className="italic">the future</span><br/>
                of intelligent<br/>
                design.
            </motion.h2>
            
            <motion.div style={{ y: y2 }} className="absolute -right-4 -bottom-10 md:-right-10 md:bottom-10 w-24 h-24 md:w-40 md:h-40 border border-black rounded-full flex items-center justify-center animate-spin-slow">
                <span className="font-mono text-[10px] md:text-xs tracking-widest">ASTERIX CLUB</span>
            </motion.div>
        </div>

      </div>

      {/* Background glitch/texture elements */}
      <div className="absolute top-0 right-0 p-4 font-mono text-xs text-black/30">
        SYS.CONFIG_LOADED
      </div>
    </section>
  )
}
