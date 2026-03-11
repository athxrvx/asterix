import Link from 'next/link'
import Registration from '@/components/Registration'

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <section className="px-6 md:px-12 pt-10 md:pt-12">
        <div className="mx-auto max-w-6xl flex items-center justify-between border-b border-black/20 pb-4">
          <h1 className="text-sm md:text-base font-mono tracking-widest uppercase">Asterix Registration</h1>
          <Link href="/" className="font-mono text-xs hover:underline">
            Back to Home
          </Link>
        </div>
      </section>

      <Registration />
    </main>
  )
}
