'use client'

import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const VERTEX_SHADER = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const FRAGMENT_SHADER = `
uniform sampler2D uTexture;
uniform vec2 uMouse;
uniform vec2 uResolution;
uniform float uTime;
uniform float uRadius;
uniform float uStrength;

varying vec2 vUv;

void main() {
  vec2 cell = vec2(10.0) / uResolution;
  vec2 quantizedUv = floor(vUv / cell) * cell + (cell * 0.5);

  float dist = distance(quantizedUv, uMouse);
  float influence = smoothstep(uRadius, 0.0, dist);

  vec2 dir = normalize(quantizedUv - uMouse + 0.00001);
  float jitter = sin((quantizedUv.y + uTime * 0.2) * 110.0) * 0.25;
  vec2 displacement = dir * influence * uStrength * (cell * (10.0 + jitter));

  vec2 displacedUv = clamp(quantizedUv + displacement, 0.0, 1.0);
  vec4 tex = texture2D(uTexture, displacedUv);

  if (tex.a < 0.04) {
    discard;
  }

  gl_FragColor = vec4(vec3(1.0), tex.a);
}
`

type TextTextureResult = {
  texture: THREE.CanvasTexture
  width: number
  height: number
}

function createTextTexture(width: number, height: number): TextTextureResult {
  const measureCanvas = document.createElement('canvas')
  const measureCtx = measureCanvas.getContext('2d')

  const dprWidth = Math.max(1024, width)
  const dprHeight = Math.max(320, Math.floor(height * 0.42))

  let canvasWidth = dprWidth
  let canvasHeight = dprHeight

  if (measureCtx) {
    const roughFontSize = Math.min(dprWidth * 0.24, dprHeight * 0.84)
    measureCtx.font = `700 ${roughFontSize}px "Nippo", "Arial Black", "Space Grotesk", sans-serif`
    const textMetrics = measureCtx.measureText('ASTERIX')
    const measuredWidth = Math.ceil(textMetrics.width)
    const horizontalPadding = Math.ceil(roughFontSize * 0.45)
    const verticalPadding = Math.ceil(roughFontSize * 0.42)

    canvasWidth = Math.max(dprWidth, measuredWidth + horizontalPadding * 2)
    canvasHeight = Math.max(dprHeight, Math.ceil(roughFontSize + verticalPadding * 2))
  }

  const canvas = document.createElement('canvas')
  canvas.width = canvasWidth
  canvas.height = canvasHeight

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    const fallbackTexture = new THREE.CanvasTexture(canvas)
    return { texture: fallbackTexture, width: canvas.width, height: canvas.height }
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = '#000000'

  const fontSize = Math.min(canvas.height * 0.82, canvas.width * 0.2)
  ctx.font = `700 ${fontSize}px "Nippo", "Arial Black", "Space Grotesk", sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('ASTERIX', canvas.width / 2, canvas.height / 2)

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  texture.minFilter = THREE.LinearFilter
  texture.magFilter = THREE.NearestFilter

  return { texture, width: canvas.width, height: canvas.height }
}

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null)
  const webglCanvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const canvas = webglCanvasRef.current
    if (!container || !canvas) return

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10)
    camera.position.z = 1

    const uniforms = {
      uTexture: { value: null as THREE.Texture | null },
      uMouse: { value: new THREE.Vector2(-5, -5) },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uTime: { value: 0 },
      uRadius: { value: 0.2 },
      uStrength: { value: 0.95 },
    }

    const geometry = new THREE.PlaneGeometry(1, 1, 1, 1)
    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      transparent: true,
    })

    const textPlane = new THREE.Mesh(geometry, material)
    scene.add(textPlane)

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    })

    const targetMouse = new THREE.Vector2(-5, -5)
    const smoothMouse = new THREE.Vector2(-5, -5)
    const clock = new THREE.Clock()

    let activeTexture: THREE.Texture | null = null
    let rafId = 0

    const ensureNippoLoaded = async () => {
      if (typeof document === 'undefined' || !('fonts' in document)) return
      const fontFaceSet = document.fonts
      if (fontFaceSet.check('700 64px "Nippo"')) return

      try {
        await Promise.race([
          fontFaceSet.load('700 64px "Nippo"'),
          new Promise((resolve) => setTimeout(resolve, 1500)),
        ])
      } catch {
        // Keep fallback behavior if remote font load fails.
      }
    }

    const resizeScene = async () => {
      const width = container.clientWidth
      const height = container.clientHeight
      const dpr = Math.min(window.devicePixelRatio || 1, 2)

      renderer.setPixelRatio(dpr)
      renderer.setSize(width, height, false)
      renderer.setClearColor(0x000000, 1)

      camera.left = -width / height
      camera.right = width / height
      camera.top = 1
      camera.bottom = -1
      camera.updateProjectionMatrix()

      uniforms.uResolution.value.set(width, height)

      await ensureNippoLoaded()
      const textTexture = createTextTexture(Math.floor(width * dpr), Math.floor(height * dpr))
      if (activeTexture) activeTexture.dispose()
      activeTexture = textTexture.texture
      uniforms.uTexture.value = activeTexture

      const viewportAspect = width / height
      const textAspect = textTexture.width / textTexture.height

      // Fit to width first to avoid clipping, then cap by max height.
      let planeWidth = viewportAspect * 1.75
      let planeHeight = planeWidth / textAspect

      if (planeHeight > 1.4) {
        planeHeight = 1.4
        planeWidth = planeHeight * textAspect
      }

      textPlane.scale.set(planeWidth, planeHeight, 1)
    }

    const onMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const x = (event.clientX - rect.left) / rect.width
      const y = 1 - (event.clientY - rect.top) / rect.height
      targetMouse.set(THREE.MathUtils.clamp(x, 0, 1), THREE.MathUtils.clamp(y, 0, 1))
    }

    const onMouseLeave = () => {
      targetMouse.set(-5, -5)
    }

    const render = () => {
      uniforms.uTime.value = clock.getElapsedTime()
      smoothMouse.lerp(targetMouse, 0.14)
      uniforms.uMouse.value.copy(smoothMouse)

      renderer.render(scene, camera)
      rafId = requestAnimationFrame(render)
    }

    void resizeScene()
    render()

    const handleResize = () => {
      void resizeScene()
    }

    window.addEventListener('resize', handleResize)
    container.addEventListener('mousemove', onMouseMove)
    container.addEventListener('mouseleave', onMouseLeave)

    return () => {
      window.removeEventListener('resize', handleResize)
      container.removeEventListener('mousemove', onMouseMove)
      container.removeEventListener('mouseleave', onMouseLeave)

      cancelAnimationFrame(rafId)

      geometry.dispose()
      material.dispose()
      if (activeTexture) activeTexture.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen w-full flex flex-col justify-between p-6 md:p-12 overflow-hidden bg-black text-white select-none border-b border-white/10"
    >
      <canvas ref={webglCanvasRef} className="absolute inset-0 z-10 w-full h-full" />

      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-20 grid grid-cols-[1fr_auto] md:grid-cols-3 items-start gap-4 md:gap-6 font-mono text-xs md:text-sm tracking-widest text-white/70 uppercase"
      >
        <div className="flex w-fit flex-col gap-1 rounded-xl border border-white/20 bg-black/35 px-3 py-2 backdrop-blur-sm">
          <span className="text-white font-bold tracking-[0.25em]">Asterix®</span>
          <span>EST. 2026</span>
          <span className="text-[11px] md:text-xs text-white/85 normal-case tracking-[0.14em] font-semibold">Department of Computer Science</span>
        </div>
        <div className="hidden md:block text-center justify-self-center self-center">
          <span className="block">Campus</span>
          <span className="block text-white whitespace-nowrap">Easwari Engineering College</span>
        </div>
        <div className="text-right flex flex-col items-end gap-1 justify-self-end">
          <span className="block">Status</span>
          <span className="flex items-center gap-2 text-green-400">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
            Operational
          </span>
        </div>
      </motion.header>

      <div className="relative z-20 flex-grow" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="relative z-20 flex flex-col md:flex-row justify-between items-end font-mono text-xs text-white/65 w-full gap-8"
      >
        <div className="flex gap-8 order-2 md:order-1">
          <span className="hover:text-white cursor-pointer transition-colors border-b border-transparent hover:border-white pb-1">[ MANIFESTO ]</span>
          <span className="hover:text-white cursor-pointer transition-colors border-b border-transparent hover:border-white pb-1">[ PROJECTS ]</span>
        </div>

        <div className="flex flex-col items-center gap-2 order-1 md:order-2 w-full md:w-auto">
          <span className="text-[10px] tracking-widest opacity-60">MOVE CURSOR ON ASTERIX</span>
          <div className="h-12 w-[1px] bg-white/30 overflow-hidden relative">
            <motion.div
              animate={{ y: ['-100%', '100%'] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              className="absolute inset-0 w-full h-1/2 bg-gradient-to-b from-transparent via-white to-transparent opacity-50"
            />
          </div>
        </div>

        <div className="text-right hidden md:block order-3">
          <p>Shader Driven</p>
          <p>GPU Pixel Displacement</p>
        </div>
      </motion.div>
    </section>
  )
}
