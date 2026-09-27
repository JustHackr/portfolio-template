import { useEffect, useState } from 'react'

export function useScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let frame = 0

    const update = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const distance = document.documentElement.scrollHeight - window.innerHeight
        setProgress(distance > 0 ? Math.min(1, Math.max(0, window.scrollY / distance)) : 0)
      })
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    const contentObserver =
      'ResizeObserver' in window ? new ResizeObserver(update) : undefined
    contentObserver?.observe(document.body)

    return () => {
      cancelAnimationFrame(frame)
      contentObserver?.disconnect()
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return progress
}
