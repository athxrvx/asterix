'use client'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { team } from '@/lib/data'
import Image from 'next/image'

export default function Team() {
  const containerRef = useRef(null)
  
  return (
    <section ref={containerRef} className="py-24 px-6 md:px-12 bg-neutral-900 border-t border-white/10 text-white min-h-[50vh]">
       <div className="flex justify-between items-end mb-24 border-b border-white/20 pb-4">
           <h2 className="text-5xl md:text-7xl font-sans font-bold tracking-tighter mix-blend-difference">COLLECTIVE_</h2>
           <span className="font-mono text-xs hidden md:block">CORE MEMBERS</span>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
           {team.map((member, i) => (
               <motion.div 
                   key={i}
                   initial={{ opacity: 0, y: 30 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: i * 0.1 }}
                   className="group relative"
               >
                   <div className="aspect-[3/4] w-full bg-neutral-800 mb-4 overflow-hidden grayscale hover:grayscale-0 transition-all duration-500">
                       {/* Placeholder for image if not exists */}
                       <div className="w-full h-full bg-neutral-800 flex items-center justify-center text-neutral-700 font-mono text-xs">
                          IMAGE_MISSING
                       </div>
                   </div>
                   
                   <div className="border-l border-white/20 pl-4 transition-all group-hover:pl-6 group-hover:border-white">
                       <h3 className="text-xl font-sans font-bold uppercase">{member.name}</h3>
                       <p className="font-mono text-xs text-neutral-400 mt-1">{member.role}</p>
                   </div>
               </motion.div>
           ))}
       </div>
    </section>
  )
}