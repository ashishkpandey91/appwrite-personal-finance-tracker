import { useState, useRef, useEffect, ReactNode } from "react"
import { RefreshCw } from "lucide-react"

interface PullToRefreshProps {
  onRefresh: () => Promise<void>
  children: ReactNode
  disabled?: boolean
}

export function PullToRefresh({ onRefresh, children, disabled = false }: PullToRefreshProps) {
  const [pullDistance, setPullDistance] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [startY, setStartY] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const threshold = 80
  const maxPull = 120

  const handleTouchStart = (e: TouchEvent) => {
    if (disabled || isRefreshing) return

    const touch = e.touches[0]
    setStartY(touch.clientY)
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (disabled || isRefreshing || !startY) return

    const touch = e.touches[0]
    const currentY = touch.clientY
    const diff = currentY - startY

    // Only pull down when at the top of the page
    if (window.scrollY > 0 || diff < 0) {
      setPullDistance(0)
      return
    }

    const distance = Math.min(diff * 0.5, maxPull)
    setPullDistance(distance)

    if (distance > 0) {
      e.preventDefault()
    }
  }

  const handleTouchEnd = async () => {
    if (disabled || isRefreshing) return

    if (pullDistance >= threshold) {
      setIsRefreshing(true)
      setPullDistance(60)

      try {
        await onRefresh()
      } finally {
        setIsRefreshing(false)
        setPullDistance(0)
      }
    } else {
      setPullDistance(0)
    }

    setStartY(0)
  }

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener('touchstart', handleTouchStart, { passive: true })
    container.addEventListener('touchmove', handleTouchMove, { passive: false })
    container.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchmove', handleTouchMove)
      container.removeEventListener('touchend', handleTouchEnd)
    }
  }, [startY, pullDistance, isRefreshing, disabled])

  const rotation = (pullDistance / threshold) * 360

  return (
    <div ref={containerRef} className="relative">
      {/* Pull to refresh indicator */}
      <div
        className="absolute left-0 right-0 flex justify-center transition-all duration-200 ease-out"
        style={{
          transform: `translateY(${pullDistance - 60}px)`,
          opacity: pullDistance > 20 ? 1 : 0,
        }}
      >
        <div className={`p-3 bg-white rounded-full shadow-lg ${isRefreshing ? 'animate-bounce' : ''}`}>
          <RefreshCw
            className={`h-5 w-5 text-blue-600 transition-transform ${isRefreshing ? 'animate-spin' : ''}`}
            style={{
              transform: `rotate(${rotation}deg)`,
            }}
          />
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          transform: `translateY(${pullDistance}px)`,
          transition: pullDistance === 0 ? 'transform 0.2s' : 'none',
        }}
      >
        {children}
      </div>
    </div>
  )
}