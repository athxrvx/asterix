'use client'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

export default function Hero() {
  const containerRef = useRef(null)
  
  return (
    <section ref={containerRef} className="relative min-h-screen w-full flex flex-col justify-between p-6 md:p-12 overflow-hidden border-b border-white/10">
      {/* Background Grid - Visible on Hover/Interaction */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none bg-[linear-gradient(to_right,#333_1px,transparent_1px),linear-gradient(to_bottom,#333_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

      {/* Top Bar */}
      <header className="relative z-10 flex justify-between items-start font-mono text-xs md:text-sm tracking-widest text-neutral-400">
        <div>
          <span className="block text-white">ASTERIX</span>
          <span className="block mt-1">EST. 2026</span>
        </div>
        <div className="text-right hidden md:block">
          <span className="block">COORDINATES</span>
          <span className="block mt-1">45.5017° N, 73.5673° W</span>
        </div>
        <div className="text-right">
            <span className="block text-white">STATUS</span>
            <span className="flex items-center gap-2 justify-end mt-1">
                ONLINE <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
            </span>
        </div>
      </header>

      {/* Main Title */}
      <div className="relative z-10 mt-20 md:mt-0">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-6xl md:text-[8vw] leading-[0.9] font-sans font-bold tracking-tighter mix-blend-difference"
        >
          ARTIFICIAL
          <br />
          INTELLIGENCE,
          <br />
          <span className="font-serif italic font-normal text-white/80">HUMAN AMBITION.</span>
        </motion.h1>
      </div>

      {/* Footer / Specs */}
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-end gap-6 font-mono text-xs text-neutral-500 mt-20">
        <div className="max-w-md">
           <p className="uppercase tracking-wide mb-2 text-white">Mission Statement_</p>
           <p>Merging technical depth with creative expression. We explore the tension between precision and chaos.</p>
        </div>
        
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-4"
        >
            <span>SCROLL TO EXPLORE</span>
            <div className="w-[1px] h-10 bg-neutral-700 relative overflow-hidden">
                <motion.div 
                    animate={{ y: ['-100%', '100%'] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                    className="absolute inset-0 w-full h-1/2 bg-white" 
                />
            </div>
        </motion.div>
      </div>
    </section>
  )
}
