'use client'
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

const ModelBackground = dynamic(() => import('./ModelBackground'), { ssr: false })

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  // Mouse position for parallax/spotlight effects (using MotionValues for layout performance)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Smooth springs for background movement
  const springConfig = { damping: 25, stiffness: 120 }
  const springX = useSpring(mouseX, springConfig)
  const springY = useSpring(mouseY, springConfig)

  // Parallax transforms for orbs
  const orb1X = useTransform(springX, [0, 1], ['-5%', '5%'])
  const orb1Y = useTransform(springY, [0, 1], ['-5%', '5%'])
  const orb2X = useTransform(springX, [0, 1], ['5%', '-5%'])
  const orb2Y = useTransform(springY, [0, 1], ['5%', '-5%'])

  // Spotlight gradient template
  const spotlightBackground = useMotionTemplate`radial-gradient(600px at ${springX.get() * 100}% ${springY.get() * 100}%, rgba(255,255,255,0.03), transparent 80%)` // Initial value, will be updated via style binding if we use percentages directly in template or better:

  // Correct approach for template with springs:
  // We need to map the spring (0-1) to percentage strings for the gradient
  const xPct = useTransform(springX, (x) => `${x * 100}%`)
  const yPct = useTransform(springY, (y) => `${y * 100}%`)
  const spotlightStyle = useMotionTemplate`radial-gradient(600px at ${xPct} ${yPct}, rgba(255,255,255,0.03), transparent 80%)`


  // Particle System
  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return
    
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return

    const dpr = typeof window !== 'undefined' ? (window.devicePixelRatio || 1) : 1

    let animationFrameId: number
    let particles: Particle[] = []
    
    // Mouse state for particles
    let mouse = { x: -1000, y: -1000, radius: 150 * dpr }

    const handleMouseMoveParticles = (e: MouseEvent) => {
        const rect = container.getBoundingClientRect()
        mouse.x = (e.clientX - rect.left) * dpr
        mouse.y = (e.clientY - rect.top) * dpr
    }
    
    // Create particles function
    const createParticles = () => {
        particles = [];
        
        // Draw text to canvas first
        ctx.fillStyle = 'white'
        // Responsive font size relative to physical width
        const fontSize = Math.min(canvas.width * 0.15, 300 * dpr) 
        ctx.font = `400 ${fontSize}px Stardom, system-ui, sans-serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText('ASTERIX', canvas.width / 2, canvas.height / 2)
        
        // Scan for non-transparent pixels
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const data = imageData.data
        ctx.clearRect(0, 0, canvas.width, canvas.height) 
        
        // Step size based on DPR to maintain consistent particle count
        // 4 logical pixels = Balance between density and "grid" look
        const step = Math.floor(4 * dpr) 
        
        for (let y = 0; y < canvas.height; y += step) {
            // Optimization: Calculate row offset once
            const rowOffset = y * canvas.width * 4;
            for (let x = 0; x < canvas.width; x += step) {
                const index = rowOffset + (x * 4);
                if (data[index + 3] > 60) { 
                    particles.push(new Particle(x, y, canvas.width, canvas.height))
                }
            }
        }
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
        ease: number = 0.08 

        constructor(x: number, y: number, canvasWidth: number, canvasHeight: number) {
            // Start closer to final position for a cleaner assembly effect
            const spread = 100 * (typeof window !== 'undefined' ? (window.devicePixelRatio || 1) : 1);
            this.x = x + (Math.random() - 0.5) * spread;
            this.y = y + (Math.random() - 0.5) * spread;
            this.originX = x
            this.originY = y
            this.vx = (Math.random() - 0.5) * 5 
            this.vy = (Math.random() - 0.5) * 5
            this.size = 2 // Keeping size consistent
            this.color = '#ffffff'
            this.ease = 0.08 // Slightly faster ease
        }


        draw() {
            // No-op
        }

        update() {
            const dx = mouse.x - this.x
            const dy = mouse.y - this.y
            const distSq = dx * dx + dy * dy
            const radiusSq = mouse.radius * mouse.radius

            if (distSq < radiusSq) {
                const distance = Math.sqrt(distSq)
                const force = (mouse.radius - distance) / mouse.radius
                
                // Optimized: Avoid trig functions
                const dxNorm = distance > 0 ? dx / distance : 0
                const dyNorm = distance > 0 ? dy / distance : 0
                
                const pushX = dxNorm * force * 80 * dpr
                const pushY = dyNorm * force * 80 * dpr
                
                this.vx -= pushX
                this.vy -= pushY
            }

            this.vx *= this.friction
            this.vy *= this.friction
            
            this.x += (this.originX - this.x) * this.ease
            this.y += (this.originY - this.y) * this.ease

            this.x += this.vx
            this.y += this.vy
        }
    }

    const animate = () => {
        if (!ctx) return
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        
        ctx.fillStyle = '#ffffff';
        // Optimization: fillRect is sufficient for simple squares and avoids path overhead
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.update();
            ctx.fillRect(p.x, p.y, p.size, p.size);
        }
        
        animationFrameId = requestAnimationFrame(animate)
    }

    const setSize = () => {
       canvas.width = container.offsetWidth * dpr
       canvas.height = container.offsetHeight * dpr
       canvas.style.width = `${container.offsetWidth}px`
       canvas.style.height = `${container.offsetHeight}px`
       createParticles()
    }
    
    setSize()
    window.addEventListener('resize', setSize)
    container.addEventListener('mousemove', handleMouseMoveParticles)
    animate()

    return () => {
        window.removeEventListener('resize', setSize)
        container.removeEventListener('mousemove', handleMouseMoveParticles)
        cancelAnimationFrame(animationFrameId)
    }
  }, [])
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    const { left, top, width, height } = containerRef.current.getBoundingClientRect()
    const x = (e.clientX - left) / width
    const y = (e.clientY - top) / height
    mouseX.set(x)
    mouseY.set(y)
  }

  return (
    <section 
      ref={containerRef} 
      onMouseMove={handleMouseMove}
      className="relative min-h-screen w-full flex flex-col justify-between p-6 md:p-12 overflow-hidden bg-black text-white select-none border-b border-white/10"
    >
      {/* Ambient Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
         <motion.div 
            style={{ x: orb1X, y: orb1Y }}
            animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3], 
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] bg-purple-900/20 rounded-full blur-[120px]"
         />
         <motion.div 
            style={{ x: orb2X, y: orb2Y }}
            animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.2, 0.4, 0.2], 
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute -bottom-[20%] -right-[10%] w-[60vw] h-[60vw] bg-blue-900/10 rounded-full blur-[150px]"
         />
      </div>

      {/* Dynamic Background Grid */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>
      
      {/* Spotlight Effect following mouse */}
      <motion.div 
        className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-500"
        style={{
            background: spotlightStyle
        }}
      />
      
      {/* 3D Wireframe Background */}
      <ModelBackground mouseX={mouseX} mouseY={mouseY} />

      {/* Particle Canvas */}
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 z-10 w-full h-full pointer-events-none mix-blend-screen drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"
      />

      {/* Top Navigation / Status */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="relative z-10 flex justify-between items-start font-mono text-xs md:text-sm tracking-widest text-neutral-500 uppercase mix-blend-difference"
      >
        <div className="flex flex-col gap-1">
          <span className="text-white font-bold">Asterix®</span>
          <span>EST. 2026</span>
          <span>SYSTEM_V.2.0</span>
        </div>
        <div className="text-right hidden md:block">
          <span className="block">COORDINATES</span>
          <span className="block text-white">45.5017° N, 73.5673° W</span>
        </div>
        <div className="text-right flex flex-col items-end gap-1">
            <span className="block">STATUS</span>
            <span className="flex items-center gap-2 text-green-400">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></span>
                OPERATIONAL
            </span>
        </div>
      </motion.header>

      {/* Main Content - Centered */}
      <div className="relative z-20 flex flex-col items-center justify-center flex-grow perspective-1000 my-12 md:my-0">
        <div className="relative w-full flex justify-center items-center h-[40vh] md:h-[50vh]"> {/* Increased space for visual breath on Hero */}
            
            {/* Center Focus Brackets */}
            <motion.div 
                className="absolute w-[60vw] md:w-[40vw] h-[20vh] border-x border-white/20"
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{ scaleY: 1, opacity: 1 }}
                transition={{ duration: 1.5, delay: 0.5, ease: "circOut" }}
            >
                <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-white/60 -translate-x-[1px] -translate-y-[1px]" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-white/60 translate-x-[1px] -translate-y-[1px]" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-white/60 -translate-x-[1px] translate-y-[1px]" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-white/60 translate-x-[1px] translate-y-[1px]" />
            </motion.div>

            {/* Floating Decorative Elements */}
            <motion.div 
               className="absolute -top-[10vh] -right-[5vw] hidden lg:block opacity-50"
               initial={{ opacity: 0, scale: 0 }}
               animate={{ opacity: 0.5, scale: 1, y: [0, -20, 0], rotate: [0, 5, 0] }}
               transition={{ 
                   opacity: { duration: 1, delay: 1 },
                   scale: { duration: 1, delay: 1 },
                   y: { repeat: Infinity, duration: 8, ease: "easeInOut" },
                   rotate: { repeat: Infinity, duration: 8, ease: "easeInOut" }
               }}
            >

                <div className="w-48 h-48 border border-dashed border-white/20 rounded-full flex items-center justify-center animate-spin-slow">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
            </motion.div>
        </div>
      </div>

      {/* Footer / Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="relative z-10 flex flex-col md:flex-row justify-between items-end font-mono text-xs text-neutral-500 w-full gap-8"
      >
        <div className="flex gap-8 order-2 md:order-1">
           <span className="hover:text-white cursor-pointer transition-colors border-b border-transparent hover:border-white pb-1">[ MANIFESTO ]</span>
           <span className="hover:text-white cursor-pointer transition-colors border-b border-transparent hover:border-white pb-1">[ PROJECTS ]</span>
        </div>
        
        <div className="flex flex-col items-center gap-2 order-1 md:order-2 w-full md:w-auto">
            <span className="text-[10px] tracking-widest opacity-50">SCROLL TO EXPLORE</span>
            <div className="h-12 w-[1px] bg-neutral-800 overflow-hidden relative">
                <motion.div 
                    animate={{ y: ['-100%', '100%'] }}
                    transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                    className="absolute inset-0 w-full h-1/2 bg-gradient-to-b from-transparent via-white to-transparent opacity-50"
                />
            </div>
        </div>

        <div className="text-right hidden md:block order-3">
            <p>DESIGNED IN MONTREAL</p>
            <p>AVAILABLE WORLDWIDE</p>
        </div>
      </motion.div>
      
      {/* Vignette Overlay (Reduced) */}
      <div className="absolute inset-0 pointer-events-none z-20 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.6)_100%)]" />

      {/* Grain Overlay (Reduced) */}
      <div className="absolute inset-0 pointer-events-none z-30 opacity-10 mix-blend-overlay" />
    </section>
  )
}
