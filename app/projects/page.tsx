import Link from 'next/link'
import { getAllProjects } from '@/lib/content'

export default async function ProjectsPage() {
  const projects = await getAllProjects()

  return (
    <main className="min-h-screen bg-black text-white px-6 md:px-12 pt-24 pb-20">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 border-b border-white/15 pb-6 flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs tracking-[0.28em] text-white/60">ASTERIX</p>
            <h1 className="mt-3 text-4xl md:text-6xl font-sans font-bold tracking-tight">PROJECTS</h1>
          </div>
          <Link href="/" className="font-mono text-xs tracking-widest hover:underline">
            BACK TO HOME
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="border border-white/15 p-6 md:p-8 text-neutral-300">
            <p className="font-mono text-xs tracking-widest text-white/60">NO PROJECTS FOUND</p>
            <p className="mt-3 leading-relaxed">Add rows to the projects table to display them here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project) => (
              <article key={project.id} className="border border-white/15 p-6 md:p-7 bg-black/30">
                <div className="font-mono text-xs text-white/45 tracking-widest">PROJECT_{project.id}</div>
                <h2 className="mt-3 text-2xl md:text-3xl font-serif leading-tight">{project.projectName}</h2>
                <p className="mt-4 text-sm md:text-base text-neutral-300 leading-relaxed">{project.summary}</p>
                <div className="mt-6">
                  {project.githubLink ? (
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-2 border border-white/25 px-4 py-2 font-mono text-xs tracking-widest hover:bg-white hover:text-black transition-colors"
                    >
                      OPEN REPO
                      <span aria-hidden="true">↗</span>
                    </a>
                  ) : (
                    <span className="font-mono text-xs text-neutral-500">Repository not linked</span>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
