import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { cn } from '../../lib/utils'

interface ShaderAnimationProps {
  className?: string
  /** 0–1 overall intensity */
  intensity?: number
  paused?: boolean
}

/**
 * WebGL line-field shader (from 21st.dev prompt). PRISM-tinted violet/amber.
 */
export function ShaderAnimation({ className, intensity = 1, paused = false }: ShaderAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<{
    renderer: THREE.WebGLRenderer
    uniforms: { time: { value: number }; resolution: { value: THREE.Vector2 } }
    animationId: number
    geometry: THREE.PlaneGeometry
    material: THREE.ShaderMaterial
  } | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const vertexShader = `
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `

    const fragmentShader = `
      #define TWO_PI 6.2831853072
      precision highp float;
      uniform vec2 resolution;
      uniform float time;
      uniform float intensity;

      void main(void) {
        vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
        float t = time * 0.05;
        float lineWidth = 0.0018 * intensity;
        vec3 color = vec3(0.0);
        for(int j = 0; j < 3; j++){
          for(int i = 0; i < 5; i++){
            color[j] += lineWidth * float(i * i) / abs(
              fract(t - 0.01 * float(j) + float(i) * 0.01) * 5.0
              - length(uv) + mod(uv.x + uv.y, 0.2)
            );
          }
        }
        vec3 prism = vec3(color.r * 0.55 + color.g * 0.15, color.g * 0.2 + color.b * 0.35, color.b * 0.85 + color.r * 0.25);
        gl_FragColor = vec4(prism, 1.0);
      }
    `

    const uniforms = {
      time: { value: 1.0 },
      resolution: { value: new THREE.Vector2() },
      intensity: { value: intensity },
    }

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
    })

    const geometry = new THREE.PlaneGeometry(2, 2)
    const mesh = new THREE.Mesh(geometry, material)
    const scene = new THREE.Scene()
    scene.add(mesh)

    const camera = new THREE.Camera()
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.domElement.style.display = 'block'
    container.appendChild(renderer.domElement)

    const onResize = () => {
      const w = container.clientWidth
      const h = container.clientHeight
      if (w === 0 || h === 0) return
      renderer.setSize(w, h)
      uniforms.resolution.value.set(renderer.domElement.width, renderer.domElement.height)
    }

    onResize()
    window.addEventListener('resize', onResize)

    let animationId = 0
    const animate = () => {
      animationId = requestAnimationFrame(animate)
      if (!paused) uniforms.time.value += 0.05
      uniforms.intensity.value = intensity
      renderer.render(scene, camera)
      if (sceneRef.current) sceneRef.current.animationId = animationId
    }
    animate()

    sceneRef.current = { renderer, uniforms, animationId, geometry, material }

    return () => {
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(animationId)
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement)
      renderer.dispose()
      geometry.dispose()
      material.dispose()
      sceneRef.current = null
    }
  }, [intensity, paused])

  return (
    <div
      ref={containerRef}
      className={cn('h-full w-full overflow-hidden', className)}
      aria-hidden
    />
  )
}
