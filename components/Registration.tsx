'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Registration() {
  const domainOptions = [
    { tag: 'DESIGN', role: 'Craft product UX, interfaces, visual systems, and brand assets.' },
    { tag: 'RESEARCH', role: 'Run experiments, evaluate models, and document technical findings.' },
    { tag: 'ENGINEER', role: 'Build full-stack AI features, integrations, and deployment workflows.' },
    { tag: 'DIGITAL', role: 'Lead content, outreach, social media, and community engagement.' },
  ]

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    domains: [] as string[]
  })
  const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'>('IDLE')

  const handleDomainChange = (domain: string) => {
    setFormData(prev => ({
      ...prev,
      domains: prev.domains.includes(domain) 
        ? prev.domains.filter(d => d !== domain)
        : [...prev.domains, domain]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email) return
    
    setStatus('LOADING')
    
    try {
      const { error } = await supabase
        .from('registrations')
        .insert([
          { 
            name: formData.name, 
            email: formData.email, 
            domains: formData.domains,
            created_at: new Date().toISOString()
          }
        ])

      if (error) throw error
      setStatus('SUCCESS')
      setFormData({ name: '', email: '', domains: [] })
    } catch (error) {
      console.error('Registration error:', error)
      setStatus('ERROR')
    }
  }

  return (
    <section className="min-h-[80vh] flex flex-col justify-center py-24 px-6 md:px-12 bg-white text-black">
       <div className="max-w-4xl w-full mx-auto">
           <h2 className="text-6xl md:text-9xl font-sans font-bold tracking-tighter mb-12">
               JOIN THE<br/><span className="italic font-serif font-normal">NETWORK</span>
           </h2>
           
           {status === 'SUCCESS' ? (
               <div className="text-center py-24 border border-black p-8">
                   <h3 className="text-4xl font-sans font-bold mb-4">TRANSMISSION RECEIVED</h3>
                   <p className="font-mono text-sm text-neutral-600">WE WILL CONTACT YOU SHORTLY.</p>
                   <button 
                     onClick={() => setStatus('IDLE')}
                     className="mt-8 px-6 py-2 border border-black text-xs font-mono hover:bg-black hover:text-white transition-colors"
                   >
                     RESET
                   </button>
               </div>
           ) : (
           <form onSubmit={handleSubmit} className="space-y-12">
               <div className="group">
                   <label className="block font-mono text-xs mb-2 text-neutral-500 group-hover:text-black transition-colors">01 / ID</label>
                   <input 
                      type="text" 
                      placeholder="NAME OR ALIAS"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                      className="w-full text-2xl md:text-4xl border-b border-neutral-300 py-4 focus:outline-none focus:border-black bg-transparent transition-colors placeholder:text-neutral-200"
                   />
               </div>
               
               <div className="group">
                   <label className="block font-mono text-xs mb-2 text-neutral-500 group-hover:text-black transition-colors">02 / CONTACT</label>
                   <input 
                      type="email" 
                      placeholder="EMAIL ADDRESS"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                      className="w-full text-2xl md:text-4xl border-b border-neutral-300 py-4 focus:outline-none focus:border-black bg-transparent transition-colors placeholder:text-neutral-200"
                   />
               </div>

               <div className="group">
                   <label className="block font-mono text-xs mb-2 text-neutral-500 group-hover:text-black transition-colors">03 / DOMAIN</label>
                   <div className="flex gap-4 mt-4 flex-wrap">
                     {domainOptions.map(({ tag }) => (
                           <label key={tag} className="flex items-center gap-2 cursor-pointer select-none">
                               <input 
                                 type="checkbox" 
                                 checked={formData.domains.includes(tag)}
                                 onChange={() => handleDomainChange(tag)}
                                 className="w-4 h-4 border border-black rounded-none appearance-none checked:bg-black transition-all" 
                               />
                               <span className={`font-mono text-sm ${formData.domains.includes(tag) ? 'underline' : ''}`}>{tag}</span>
                           </label>
                       ))}
                   </div>
               </div>
               
               <button 
                 type="submit"
                 disabled={status === 'LOADING'}
                 className="mt-12 px-8 py-4 bg-black text-white font-mono text-sm hover:bg-neutral-800 transition-colors w-full md:w-auto disabled:opacity-50"
               >
                   {status === 'LOADING' ? 'INITIALIZING...' : 'INITIALIZE_REGISTRATION'}
               </button>
               {status === 'ERROR' && (
                 <p className="font-mono text-xs text-red-500 mt-4">ERROR IN TRANSMISSION. PLEASE RETRY.</p>
               )}

               <div className="mt-14 border-t border-black/15 pt-6">
                 <h4 className="font-mono text-xs tracking-widest text-neutral-500 mb-4">DOMAIN ROLES</h4>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {domainOptions.map(({ tag, role }) => (
                     <div key={tag} className="border border-black/15 p-4">
                       <p className="font-mono text-xs tracking-wider text-black">{tag}</p>
                       <p className="mt-2 text-sm text-neutral-700 leading-relaxed">{role}</p>
                     </div>
                   ))}
                 </div>
               </div>
           </form>
           )}
       </div>
    </section>
  )
}
