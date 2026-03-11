'use client'
import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'

type ProjectRecord = {
  id: number
  project_name: string
  summary: string
  github_link: string | null
}

export default function ProjectTicker() {
  const [projects, setProjects] = useState<ProjectRecord[]>([])

  useEffect(() => {
    const loadProjects = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('id, project_name, summary, github_link')
        .order('id', { ascending: false })
        .limit(4)

      if (!error && data) {
        setProjects(data as ProjectRecord[])
      }
    }

    void loadProjects()
  }, [])

  const tickerItems = useMemo(() => [...projects, ...projects], [projects])

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
        {tickerItems.map((p, i) => (
            <div key={i} className="flex items-center mx-8 gap-3 opacity-60 hover:opacity-100 transition-opacity cursor-crosshair">
                <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest border border-neutral-800 px-1 rounded-sm">
              PRJ_{p.id}
                </span>
                <span className="font-sans text-xs font-bold tracking-tight text-white">
              {p.project_name.toUpperCase()}
                </span>
            <span className={`text-[9px] font-mono ${p.github_link ? 'text-green-500' : 'text-neutral-500'}`}>
              • {p.github_link ? 'REPO' : 'INTERNAL'}
                </span>
                
                {/* Separator / Decoration */}
                <span className="text-neutral-800 ml-6 text-[10px]">//</span>
            </div>
        ))}
      </motion.div>
    </div>
  )
}
