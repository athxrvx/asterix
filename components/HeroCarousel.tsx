'use client'
import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { projects } from '@/lib/data'

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Carousel Autoplay
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % projects.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  // Particle System
  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return
    
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return

    let animationFrameId: number
    let particles: Particle[] = []
    let mouse = { x: -1000, y: -1000, radius: 100 }

    const setSize = () => {
       canvas.width = container.offsetWidth
       canvas.height = container.offsetHeight
       initParticles() // Re-init on resize
    }

    class Particle {
        x: number
        y: number
        originX: number
        originY: number
        vx: number
        vy: number
        size: number
        color: string
        friction: number = 0.95
        ease: number = 0.05 // reduced ease to reduce springiness (was 0.15) for smoke-like effect

        constructor(x: number, y: number) {
            this.x = x
            this.y = y
            this.originX = x
            this.originY = y
            this.vx = 0
            this.vy = 0
            this.size = Math.random() * 2 + 1
            this.color = '#ffffff'
        }

        draw() {
            if (!ctx) return
            ctx.fillStyle = this.color
            ctx.fillRect(this.x, this.y, this.size, this.size)
        }

        update() {
            // Distance from mouse
            const dx = mouse.x - this.x
            const dy = mouse.y - this.y
            const distance = Math.sqrt(dx * dx + dy * dy)
            const force = (mouse.radius - distance) / mouse.radius

            if (distance < mouse.radius) {
                const angle = Math.atan2(dy, dx)
                const pushX = Math.cos(angle) * force * 30 // Force magnitude
                const pushY = Math.sin(angle) * force * 30
                
                this.vx -= pushX
                this.vy -= pushY
            }

            // Friction (decay velocity from mouse interaction)
            this.vx *= this.friction
            this.vy *= this.friction

            // Apply velocity to position
            this.x += this.vx
            this.y += this.vy

            // Linear interpolation back to origin (removes springiness/oscillation)
            this.x += (this.originX - this.x) * this.ease
            this.y += (this.originY - this.y) * this.ease
        }
    }

    const initParticles = () => {
        if (!ctx) return
        particles = []
        
        const text = "ASTERIX"
        // Dynamic font size based on width
        const fontSize = Math.min(canvas.width / 5, 250)
        
        ctx.fillStyle = 'white'
        ctx.font = `900 ${fontSize}px "Space Grotesk", sans-serif` // Using the font we loaded
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        
        // Draw text to offscreen area to sample
        ctx.fillText(text, canvas.width / 2, canvas.height / 2)
        
        // Sample pixels
        // Optimized: sample every 4th pixel to keep performance high
        const gap = 4
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        ctx.clearRect(0, 0, canvas.width, canvas.height) // Clear after sampling

        for (let y = 0; y < canvas.height; y += gap) {
            for (let x = 0; x < canvas.width; x += gap) {
                const index = (y * canvas.width + x) * 4
                const alpha = imageData.data[index + 3] // Alpha channel
                
                if (alpha > 128) { // If pixel is visible
                    particles.push(new Particle(x, y))
                }
            }
        }
    }

    const animate = () => {
        if (!ctx) return
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        
        for (let i = 0; i < particles.length; i++) {
            particles[i].update()
            particles[i].draw()
        }
        
        animationFrameId = requestAnimationFrame(animate)
    }

    const handleMouseMove = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect()
        mouse.x = e.clientX - rect.left
        mouse.y = e.clientY - rect.top
    }
    
    // Init
    setSize()
    window.addEventListener('resize', setSize)
    window.addEventListener('mousemove', handleMouseMove)
    animate()

    return () => {
        window.removeEventListener('resize', setSize)
        window.removeEventListener('mousemove', handleMouseMove)
        cancelAnimationFrame(animationFrameId)
    }
  }, []) // Empty deps = run once on mount

  return (
    <section ref={containerRef} className="relative h-screen w-full overflow-hidden bg-black text-white">
      
      {/* Background Carousel */}
      <div className="absolute inset-0 z-0">
         <AnimatePresence mode="popLayout" initial={false}>
            <motion.div 
               key={current}
               initial={{ x: "100%", opacity: 0 }}
               animate={{ x: 0, opacity: 1 }}
               exit={{ x: "-20%", opacity: 0 }}
               transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
               className="absolute inset-0 w-full h-full"
            >
                {/* Fallback pattern if image fails or isn't real */}
                <div 
                    className="w-full h-full bg-cover bg-center grayscale contrast-125"
                    style={{ backgroundImage: `url(${projects[current].image})` }}
                >
                    {/* Overlay pattern for "technical" feel - REMOVED SHADOW GRADIENT */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-40 mix-blend-overlay"></div>
                    {/* Gradient removed as per request */}
                    
                    {/* Project info positioned absolute */}
                    <div className="absolute bottom-12 left-6 md:left-12 mix-blend-difference">
                        <motion.div 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-left text-white"
                         >
                            <span className="block font-mono text-xs opacity-70 mb-2">PROJECT_{projects[current].id} // CURRENTLY VIEWING</span>
                            <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter">{projects[current].title}</h2>
                            <p className="font-mono text-sm border-l-2 border-white pl-3 opacity-90 mt-2">{projects[current].category}</p>
                         </motion.div>
                    </div>
                </div>
            </motion.div>
         </AnimatePresence>
      </div>

      {/* Canvas Layer - Negative Effect Interaction */}
      {/* mix-blend-difference gives the "negative" look against the background */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full z-20 pointer-events-none mix-blend-difference"
      />
      
      {/* Top Header Information - Layered on top */}
      <header className="absolute top-0 left-0 w-full z-30 flex justify-between items-start p-6 md:p-12 font-mono text-xs md:text-sm tracking-widest text-white mix-blend-difference pointer-events-none">
        <div>
          <span className="block font-bold">ASTERIX</span>
          <span className="block mt-1 opacity-70">EST. 2026</span>
        </div>
        <div className="text-right hidden md:block">
          <span className="block">COORDINATES</span>
          <span className="block mt-1 opacity-70">45.5017° N, 73.5673° W</span>
        </div>
        <div className="text-right">
            <span className="block">STATUS</span>
            <span className="flex items-center gap-2 justify-end mt-1 opacity-70">
                ONLINE <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
            </span>
        </div>
      </header>

      {/* Manual Controls */}
      <div className="absolute bottom-12 right-6 md:right-12 z-30 flex gap-4">
         <div className="flex gap-2">
            {projects.map((_, i) => (
                <button 
                  key={i} 
                  onClick={() => setCurrent(i)} 
                  className={`h-1 transition-all duration-300 ${i === current ? 'w-8 bg-white' : 'w-4 bg-white/30'}`} 
                />
            ))}
         </div>
      </div>
      
    </section>
  )
}
