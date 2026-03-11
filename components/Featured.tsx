'use client'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

type ProjectRecord = {
  id: number
  project_name: string
  summary: string
  github_link: string | null
}

export default function Featured() {
  const targetRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: targetRef })
  const [projects, setProjects] = useState<ProjectRecord[]>([])
  const [loading, setLoading] = useState(true)
  
  const x = useTransform(scrollYProgress, [0, 1], ["1%", "-75%"])

  useEffect(() => {
    const loadProjects = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('projects')
        .select('id, project_name, summary, github_link')
        .order('id', { ascending: false })
        .limit(4)

      if (!error && data) {
        setProjects(data as ProjectRecord[])
      }
      setLoading(false)
    }

    void loadProjects()
  }, [])

  return (
    <section ref={targetRef} className="relative h-[300vh] bg-neutral-900 border-t border-white/10">
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <div className="absolute top-12 left-6 md:left-12 z-10 mix-blend-difference">
             <h3 className="text-white font-mono text-sm tracking-widest uppercase border-b border-white pb-2 inline-block">Our Member&apos;s Projects</h3>
        </div>
        
        <motion.div style={{ x }} className="flex gap-10 pl-[10vw]">
          {!loading && projects.map((project) => (
            <div key={project.id} className="group relative w-[80vw] md:w-[40vw] h-[60vh] flex-shrink-0 bg-black/40 border border-white/10 p-8 flex flex-col justify-between transition-colors hover:bg-neutral-800/60">
              <div className="font-mono text-xs opacity-50 flex justify-between">
                <span>PROJECT_{project.id}</span>
                <span>{project.github_link ? 'GITHUB' : 'INTERNAL'}</span>
              </div>
              
              <div className="space-y-4">
                  <h4 className="text-4xl md:text-6xl font-sans font-bold text-white group-hover:italic transition-all duration-300 uppercase tracking-tighter">{project.project_name}</h4>
                  <p className="font-mono text-sm text-neutral-400 border-l border-white/20 pl-4 line-clamp-3">{project.summary}</p>
              </div>

               <div className="relative w-full h-1/2 border-t border-white/10 mt-8 pt-4 flex items-end">
                  {project.github_link ? (
                    <a
                      href={project.github_link}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-2 border border-white/25 px-4 py-2 font-mono text-xs tracking-widest hover:bg-white hover:text-black transition-colors"
                    >
                      OPEN REPO
                      <span aria-hidden="true">↗</span>
                    </a>
                  ) : (
                    <span className="font-mono text-xs text-neutral-500">Repository not public</span>
                  )}
               </div>
            </div>
          ))}

          {!loading && (
            <Link
              href="/projects"
              className="group relative w-[80vw] md:w-[40vw] h-[60vh] flex-shrink-0 bg-black/30 border border-dashed border-white/20 p-8 flex flex-col justify-between transition-colors hover:bg-neutral-800/50"
            >
              <div className="font-mono text-xs opacity-60">PROJECTS ARCHIVE</div>
              <div>
                <h4 className="text-3xl md:text-5xl font-sans font-bold text-white tracking-tight">MORE PROJECTS</h4>
                <p className="mt-4 font-mono text-sm text-neutral-400">Browse all projects with summaries and repository links.</p>
              </div>
              <div className="inline-flex w-fit items-center gap-2 border border-white/30 px-4 py-2 font-mono text-xs tracking-widest group-hover:bg-white group-hover:text-black transition-colors">
                OPEN
                <span aria-hidden="true">→</span>
              </div>
            </Link>
          )}
        </motion.div>
      </div>
    </section>
  )
}
