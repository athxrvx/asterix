'use client'
import { motion, useScroll, useTransform, useMotionTemplate } from 'framer-motion'
import { useRef } from 'react'

export default function Vision() {
  const containerRef = useRef<HTMLDivElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  // Smooth transforms for parallax and reveal
  const y = useTransform(scrollYProgress, [0, 1], [100, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  
  // Dynamic letter spacing based on scroll
  const letterSpacing = useTransform(scrollYProgress, [0, 0.5, 1], ["0em", "0.05em", "0.2em"])
  
  // Background gradient shift
  const gradientPosition = useTransform(scrollYProgress, [0, 1], ["0% 50%", "100% 50%"])

  return (
    <section 
      ref={containerRef} 
      className="relative min-h-[80vh] flex flex-col items-center justify-center py-24 px-6 overflow-hidden bg-black text-white border-b border-white/10"
    >
        {/* Dynamic Background Mesh */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#333_1px,transparent_1px),linear-gradient(to_bottom,#333_1px,transparent_1px)] bg-[size:6rem_6rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_100%,transparent_100%)]"></div>
        </div>

        {/* Floating AI Elements */}
        <motion.div 
            style={{ y: useTransform(scrollYProgress, [0, 1], [0, -200]) }}
            className="absolute top-20 right-[10%] w-64 h-64 bg-purple-900/20 rounded-full blur-[100px] pointer-events-none"
        />
        <motion.div 
            style={{ y: useTransform(scrollYProgress, [0, 1], [0, 200]) }}
            className="absolute bottom-20 left-[10%] w-80 h-80 bg-blue-900/10 rounded-full blur-[120px] pointer-events-none"
        />

        <div className="relative z-10 max-w-7xl w-full flex flex-col items-center text-center gap-12 md:gap-24">
            
            {/* Top Label */}
            <motion.div 
                style={{ opacity }}
                className="font-mono text-xs md:text-sm tracking-[0.3em] text-neutral-500 uppercase flex items-center gap-4"
            >
                <div className="w-12 h-[1px] bg-neutral-700"></div>
                The Intersection
                <div className="w-12 h-[1px] bg-neutral-700"></div>
            </motion.div>

            {/* Main Visual Statement */}
            <h2 className="relative text-5xl md:text-8xl lg:text-[9rem] font-bold leading-[0.9] tracking-tighter mix-blend-screen select-none">
                <div className="overflow-hidden">
                    <motion.span 
                        initial={{ y: "100%" }}
                        whileInView={{ y: 0 }}
                        viewport={{ once: true }} // Should trigger every time or once? Let's do once for impact
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} 
                        className="block bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60"
                    >
                        ARTIFICIAL
                    </motion.span>
                </div>
                
                <div className="overflow-hidden relative z-10">
                     <motion.div 
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        transition={{ duration: 1.5, ease: "circOut", delay: 0.2 }}
                        className="absolute top-1/2 left-0 w-full h-[2px] bg-white mix-blend-difference"
                    />
                    <motion.span 
                        initial={{ y: "100%" }}
                        whileInView={{ y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                        className="block font-serif italic font-light text-white"
                         style={{ letterSpacing }}
                    >
                        INTELLIGENCE
                    </motion.span>
                </div>

                <div className="my-4 md:my-8 flex justify-center items-center gap-4 opacity-50 font-mono text-sm md:text-xl">
                    <span>×</span>
                </div>

                <div className="overflow-hidden">
                    <motion.span 
                        initial={{ y: "100%" }}
                        whileInView={{ y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                        className="block bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60"
                    >
                        HUMAN
                    </motion.span>
                </div>

                <div className="overflow-hidden">
                     <motion.span 
                        initial={{ y: "100%" }}
                        whileInView={{ y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                        className="block font-serif italic font-light text-white"
                    >
                        AMBITION
                    </motion.span>
                </div>
            </h2>

            {/* Floating Description */}
            <motion.p 
                style={{ y, opacity }}
                className="max-w-xl text-neutral-400 text-sm md:text-lg leading-relaxed font-light"
            >
                We do not see AI as a replacement, but as an <span className="text-white font-medium">extension of the self</span>. 
                A canvas where logic meets emotion, and where code becomes the medium for our wildest dreams.
            </motion.p>
            
            {/* Call to Action Indicator */}
             <motion.div 
                animate={{ y: [0, 10, 0], opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="pt-12"
            >
                <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-white to-transparent"></div>
            </motion.div>
        </div>
    </section>
  )
}