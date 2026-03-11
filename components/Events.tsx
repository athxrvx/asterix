import Link from 'next/link'
import { getLatestEvents } from '@/lib/content'

export default async function Events() {
    const latestEvents = await getLatestEvents(3)

  return (
    <section className="py-24 px-6 md:px-12 bg-black text-white border-t border-white/10">
      <div className="mb-16 flex justify-between items-end gap-4 border-b border-white/20 pb-4">
          <h2 className="text-sm font-mono tracking-widest text-neutral-400">UPCOMING EVENTS</h2>
          <Link href="/events" className="font-mono text-xs hidden md:block hover:underline">VIEW ALL EVENTS</Link>
      </div>

      <div className="space-y-0">
          {latestEvents.map((event) => (
              <Link href={`/events/${event.id}`} key={event.id} className="group relative border-b border-white/10 py-12 flex flex-col md:flex-row md:items-center justify-between transition-colors hover:bg-neutral-900 px-4 -mx-4 block">
                  <div className="flex items-baseline gap-8">
                      <span className="text-6xl md:text-8xl font-sans font-bold text-neutral-800 group-hover:text-white transition-colors duration-500">
                          {event.date}
                      </span>
                      <div>
                          <span className="block font-mono text-xs text-accent mb-1">{event.type}</span>
                          <h3 className="text-2xl md:text-4xl font-serif italic">{event.title}</h3>
                      </div>
                  </div>
                  
                  <div className="mt-6 md:mt-0 flex items-center gap-4">
                       <span className={`font-mono text-xs px-3 py-1 border ${event.seats === 'OPEN' || event.seats === 'LIMITED' ? 'border-green-500 text-green-500' : 'border-red-500 text-red-500'}`}>
                           STATUS: {event.seats}
                       </span>
                       <span className="inline-flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase border border-white/30 px-3 py-2 group-hover:bg-white group-hover:text-black transition-colors">
                           Details
                           <span aria-hidden="true">→</span>
                       </span>
                  </div>
              </Link>
          ))}
      </div>

            <div className="mt-14 flex justify-center md:justify-end">
                <Link
                    href="/events"
                    className="inline-flex items-center gap-2 border border-white px-5 py-2 font-mono text-xs tracking-widest uppercase hover:bg-white hover:text-black transition-colors"
                >
                    More
                    <span aria-hidden="true">→</span>
                </Link>
            </div>
    </section>
  )
}
