'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, Float, PerspectiveCamera, Center } from '@react-three/drei'
import { useRef, useEffect, Suspense } from 'react'
import * as THREE from 'three'
import { MotionValue } from 'framer-motion'

function Model({ mouseX, mouseY }: { mouseX: MotionValue<number>, mouseY: MotionValue<number> }) {
  const { scene } = useGLTF('/bg_model.glb')
  const groupRef = useRef<THREE.Group>(null)
  
  // Apply wireframe material to everything
  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh
        mesh.material = new THREE.MeshBasicMaterial({
          color: '#ffffff',
          wireframe: true,
          transparent: true,
          opacity: 0.02, 
          side: THREE.DoubleSide
        })
      }
    })
  }, [scene])

  useFrame(() => {
    if (!groupRef.current) return
    
    // Constant slow rotation
    groupRef.current.rotation.y += 0.002

    // Mouse tilt (reading raw values for performance)
    const x = (mouseX.get() * 2) - 1 
    const y = (mouseY.get() * 2) - 1
    
    // Smooth tilt
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -y * 0.2, 0.05)
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, -x * 0.1, 0.05)
  })

  // Use Center to ensure the model rotates around its visual center
  return (
    <Center ref={groupRef}>
        <primitive object={scene} scale={1} />
    </Center>
  )
}

function Fallback() {
   const meshRef = useRef<THREE.Mesh>(null)
   useFrame(() => {
       if (meshRef.current) {
           meshRef.current.rotation.x += 0.002
           meshRef.current.rotation.y += 0.005
       }
   })
   return (
     <mesh ref={meshRef}>
         <dodecahedronGeometry args={[2.5, 0]} /> 
         <meshBasicMaterial wireframe color="#ffffff" transparent opacity={0.1} />
     </mesh>
   )
}

export default function ModelBackground({ mouseX, mouseY }: { mouseX: MotionValue<number>, mouseY: MotionValue<number> }) {
  return (
    <div className="absolute inset-0 z-0 opacity-100 pointer-events-none">
      <Canvas gl={{ alpha: true, antialias: true }} dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 15]} />
        <ambientLight intensity={0.5} />
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <Suspense fallback={<Fallback />}>
                <Model mouseX={mouseX} mouseY={mouseY} />
            </Suspense>
        </Float>
      </Canvas>
    </div>
  )
}
