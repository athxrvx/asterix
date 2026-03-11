import Link from 'next/link'
import { getEventByIdentifier } from '@/lib/content'

type EventDetailPageProps = {
  params: Promise<{ slug: string }>
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { slug } = await params
  const event = await getEventByIdentifier(slug)

  if (!event) {
    return (
      <main className="min-h-screen bg-black text-white px-6 md:px-12 pt-24 pb-16">
        <div className="max-w-3xl mx-auto border border-white/15 p-6 md:p-8">
          <p className="font-mono text-xs tracking-widest text-neutral-400">EVENT</p>
          <h1 className="mt-3 text-3xl md:text-4xl font-serif">Event not found</h1>
          <p className="mt-4 text-neutral-300 leading-relaxed">
            This event link may be outdated, or the event record may be missing usable data in the database.
          </p>
          <div className="mt-6 flex items-center gap-4">
            <Link href="/events" className="font-mono text-xs tracking-widest border border-white/30 px-4 py-2 hover:bg-white hover:text-black transition-colors">
              GO TO EVENTS
            </Link>
            <Link href="/" className="font-mono text-xs tracking-widest hover:underline">
              BACK HOME
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 md:px-12 pt-16 pb-16">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center text-xs font-mono tracking-widest text-neutral-400">
          <span>{event.type}</span>
          <Link href="/events" className="hover:underline">
            BACK TO EVENTS
          </Link>
        </div>

        <h1 className="mt-7 text-4xl md:text-6xl font-serif leading-tight">{event.title}</h1>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-white/15 p-4">
            <p className="font-mono text-[10px] tracking-widest text-neutral-400">DATE</p>
            <p className="mt-2 text-lg">{event.date}</p>
          </div>
          <div className="border border-white/15 p-4">
            <p className="font-mono text-[10px] tracking-widest text-neutral-400">TIME</p>
            <p className="mt-2 text-lg">{event.time}</p>
          </div>
          <div className="border border-white/15 p-4">
            <p className="font-mono text-[10px] tracking-widest text-neutral-400">VENUE</p>
            <p className="mt-2 text-lg">{event.venue}</p>
          </div>
        </div>

        <div className="mt-6 border border-white/15 p-5 md:p-6">
          <p className="text-base md:text-lg text-neutral-200 leading-relaxed">{event.summary}</p>

          <ul className="mt-5 space-y-3">
            {event.details.map((detail) => (
              <li key={detail} className="text-sm md:text-base text-neutral-300 flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-cyan-300" aria-hidden="true" />
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/15 pt-6">
          <span className={`font-mono text-xs px-3 py-1 border ${event.seats === 'OPEN' || event.seats === 'LIMITED' ? 'border-green-500 text-green-500' : 'border-red-500 text-red-500'}`}>
            STATUS: {event.seats}
          </span>

          <a
            href={event.registerUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 border border-white px-5 py-2 font-mono text-xs tracking-widest uppercase hover:bg-white hover:text-black transition-colors"
          >
            Register
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </main>
  )
}
