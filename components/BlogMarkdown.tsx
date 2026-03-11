'use client'

import { useMemo, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

type BlogMarkdownProps = {
  markdown: string
  markdownUrl?: string
}

function toRawGithubUrl(url: string) {
  if (!url.includes('github.com') || !url.includes('/blob/')) return url
  return url
    .replace('https://github.com/', 'https://raw.githubusercontent.com/')
    .replace('/blob/', '/')
}

function buildMarkdownImageResolver(markdownUrl?: string) {
  if (!markdownUrl) {
    return (src: string) => src
  }

  const rawUrl = toRawGithubUrl(markdownUrl)
  const rawBaseDir = rawUrl.split('/').slice(0, -1).join('/')

  return (src: string) => {
    if (!src) return src
    if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) return src
    if (src.startsWith('/')) return src
    return `${rawBaseDir}/${src}`
  }
}

function CodeBlock({ className, children }: { className?: string; children?: React.ReactNode }) {
  const [copied, setCopied] = useState(false)
  const match = /language-(\w+)/.exec(className || '')
  const language = match?.[1] || 'text'
  const code = String(children || '').replace(/\n$/, '')

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="my-8 overflow-hidden rounded-xl bg-[#111827] ring-1 ring-black/10 shadow-[0_8px_24px_rgba(0,0,0,0.18)]">
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
        <span className="font-mono text-[10px] tracking-widest text-white/60 uppercase">{language}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="font-mono text-[10px] tracking-widest text-white/80 hover:text-white border border-white/20 px-2 py-1 rounded-md transition-colors"
        >
          {copied ? 'COPIED' : 'COPY'}
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        customStyle={{
          margin: 0,
          padding: '1rem',
          background: '#111827',
          fontSize: '0.9rem',
          lineHeight: 1.7,
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  )
}

export default function BlogMarkdown({ markdown, markdownUrl }: BlogMarkdownProps) {
  const resolveImageSrc = useMemo(() => buildMarkdownImageResolver(markdownUrl), [markdownUrl])
  const normalizedMarkdown = useMemo(() => {
    // Avoid rendering an extra top-level title if markdown also starts with an H1.
    return markdown.replace(/^\s*#\s+.*\n+/, '')
  }, [markdown])

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h2: ({ children }) => <h2 className="text-2xl md:text-3xl font-serif mt-14 mb-5 leading-tight text-[#151515]">{children}</h2>,
        h3: ({ children }) => <h3 className="text-xl md:text-2xl font-serif mt-10 mb-4 leading-tight text-[#1e1e1e]">{children}</h3>,
        p: ({ children }) => <p className="text-base md:text-lg text-black/78 leading-[1.9] my-6">{children}</p>,
        ul: ({ children }) => <ul className="list-disc list-outside pl-5 my-6 space-y-2.5 text-black/78">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal list-outside pl-5 my-6 space-y-2.5 text-black/78">{children}</ol>,
        li: ({ children }) => <li className="text-base md:text-lg leading-relaxed">{children}</li>,
        blockquote: ({ children }) => <blockquote className="my-8 border-l-2 border-cyan-700/40 pl-4 italic text-black/65">{children}</blockquote>,
        a: ({ children, href }) => (
          <a href={href} className="underline decoration-cyan-700/70 underline-offset-4 hover:text-cyan-800 transition-colors">
            {children}
          </a>
        ),
        code: ({ className, children }) => {
          const isCodeBlock = Boolean(className && className.includes('language-'))
          if (isCodeBlock) {
            return <CodeBlock className={className}>{children}</CodeBlock>
          }
          return <code className="rounded bg-black/8 px-1.5 py-0.5 text-sm text-cyan-900">{children}</code>
        },
        pre: ({ children }) => <>{children}</>,
        table: ({ children }) => (
          <div className="my-10 overflow-x-auto rounded-xl border border-black/10 bg-white/70">
            <table className="min-w-full border-collapse text-left text-[15px] md:text-base text-black/80">
              {children}
            </table>
          </div>
        ),
        thead: ({ children }) => <thead className="bg-black/5">{children}</thead>,
        tbody: ({ children }) => <tbody>{children}</tbody>,
        tr: ({ children }) => <tr className="border-b border-black/10 last:border-b-0">{children}</tr>,
        th: ({ children }) => (
          <th className="px-4 py-3 font-mono text-xs md:text-sm tracking-wider uppercase text-black/70 font-semibold">
            {children}
          </th>
        ),
        td: ({ children }) => <td className="px-4 py-3 align-top leading-relaxed">{children}</td>,
        img: ({ src, alt }) => (
          <img
            src={resolveImageSrc(typeof src === 'string' ? src : '')}
            alt={alt || 'Blog image'}
            className="my-10 w-full rounded-xl object-cover shadow-[0_10px_28px_rgba(0,0,0,0.12)]"
            loading="lazy"
          />
        ),
      }}
    >
      {normalizedMarkdown}
    </ReactMarkdown>
  )
}
