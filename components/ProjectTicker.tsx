'use client'
import { motion } from 'framer-motion'

const projects = [
    { name: "NEURAL SYNTH", id: "PRJ_01", status: "DEPLOYED" },
    { name: "VOID WALKER", id: "PRJ_02", status: "v2.4.0" },
    { name: "ECHO GRID", id: "PRJ_03", status: "ARCHIVED" },
    { name: "SENTIENT TYPE", id: "PRJ_04", status: "BETA" },
    { name: "CHRONO LOOP", id: "PRJ_05", status: "WIP" },
    { name: "LATENT SPACE", id: "PRJ_06", status: "LIVE" },
]

export default function ProjectTicker() {
  return (
    <div className="w-full bg-black border-b border-white/10 h-10 overflow-hidden relative z-50 flex items-center">
      {/* Gradient masks for smooth fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-black to-transparent z-10"></div>
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-black to-transparent z-10"></div>
      
      {/* Ticker Container - moves half its width (which is one full set of items) */}
      <motion.div 
        className="flex whitespace-nowrap min-w-full"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ 
            duration: 20, 
            ease: "linear", 
            repeat: Infinity 
        }}
      >
        {/* Render items twice to create seamless loop */}
        {[...projects, ...projects].map((p, i) => (
            <div key={i} className="flex items-center mx-8 gap-3 opacity-60 hover:opacity-100 transition-opacity cursor-crosshair">
                <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest border border-neutral-800 px-1 rounded-sm">
                    {p.id}
                </span>
                <span className="font-sans text-xs font-bold tracking-tight text-white">
                    {p.name}
                </span>
                <span className={`text-[9px] font-mono ${p.status === 'DEPLOYED' || p.status === 'LIVE' ? 'text-green-500' : 'text-neutral-500'}`}>
                    • {p.status}
                </span>
                
                {/* Separator / Decoration */}
                <span className="text-neutral-800 ml-6 text-[10px]">//</span>
            </div>
        ))}
      </motion.div>
    </div>
  )
}
