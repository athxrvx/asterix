import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { articles as fallbackArticles } from '@/lib/data'
import { fetchMarkdownFromUrl, getBlogBySlug } from '@/lib/content'
import BlogMarkdown from '@/components/BlogMarkdown'

type BlogPostPageProps = {
  params: Promise<{ slug: string }>
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const article = await getBlogBySlug(slug)

  if (!article) {
    notFound()
  }

  const fallbackMarkdown = fallbackArticles.find((item) => item.slug === slug)?.markdown ?? ''
  const markdownBody = article.markdownUrl
    ? await fetchMarkdownFromUrl(article.markdownUrl)
    : fallbackMarkdown

  return (
    <main className="min-h-screen bg-[#f5f1e8] text-[#181818] relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-70 [background:radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.95),transparent_35%),radial-gradient(circle_at_80%_12%,rgba(229,244,245,0.65),transparent_30%)]" />

      <section className="relative z-10 px-6 md:px-12 pt-14 md:pt-20 pb-14 md:pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between font-mono text-xs tracking-[0.24em] text-black/60">
            <span>{article.type}</span>
            <Link href="/blog" className="hover:underline text-black/70">
              BACK TO ARCHIVE
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-12 items-start">
            <div className="lg:col-span-7">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif leading-[1.12] tracking-tight text-balance text-[#111111]">
                {article.title}
              </h1>

              <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-black/60">
                <span className="font-mono text-xs">{article.date}</span>
                <span className="h-1 w-1 rounded-full bg-black/30" />
                <span>{article.author}</span>
                <span className="h-1 w-1 rounded-full bg-black/30" />
                <span className="font-mono text-xs">{article.readTime}</span>
              </div>

              <p className="mt-7 text-base md:text-lg text-black/75 max-w-xl leading-relaxed">
                {article.excerpt}
              </p>
            </div>

            <div className="lg:col-span-5">
              <div className="relative h-60 md:h-72 lg:h-[22rem] overflow-hidden rounded-2xl">
                <Image
                  src={article.coverImage}
                  alt={article.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 px-6 md:px-12 pb-20 md:pb-24">
        <article className="max-w-3xl mx-auto">
          <BlogMarkdown
            markdown={markdownBody || fallbackMarkdown || 'No markdown content available for this post yet.'}
            markdownUrl={article.markdownUrl}
          />
        </article>

        <div className="max-w-3xl mx-auto mt-12 pt-7 border-t border-black/10 flex justify-between items-center">
          <Link href="/blog" className="font-mono text-xs tracking-widest hover:underline text-black/70">
            ← ALL BLOGS
          </Link>
          <Link href="/register" className="font-mono text-xs tracking-widest border border-black/20 px-4 py-2 hover:bg-black hover:text-white transition-colors">
            JOIN ASTERIX
          </Link>
        </div>
      </section>
    </main>
  )
}
