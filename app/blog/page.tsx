import Link from 'next/link'
import { articles } from '@/lib/data'

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-white text-black pt-32 pb-24 px-6 md:px-12">
      <div className="mb-24 border-b border-black pb-8">
        <div className="flex justify-between items-end">
             <h1 className="text-6xl md:text-9xl font-sans font-bold tracking-tighter text-black">ARCHIVE</h1>
             <Link href="/" className="font-mono text-xs hover:underline mb-2">BACK TO HOME</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {articles.map((article, i) => (
          <article key={i} className="group cursor-pointer border-t border-black/10 pt-4 hover:border-black transition-colors">
             <div className="flex justify-between items-center mb-4 font-mono text-xs text-neutral-500">
                 <span className="border border-black px-2 py-0.5 rounded-full group-hover:bg-black group-hover:text-white transition-colors">{article.type}</span>
                 <span>{article.date}</span>
             </div>
             <h3 className="text-3xl font-serif font-medium leading-tight group-hover:underline decoration-1 underline-offset-4 mb-4">
                 {article.title}
             </h3>
             <p className="text-sm text-neutral-600 line-clamp-4">
                 {article.excerpt}
             </p>
          </article>
        ))}
      </div>
    </main>
  )
}