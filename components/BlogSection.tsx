'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type BlogPreview = {
    id: number
    slug: string
    title: string
    type: string
    date: string
    excerpt: string
}

export default function BlogSection() {
        const [latestArticles, setLatestArticles] = useState<BlogPreview[]>([])

        useEffect(() => {
            const loadBlogs = async () => {
                const { data, error } = await supabase
                    .from('blogs')
                    .select('id, slug, title, type, date, excerpt')
                    .order('id', { ascending: false })
                    .limit(3)

                if (!error && data) {
                    setLatestArticles(data as BlogPreview[])
                }
            }

            void loadBlogs()
        }, [])

  return (
    <section className="py-24 px-6 md:px-12 bg-white text-black">
       <div className="flex justify-between items-end mb-16 border-b border-black pb-4">
           <h2 className="text-5xl md:text-7xl font-sans font-bold tracking-tighter text-black">LOGS_</h2>
           <Link href="/blog" className="font-mono text-xs hidden md:block hover:underline">VIEW ALL ARCHIVES</Link>
       </div>

       <div className="grid grid-cols-12 gap-y-12 md:gap-x-12">
                            {latestArticles.map((article, i) => (
               <motion.article 
                        key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                                    className={`${i === 0 ? 'col-span-12 md:col-span-8' : 'col-span-12 md:col-span-4'} group cursor-pointer border-t border-black/10 pt-4`}
               >
                   <Link href={`/blog/${article.slug}`} className="block">
                     <div className="flex justify-between items-center mb-4 font-mono text-xs text-neutral-500">
                         <span className="border border-black px-2 py-0.5 rounded-full group-hover:bg-black group-hover:text-white transition-colors">{article.type}</span>
                         <span>{article.date}</span>
                     </div>
                     <h3 className={`${i === 0 ? 'text-4xl md:text-5xl' : 'text-2xl md:text-3xl'} font-serif font-medium leading-tight group-hover:underline decoration-1 underline-offset-4`}>
                         {article.title}
                     </h3>
                     <p className="mt-4 text-sm text-neutral-600 line-clamp-3">
                         {article.excerpt}
                     </p>
                   </Link>
               </motion.article>
           ))}
       </div>

             <div className="mt-14 flex justify-center md:justify-end">
                 <Link
                     href="/blog"
                     className="inline-flex items-center gap-2 border border-black px-5 py-2 font-mono text-xs tracking-widest uppercase hover:bg-black hover:text-white transition-colors"
                 >
                     More
                     <span aria-hidden="true">→</span>
                 </Link>
             </div>
    </section>
  )
}
