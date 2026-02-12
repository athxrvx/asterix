'use client'

export default function Registration() {
  return (
    <section className="min-h-[80vh] flex flex-col justify-center py-24 px-6 md:px-12 bg-white text-black">
       <div className="max-w-4xl w-full mx-auto">
           <h2 className="text-6xl md:text-9xl font-sans font-bold tracking-tighter mb-12">
               JOIN THE<br/><span className="italic font-serif font-normal">COLLECTIVE</span>
           </h2>
           
           <form className="space-y-12">
               <div className="group">
                   <label className="block font-mono text-xs mb-2 text-neutral-500 group-hover:text-black transition-colors">01 / ID</label>
                   <input 
                      type="text" 
                      placeholder="NAME OR ALIAS"
                      className="w-full text-2xl md:text-4xl border-b border-neutral-300 py-4 focus:outline-none focus:border-black bg-transparent transition-colors placeholder:text-neutral-200"
                   />
               </div>
               
               <div className="group">
                   <label className="block font-mono text-xs mb-2 text-neutral-500 group-hover:text-black transition-colors">02 / CONTACT</label>
                   <input 
                      type="email" 
                      placeholder="EMAIL ADDRESS"
                      className="w-full text-2xl md:text-4xl border-b border-neutral-300 py-4 focus:outline-none focus:border-black bg-transparent transition-colors placeholder:text-neutral-200"
                   />
               </div>

               <div className="group">
                   <label className="block font-mono text-xs mb-2 text-neutral-500 group-hover:text-black transition-colors">03 / DOMAIN</label>
                   <div className="flex gap-4 mt-4">
                       {['ENGINEERING', 'DESIGN', 'RESEARCH', 'OTHER'].map((tag) => (
                           <label key={tag} className="flex items-center gap-2 cursor-pointer">
                               <input type="checkbox" className="w-4 h-4 border border-black rounded-none appearance-none checked:bg-black transition-all" />
                               <span className="font-mono text-sm">{tag}</span>
                           </label>
                       ))}
                   </div>
               </div>
               
               <button className="mt-12 px-8 py-4 bg-black text-white font-mono text-sm hover:bg-neutral-800 transition-colors w-full md:w-auto">
                   INITIALIZE_REGISTRATION
               </button>
           </form>
       </div>
    </section>
  )
}
