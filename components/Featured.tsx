'use client'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { projects } from '@/lib/data'

export default function Featured() {
  const targetRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: targetRef })
  
  const x = useTransform(scrollYProgress, [0, 1], ["1%", "-75%"])

  return (
    <section ref={targetRef} className="relative h-[300vh] bg-neutral-900 border-t border-white/10">
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <div className="absolute top-12 left-6 md:left-12 z-10 mix-blend-difference">
             <h3 className="text-white font-mono text-sm tracking-widest uppercase border-b border-white pb-2 inline-block">Featured Research</h3>
        </div>
        
        <motion.div style={{ x }} className="flex gap-10 pl-[10vw]">
          {projects.map((project) => (
            <div key={project.id} className="group relative w-[80vw] md:w-[40vw] h-[60vh] flex-shrink-0 bg-black/40 border border-white/10 p-8 flex flex-col justify-between transition-colors hover:bg-neutral-800/60">
              <div className="font-mono text-xs opacity-50 flex justify-between">
                <span>PROJECT_{project.id}</span>
                <span>{project.year}</span>
              </div>
              
              <div className="space-y-4">
                  <h4 className="text-4xl md:text-6xl font-sans font-bold text-white group-hover:italic transition-all duration-300 uppercase tracking-tighter">{project.title}</h4>
                  <p className="font-mono text-sm text-neutral-400 border-l border-white/20 pl-4">{project.category}</p>
              </div>

               <div className="relative w-full h-1/2 border-t border-white/10 mt-8 pt-4">
                  <div className="w-full h-full bg-repeating-linear-gradient(45deg, transparent, transparent 10px, #ffffff05 10px, #ffffff05 11px)"></div>
               </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
