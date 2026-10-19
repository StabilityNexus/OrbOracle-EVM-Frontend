"use client"

import { useEffect, useRef } from "react";
import { createStructureFlowRenderer, STRUCTURE_FLOW_DEFAULTS, type StructureFlowOptions } from "./structureFlowRenderer";
import "../threeui.css";

export type StructureFlowBackgroundProps = Partial<StructureFlowOptions> & { className?: string };
export function StructureFlowBackground({ className = "", ...props }: StructureFlowBackgroundProps) {
  const hostRef = useRef<HTMLDivElement>(null); const canvasRef = useRef<HTMLCanvasElement>(null);
  const optionsRef = useRef({ ...STRUCTURE_FLOW_DEFAULTS, ...props }); optionsRef.current = { ...STRUCTURE_FLOW_DEFAULTS, ...props };
  useEffect(() => {
    const host = hostRef.current, canvas = canvasRef.current; if (!host || !canvas) return undefined;
    const renderer = createStructureFlowRenderer(canvas, () => optionsRef.current); let frame = 0, visible = true;
    const resize = () => { const bounds = host.getBoundingClientRect(); renderer.resize(bounds.width, bounds.height); renderer.render(); };
    const tick = () => { renderer.render(); frame = visible && !document.hidden ? requestAnimationFrame(tick) : 0; };
    const resizeObserver = new ResizeObserver(resize); const intersection = new IntersectionObserver(([entry]) => { visible = entry?.isIntersecting ?? true; if (visible && !frame) frame = requestAnimationFrame(tick); if (!visible && frame) cancelAnimationFrame(frame), frame = 0; });
    resizeObserver.observe(host); intersection.observe(host); resize(); frame = requestAnimationFrame(tick);
    return () => { if (frame) cancelAnimationFrame(frame); resizeObserver.disconnect(); intersection.disconnect(); renderer.dispose(); };
  }, []);
  const options = optionsRef.current;
  const mask = `linear-gradient(to bottom, transparent ${options.maskStart * 100}%, black ${options.maskSolid * 100}%, black 100%)`;
  return (
    <div 
      ref={hostRef} 
      className={`threeui-background structure-flow${className ? ` ${className}` : ""}`} 
      style={{ 
        position: 'relative', 
        width: '100%', 
        height: '100%', 
        minWidth: 0, 
        minHeight: 0, 
        overflow: 'hidden', 
        opacity: 0.8, 
        WebkitMaskImage: mask, 
        maskImage: mask, 
        background: "transparent" 
      }}
    >
      <canvas 
        ref={canvasRef} 
        style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          display: 'block', 
          width: '100%', 
          height: '100%' 
        }} 
      />
    </div>
  );
}
