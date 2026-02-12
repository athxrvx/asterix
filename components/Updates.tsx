export default function Updates() {
  return (
    <section className="py-12 px-6 md:px-12 bg-neutral-950 text-neutral-400 font-mono text-xs border-t border-neutral-900">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1">
                <span className="block text-white mb-4">SYSTEM LOG</span>
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            
            <div className="col-span-3 space-y-4">
                <div className="flex gap-4">
                    <span className="text-neutral-600">[2026-02-12 14:30]</span>
                    <span>New research paper published: "Entropy in Generative Models"</span>
                </div>
                <div className="flex gap-4">
                    <span className="text-neutral-600">[2026-02-10 09:15]</span>
                    <span>Workshop slots filled for March session.</span>
                </div>
                <div className="flex gap-4">
                    <span className="text-neutral-600">[2026-02-08 18:45]</span>
                    <span>Server migration complete. System operational.</span>
                </div>
            </div>
        </div>
    </section>
  )
}
