import Link from 'next/link'
import Image from 'next/image'
import { getAllBlogs } from '@/lib/content'

export default async function BlogPage() {
  const articles = await getAllBlogs()

  return (
    <main className="min-h-screen bg-[#f4efe7] text-[#171717] pt-24 pb-20 px-6 md:px-12 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-70 [background:radial-gradient(circle_at_10%_12%,rgba(255,255,255,0.9),transparent_35%),radial-gradient(circle_at_85%_8%,rgba(223,240,242,0.6),transparent_34%)]" />

      <div className="relative z-10 mb-14 border-b border-black/15 pb-7">
        <div className="flex justify-between items-end gap-4">
             <div>
               <p className="font-mono text-xs tracking-[0.3em] text-black/55 mb-3">ASTERIX PUBLICATION</p>
               <h1 className="text-4xl md:text-7xl font-sans font-bold tracking-tight">BLOG ARCHIVE</h1>
             </div>
             <Link href="/" className="font-mono text-xs hover:underline mb-2 text-black/70">BACK TO HOME</Link>
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7">
        {articles.map((article) => (
          <article key={article.id} className="group border border-black/10 bg-white/90 transition-colors hover:border-black/30 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
            <Link href={`/blog/${article.slug}`} className="block h-full">
              <div className="relative h-52 overflow-hidden">
                <Image
                  src={article.coverImage}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent" />
                <div className="absolute left-4 right-4 bottom-4 flex justify-between items-center font-mono text-[10px] tracking-widest text-white/90">
                  <span className="border border-white/40 px-2 py-1 rounded-full">{article.type}</span>
                  <span>{article.date}</span>
                </div>
              </div>

              <div className="p-5 md:p-6">
                <h3 className="text-2xl md:text-3xl font-serif font-medium leading-tight mb-3 text-[#111111] group-hover:text-black/80 transition-colors">
                    {article.title}
                </h3>
                <p className="text-sm text-black/70 leading-relaxed line-clamp-3">
                    {article.excerpt}
                </p>
                <div className="mt-5 pt-4 border-t border-black/10 flex justify-between items-center text-xs text-black/55 font-mono tracking-wider">
                  <span>{article.author}</span>
                  <span>{article.readTime}</span>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </main>
  )
}