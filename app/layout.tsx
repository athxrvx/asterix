import type { Metadata } from 'next'
import { Space_Grotesk, EB_Garamond } from 'next/font/google'
import './globals.css'
import SmoothScroll from '@/components/SmoothScroll'

const sans = Space_Grotesk({ 
  subsets: ['latin'], 
  variable: '--font-sans',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

const serif = EB_Garamond({ 
  subsets: ['latin'], 
  variable: '--font-serif',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'ASTERIX | AI CLUB',
  description: 'Technical + Creative AI Club. Precision x Chaos.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable} bg-black`}>
      <body className="bg-black text-white selection:bg-white selection:text-black antialiased overflow-x-hidden">
        <div className="noise-overlay fixed inset-0 w-full h-full pointer-events-none z-50 opacity-[0.03] mix-blend-overlay"></div>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  )
}

