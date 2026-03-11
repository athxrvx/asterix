'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

const sectionLinks = [
  { label: 'Top', href: '#top' },
  { label: 'Vision', href: '#vision' },
  { label: 'Work', href: '#projects' },
  { label: 'Logs', href: '#logs' },
  { label: 'Events', href: '#events' },
  { label: 'Join', href: '#register' },
]

const pageLinks = [
  { label: 'Blog', href: '/blog' },
  { label: 'All Events', href: '/events' },
  { label: 'Projects', href: '/projects' },
  { label: 'Register', href: '/register' },
]

export default function FloatingNav() {
  const [isHidden, setIsHidden] = useState(false)
  const lastY = useRef(0)
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const resetIdleTimer = () => {
      if (idleTimer.current) {
        clearTimeout(idleTimer.current)
      }

      idleTimer.current = setTimeout(() => {
        setIsHidden(false)
      }, 3000)
    }

    const onScroll = () => {
      const currentY = window.scrollY
      const delta = currentY - lastY.current

      if (currentY < 120) {
        setIsHidden(false)
      } else if (delta > 6) {
        setIsHidden(true)
      } else if (delta < -6) {
        setIsHidden(false)
      }

      lastY.current = currentY
      resetIdleTimer()
    }

    lastY.current = window.scrollY
    resetIdleTimer()
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
      if (idleTimer.current) {
        clearTimeout(idleTimer.current)
      }
    }
  }, [])

  return (
    <nav
      className={`fixed bottom-4 left-1/2 z-[60] -translate-x-1/2 w-[min(92vw,760px)] transition-transform duration-300 ${
        isHidden ? 'translate-y-24' : 'translate-y-0'
      }`}
    >
      <div className="rounded-full border border-white/10 bg-black/35 px-2.5 py-1.5 backdrop-blur-sm shadow-[0_8px_24px_rgba(0,0,0,0.25)]">
        <div className="flex flex-wrap items-center justify-center gap-1.5">
          {sectionLinks.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="font-mono text-[10px] tracking-[0.18em] uppercase border border-transparent px-2 py-1 text-white/65 hover:text-white transition-colors"
            >
              {item.label}
            </a>
          ))}
          <span className="mx-1 h-3 w-px bg-white/20 hidden md:block" />
          {pageLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-mono text-[10px] tracking-[0.18em] uppercase border border-transparent px-2 py-1 text-cyan-100/65 hover:text-cyan-100 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}