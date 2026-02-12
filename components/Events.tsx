'use client'

const events = [
    { id: 1, date: "03.12", title: "Generative Audio Workshop", type: "WORKSHOP", seats: "FULL" },
    { id: 2, date: "04.05", title: "Cybernetics Symposium", type: "TALK", seats: "OPEN" },
    { id: 3, date: "04.22", title: "Render/Realtime Hackathon", type: "HACKATHON", seats: "OPEN" },
]

export default function Events() {
  return (
    <section className="py-24 px-6 md:px-12 bg-black text-white border-t border-white/10">
      <div className="mb-16">
          <h2 className="text-sm font-mono tracking-widest text-neutral-400 mb-2">UPCOMING EVENTS</h2>
          <div className="w-full h-px bg-white/20"></div>
      </div>

      <div className="space-y-0">
          {events.map((event) => (
              <div key={event.id} className="group relative border-b border-white/10 py-12 flex flex-col md:flex-row md:items-center justify-between transition-colors hover:bg-neutral-900 px-4 -mx-4">
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
                       <span className={`font-mono text-xs px-3 py-1 border ${event.seats === 'OPEN' ? 'border-green-500 text-green-500' : 'border-red-500 text-red-500'}`}>
                           STATUS: {event.seats}
                       </span>
                       <button className="w-10 h-10 rounded-full border border-white flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                           →
                       </button>
                  </div>
              </div>
          ))}
      </div>
    </section>
  )
}
