"use client"

import React, { useEffect, useRef, useState } from "react"
import { Coins } from "lucide-react"

interface StreamBeam {
  progress: number
  speed: number
  targetIndex: number
}

export default function RewardFlowVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [balance, setBalance] = useState(10000)

  const handleFund = () => {
    setBalance((prev) => prev + 1000)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let width = (canvas.width = canvas.offsetWidth * window.devicePixelRatio || 540)
    let height = (canvas.height = canvas.offsetHeight * window.devicePixelRatio || 300)

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = canvas.offsetWidth * window.devicePixelRatio
      height = canvas.height = canvas.offsetHeight * window.devicePixelRatio
    }

    window.addEventListener("resize", handleResize)

    // Staggered blue light beams
    const beams: StreamBeam[] = [
      { progress: 0.0, speed: 0.0032, targetIndex: 0 },  // To Operator A
      { progress: -0.4, speed: 0.0032, targetIndex: 1 }, // To Operator B
      { progress: -0.8, speed: 0.0032, targetIndex: 2 }, // To Operator C
    ]

    // Cubic bezier evaluator
    const getBezierPoint = (p0: { x: number; y: number }, p1: { x: number; y: number }, p2: { x: number; y: number }, p3: { x: number; y: number }, t: number) => {
      const cx = 3 * (p1.x - p0.x)
      const bx = 3 * (p2.x - p1.x) - cx
      const ax = p3.x - p0.x - cx - bx

      const cy = 3 * (p1.y - p0.y)
      const by = 3 * (p2.y - p1.y) - cy
      const ay = p3.y - p0.y - cy - by

      const tSquared = t * t
      const tCubed = tSquared * t

      return {
        x: ax * tCubed + bx * tSquared + cx * t + p0.x,
        y: ay * tCubed + by * tSquared + cy * t + p0.y,
      }
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      // Exact pixel coordinates:
      // Left circle center is at (width * 0.18, height * 0.48), radius is 34px * dpr
      const sourceCircleX = width * 0.18
      const sourceCircleY = height * 0.48
      const sourceRadius = 34 * (width / 540)

      // Line originates directly from the center-right boundary of the circle
      const pSource = { x: sourceCircleX + sourceRadius, y: sourceCircleY }

      // Right destination circle centers:
      const targetCircleX = width * 0.68
      const targetRadius = 24 * (width / 540)

      const targets = [
        { x: targetCircleX - targetRadius, y: height * 0.18 }, // Operator A (Top)
        { x: targetCircleX - targetRadius, y: height * 0.48 }, // Operator B (Middle)
        { x: targetCircleX - targetRadius, y: height * 0.78 }, // Operator C (Bottom)
      ]

      // Draw clean subtle conduits
      targets.forEach((pTarget) => {
        const ctrl1 = { x: pSource.x + (pTarget.x - pSource.x) * 0.4, y: pSource.y }
        const ctrl2 = { x: pSource.x + (pTarget.x - pSource.x) * 0.6, y: pTarget.y }

        ctx.beginPath()
        ctx.moveTo(pSource.x, pSource.y)
        ctx.bezierCurveTo(ctrl1.x, ctrl1.y, ctrl2.x, ctrl2.y, pTarget.x, pTarget.y)
        ctx.strokeStyle = "rgba(255, 255, 255, 0.1)"
        ctx.lineWidth = 1.5 * window.devicePixelRatio
        ctx.stroke()

        // Target dot
        ctx.beginPath()
        ctx.arc(pTarget.x, pTarget.y, 2.5 * window.devicePixelRatio, 0, Math.PI * 2)
        ctx.fillStyle = "#3b82f6"
        ctx.fill()
      })

      // Source origin dot
      ctx.beginPath()
      ctx.arc(pSource.x, pSource.y, 3 * window.devicePixelRatio, 0, Math.PI * 2)
      ctx.fillStyle = "#3b82f6"
      ctx.fill()

      // Animate flowing blue light beams
      beams.forEach((beam) => {
        beam.progress += beam.speed
        if (beam.progress > 1.2) {
          beam.progress = -0.6
        }

        const pTarget = targets[beam.targetIndex]
        const ctrl1 = { x: pSource.x + (pTarget.x - pSource.x) * 0.4, y: pSource.y }
        const ctrl2 = { x: pSource.x + (pTarget.x - pSource.x) * 0.6, y: pTarget.y }

        const tailSteps = 16
        const tailLength = 0.16

        for (let i = 0; i < tailSteps; i++) {
          const t1 = beam.progress - (i / tailSteps) * tailLength
          const t2 = beam.progress - ((i + 1) / tailSteps) * tailLength

          if (t1 > 0 && t2 > 0 && t1 <= 1) {
            const pt1 = getBezierPoint(pSource, ctrl1, ctrl2, pTarget, t1)
            const pt2 = getBezierPoint(pSource, ctrl1, ctrl2, pTarget, t2)

            const alpha = (1 - i / tailSteps) * 0.85

            ctx.beginPath()
            ctx.moveTo(pt1.x, pt1.y)
            ctx.lineTo(pt2.x, pt2.y)
            ctx.strokeStyle = `rgba(59, 130, 246, ${alpha})`
            ctx.lineWidth = 2.5 * window.devicePixelRatio
            ctx.stroke()
          }
        }

        // Blue spark head
        if (beam.progress >= 0 && beam.progress <= 1) {
          const head = getBezierPoint(pSource, ctrl1, ctrl2, pTarget, beam.progress)
          ctx.beginPath()
          ctx.arc(head.x, head.y, 2 * window.devicePixelRatio, 0, Math.PI * 2)
          ctx.fillStyle = "#60a5fa"
          ctx.fill()
        }
      })

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div className="w-full max-w-[560px] bg-zinc-950/80 border border-white/10 rounded-3xl p-6 sm:p-7 shadow-xl backdrop-blur-md flex flex-col justify-between font-mono text-xs select-none">
      
      {/* Flow Stage */}
      <div className="relative w-full h-[270px]">
        
        {/* Canvas for connecting conduits and blue beams */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

        {/* 1. LEFT SOURCE: Reward Reserve Circle (Precisely centered at 18%, 48%) */}
        <button
          type="button"
          onClick={handleFund}
          className="absolute -translate-x-1/2 -translate-y-1/2 w-16 h-16 sm:w-[68px] sm:h-[68px] rounded-full p-1 bg-zinc-950 border border-primary/40 flex items-center justify-center cursor-pointer active:scale-95 group transition-all z-10"
          style={{ left: "18%", top: "48%" }}
          title="Click to simulate funding reserve"
        >
          <div className="w-full h-full rounded-full border border-primary/30 flex items-center justify-center bg-primary/10">
            <Coins className="w-6 h-6 sm:w-7 sm:h-7 text-primary group-hover:scale-105 transition-transform" />
          </div>
        </button>
        
        {/* Left Text: Positioned below circle without shifting its center */}
        <div 
          className="absolute -translate-x-1/2 text-center whitespace-nowrap z-10 space-y-0.5"
          style={{ left: "18%", top: "calc(48% + 42px)" }}
        >
          <span className="text-xs sm:text-sm font-semibold text-white tracking-tight block">
            Reward Reserve
          </span>
          <span className="text-[10.5px] text-zinc-400 font-mono block">
            {balance.toLocaleString()} Tokens
          </span>
        </div>

        {/* 2. RIGHT NODE A (Center at 68%, 18%) */}
        <div 
          className="absolute -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full p-0.5 bg-zinc-950 border border-primary/40 flex items-center justify-center z-10"
          style={{ left: "68%", top: "18%" }}
        >
          <div className="w-full h-full rounded-full border border-primary/25 flex items-center justify-center bg-primary/10">
            <span className="font-mono font-bold text-primary text-xs sm:text-sm">A</span>
          </div>
        </div>
        <div 
          className="absolute -translate-y-1/2 whitespace-nowrap space-y-0.5 z-10"
          style={{ left: "calc(68% + 32px)", top: "18%" }}
        >
          <div className="text-xs sm:text-sm font-medium text-white tracking-tight">
            Operator A
          </div>
          <div className="text-[10.5px] text-primary font-mono">
            45% Weight
          </div>
        </div>

        {/* 3. RIGHT NODE B (Center at 68%, 48%) */}
        <div 
          className="absolute -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full p-0.5 bg-zinc-950 border border-primary/40 flex items-center justify-center z-10"
          style={{ left: "68%", top: "48%" }}
        >
          <div className="w-full h-full rounded-full border border-primary/25 flex items-center justify-center bg-primary/10">
            <span className="font-mono font-bold text-primary text-xs sm:text-sm">B</span>
          </div>
        </div>
        <div 
          className="absolute -translate-y-1/2 whitespace-nowrap space-y-0.5 z-10"
          style={{ left: "calc(68% + 32px)", top: "48%" }}
        >
          <div className="text-xs sm:text-sm font-medium text-white tracking-tight">
            Operator B
          </div>
          <div className="text-[10.5px] text-primary font-mono">
            35% Weight
          </div>
        </div>

        {/* 4. RIGHT NODE C (Center at 68%, 78%) */}
        <div 
          className="absolute -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full p-0.5 bg-zinc-950 border border-primary/40 flex items-center justify-center z-10"
          style={{ left: "68%", top: "78%" }}
        >
          <div className="w-full h-full rounded-full border border-primary/25 flex items-center justify-center bg-primary/10">
            <span className="font-mono font-bold text-primary text-xs sm:text-sm">C</span>
          </div>
        </div>
        <div 
          className="absolute -translate-y-1/2 whitespace-nowrap space-y-0.5 z-10"
          style={{ left: "calc(68% + 32px)", top: "78%" }}
        >
          <div className="text-xs sm:text-sm font-medium text-white tracking-tight">
            Operator C
          </div>
          <div className="text-[10.5px] text-primary font-mono">
            20% Weight
          </div>
        </div>

      </div>

    </div>
  )
}
