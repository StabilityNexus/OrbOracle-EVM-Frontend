"use client"

import { useEffect, useRef, useState } from "react"
import { Renderer, Program, Mesh, Triangle, Vec3 } from "ogl"

interface OrbNavLogoProps {
  className?: string
  size?: number
  hovered?: boolean
}

export default function OrbNavLogo({
  className = "w-7 h-7 sm:w-8 sm:h-8",
  size = 32,
  hovered = false,
}: OrbNavLogoProps) {
  const ctnDom = useRef<HTMLDivElement>(null)
  const isHoveredRef = useRef(hovered)
  const [glReady, setGlReady] = useState(false)

  // Keep ref in sync with hovered prop for the render loop
  useEffect(() => {
    isHoveredRef.current = hovered
  }, [hovered])

  useEffect(() => {
    const container = ctnDom.current
    if (!container) return

    let renderer: Renderer | null = null
    let gl: any = null

    try {
      // Create lightweight WebGL context
      renderer = new Renderer({
        alpha: true,
        premultipliedAlpha: false,
        antialias: true,
        powerPreference: "low-power",
      })
      gl = renderer.gl
      gl.clearColor(0, 0, 0, 0)
      container.appendChild(gl.canvas)
    } catch {
      // Graceful fallback if WebGL is unavailable
      return
    }

    const vert = /* glsl */ `
      precision highp float;
      attribute vec2 position;
      attribute vec2 uv;
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `

    const frag = /* glsl */ `
      precision highp float;

      uniform float iTime;
      uniform vec3 iResolution;
      uniform float hover;
      uniform float rot;
      varying vec2 vUv;

      // Sarthak's signature blue-purple palette
      const vec3 baseColor1 = vec3(0.611765, 0.262745, 0.996078); // Electric Purple #9c43fe
      const vec3 baseColor2 = vec3(0.298039, 0.760784, 0.913725); // Vibrant Cyan-Blue #4cc2e9
      const vec3 baseColor3 = vec3(0.062745, 0.078431, 0.600000); // Deep Royal Indigo #101499
      const float innerRadius = 0.58;
      const float noiseScale = 0.75;

      vec3 hash33(vec3 p3) {
        p3 = fract(p3 * vec3(0.1031, 0.11369, 0.13787));
        p3 += dot(p3, p3.yxz + 19.19);
        return -1.0 + 2.0 * fract(vec3(
          p3.x + p3.y,
          p3.x + p3.z,
          p3.y + p3.z
        ) * p3.zyx);
      }

      float snoise3(vec3 p) {
        const float K1 = 0.333333333;
        const float K2 = 0.166666667;
        vec3 i = floor(p + (p.x + p.y + p.z) * K1);
        vec3 d0 = p - (i - (i.x + i.y + i.z) * K2);
        vec3 e = step(vec3(0.0), d0 - d0.yzx);
        vec3 i1 = e * (1.0 - e.zxy);
        vec3 i2 = 1.0 - e.zxy * (1.0 - e);
        vec3 d1 = d0 - (i1 - K2);
        vec3 d2 = d0 - (i2 - K1);
        vec3 d3 = d0 - 0.5;
        vec4 h = max(0.6 - vec4(
          dot(d0, d0),
          dot(d1, d1),
          dot(d2, d2),
          dot(d3, d3)
        ), 0.0);
        vec4 n = h * h * h * h * vec4(
          dot(d0, hash33(i)),
          dot(d1, hash33(i + i1)),
          dot(d2, hash33(i + i2)),
          dot(d3, hash33(i + 1.0))
        );
        return dot(vec4(31.316), n);
      }

      vec4 extractAlpha(vec3 colorIn) {
        float a = max(max(colorIn.r, colorIn.g), colorIn.b);
        return vec4(colorIn.rgb / (a + 1e-5), a);
      }

      float light1(float intensity, float attenuation, float dist) {
        return intensity / (1.0 + dist * attenuation);
      }

      float light2(float intensity, float attenuation, float dist) {
        return intensity / (1.0 + dist * dist * attenuation);
      }

      vec4 draw(vec2 uv) {
        float ang = atan(uv.y, uv.x);
        float len = length(uv);
        float invLen = len > 0.0 ? 1.0 / len : 0.0;

        // Fluid noise deformation of the sphere outline
        float n0 = snoise3(vec3(uv * noiseScale, iTime * 0.6)) * 0.5 + 0.5;
        float r0 = mix(mix(innerRadius, 1.0, 0.42), mix(innerRadius, 1.0, 0.62), n0);
        float d0 = distance(uv, (r0 * invLen) * uv);

        float v0 = light1(1.1, 9.0, d0);
        v0 *= smoothstep(r0 * 1.06, r0, len);

        float cl = cos(ang + iTime * 2.2) * 0.5 + 0.5;

        // Orbiting specular light bead along the sphere rim
        float a = iTime * -1.2;
        vec2 pos = vec2(cos(a), sin(a)) * r0;
        float d = distance(uv, pos);
        float v1 = light2(2.0, 6.0, d);
        v1 *= light1(1.2, 45.0, d0);

        float v2 = smoothstep(1.0, mix(innerRadius, 1.0, n0 * 0.5), len);
        float v3 = smoothstep(innerRadius, mix(innerRadius, 1.0, 0.48), len);

        vec3 col = mix(baseColor1, baseColor2, cl);
        col = mix(baseColor3, col, v0);
        col = (col + v1 * (1.0 + hover * 0.5)) * v2 * v3;
        col = clamp(col, 0.0, 1.0);

        return extractAlpha(col);
      }

      void main() {
        vec2 center = iResolution.xy * 0.5;
        float minSide = min(iResolution.x, iResolution.y);
        vec2 uv = (gl_FragCoord.xy - center) / minSide * 2.15;

        float angle = rot;
        float s = sin(angle);
        float c = cos(angle);
        uv = vec2(c * uv.x - s * uv.y, s * uv.x + c * uv.y);

        // Subtle micro-swirl upon hover
        uv.x += hover * 0.04 * sin(uv.y * 12.0 + iTime * 1.5);
        uv.y += hover * 0.04 * sin(uv.x * 12.0 + iTime * 1.5);

        vec4 col = draw(uv);
        gl_FragColor = vec4(col.rgb * col.a, col.a);
      }
    `

    const geometry = new Triangle(gl)
    const program = new Program(gl, {
      vertex: vert,
      fragment: frag,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new Vec3(64, 64, 1.0) },
        hover: { value: 0 },
        rot: { value: 0 },
      },
    })

    const mesh = new Mesh(gl, { geometry, program })

    // Keep resolution compact for high performance
    const dpr = Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 2 : 2, 2.5)
    const pixelWidth = Math.round(size * dpr)
    const pixelHeight = Math.round(size * dpr)

    renderer.setSize(pixelWidth, pixelHeight)
    gl.canvas.style.width = `${size}px`
    gl.canvas.style.height = `${size}px`
    gl.canvas.style.display = "block"
    program.uniforms.iResolution.value.set(pixelWidth, pixelHeight, 1.0)

    setGlReady(true)

    let hoverVal = 0
    let currentRot = 0
    let lastTime = 0
    let rafId: number
    let isVisible = true

    // Visibility listener: pause when tab is inactive to save battery
    const handleVisibility = () => {
      isVisible = !document.hidden
    }
    document.addEventListener("visibilitychange", handleVisibility)

    const update = (t: number) => {
      rafId = requestAnimationFrame(update)
      if (!isVisible) return

      const dt = lastTime ? (t - lastTime) * 0.001 : 0.016
      lastTime = t

      const targetHover = isHoveredRef.current ? 1.0 : 0.0
      hoverVal += (targetHover - hoverVal) * 0.12

      // Smooth idle rotation + accelerated rotation on hover
      currentRot += dt * (0.35 + hoverVal * 0.7)

      program.uniforms.iTime.value = t * 0.001
      program.uniforms.hover.value = hoverVal
      program.uniforms.rot.value = currentRot

      renderer!.render({ scene: mesh })
    }

    rafId = requestAnimationFrame(update)

    return () => {
      cancelAnimationFrame(rafId)
      document.removeEventListener("visibilitychange", handleVisibility)
      try {
        if (gl?.canvas && container.contains(gl.canvas)) {
          container.removeChild(gl.canvas)
        }
        gl?.getExtension("WEBGL_lose_context")?.loseContext()
      } catch {
        // ignore cleanup error
      }
    }
  }, [size])

  return (
    <div
      ref={ctnDom}
      className={`relative flex items-center justify-center shrink-0 ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      {/* Subtle blue-purple ambient backdrop glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500/20 via-purple-600/25 to-blue-500/20 blur-md pointer-events-none -z-10 transition-opacity duration-300 group-hover:opacity-100 opacity-60" />
      {!glReady && (
        <div className="w-full h-full rounded-full border border-cyan-400/30 bg-purple-950/20 animate-pulse" />
      )}
    </div>
  )
}
