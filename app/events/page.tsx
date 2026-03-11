import Link from 'next/link'
import { getAllEvents } from '@/lib/content'

export const dynamic = 'force-dynamic'

export default async function EventsPage() {
  const events = await getAllEvents()

  return (
    <main className="min-h-screen bg-black text-white pt-24 pb-16 px-6 md:px-12">
      <div className="mb-14 border-b border-white/20 pb-6">
        <div className="flex justify-between items-end">
          <h1 className="text-4xl md:text-6xl font-sans font-bold tracking-tight">EVENTS</h1>
          <Link href="/" className="font-mono text-xs hover:underline mb-2">BACK TO HOME</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-7">
        {events.map((event) => (
          <article key={event.id} className="group border border-white/10 p-5 md:p-6 flex flex-col justify-between transition-colors hover:bg-neutral-900/70 min-h-44">
            <Link href={`/events/${event.id}`} className="block h-full">
              <div className="flex items-baseline gap-4">
                <span className="text-3xl md:text-4xl font-sans font-bold text-neutral-700 group-hover:text-white transition-colors duration-500">
                  {event.date}
                </span>
                <div>
                  <span className="block font-mono text-[10px] md:text-xs text-neutral-400 mb-1">{event.type}</span>
                  <h2 className="text-lg md:text-2xl font-serif italic leading-tight">{event.title}</h2>
                </div>
              </div>

              <p className="mt-4 text-sm text-neutral-300 line-clamp-2">{event.summary}</p>

              <div className="mt-5 flex items-center justify-between">
                <span className={`font-mono text-[10px] md:text-xs px-2.5 py-1 border ${event.seats === 'OPEN' || event.seats === 'LIMITED' ? 'border-green-500 text-green-500' : 'border-red-500 text-red-500'}`}>
                  STATUS: {event.seats}
                </span>
                <span className="font-mono text-[10px] tracking-widest uppercase text-white/70 group-hover:text-white">View Details →</span>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </main>
  )
}
