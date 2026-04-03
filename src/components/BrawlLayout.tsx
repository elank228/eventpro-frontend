import { useEffect, useRef, type ReactNode } from 'react'

const PARTICLE_COLORS = [
  'rgba(240,192,64,0.8)',
  'rgba(192,132,252,0.8)',
  'rgba(96,165,250,0.8)',
  'rgba(6,182,212,0.8)',
  'rgba(167,139,250,0.6)',
]

export default function BrawlLayout({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const particles: HTMLDivElement[] = []

    for (let i = 0; i < 35; i++) {
      const p = document.createElement('div')
      p.className = 'particle'
      const size = Math.random() * 4 + 1
      const color = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)]
      const duration = Math.random() * 12 + 8
      const delay = Math.random() * 10
      const left = Math.random() * 100

      p.style.cssText = `
        width: ${size}px; height: ${size}px;
        background: ${color};
        left: ${left}%;
        animation-duration: ${duration}s;
        animation-delay: ${delay}s;
        box-shadow: 0 0 ${size * 3}px ${color};
      `
      container.appendChild(p)
      particles.push(p)
    }

    return () => particles.forEach(p => p.remove())
  }, [])

  return (
    <div className="brawl-layout">
      <div className="lightning" />
      <div className="particles" ref={containerRef} />
      {children}
    </div>
  )
}
