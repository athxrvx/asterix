'use client'
import { motion } from 'framer-motion'
import { articles } from '@/lib/data'
import Link from 'next/link'

export default function BlogSection() {
  return (
    <section className="py-24 px-6 md:px-12 bg-white text-black min-h-screen">
       <div className="flex justify-between items-end mb-16 border-b border-black pb-4">
           <h2 className="text-5xl md:text-7xl font-sans font-bold tracking-tighter text-black">LOGS_</h2>
           <Link href="/blog" className="font-mono text-xs hidden md:block hover:underline">VIEW ALL ARCHIVES</Link>
       </div>

       <div className="grid grid-cols-12 gap-y-12 md:gap-x-12">
           {articles.slice(0, 3).map((article, i) => (
               <motion.article 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`${i === 0 ? 'col-span-12 md:col-span-8' : 'col-span-12 md:col-span-4'} group cursor-pointer border-t border-black/10 pt-4`}
               >
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
               </motion.article>
           ))}
       </div>
    </section>
  )
}
