import { useEffect, useState } from 'react'

export function useActiveSection(sectionIds: string[]) {
  const [activeSection, setActiveSection] = useState(sectionIds[0] ?? '')

  useEffect(() => {
    const syncFromHash = () => {
      const id = window.location.hash.slice(1)
      if (sectionIds.includes(id)) setActiveSection(id)
    }
    syncFromHash()
    window.addEventListener('hashchange', syncFromHash)

    if (!('IntersectionObserver' in window)) {
      return () => window.removeEventListener('hashchange', syncFromHash)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible?.target.id) setActiveSection(visible.target.id)
      },
      { rootMargin: '-25% 0px -55%', threshold: [0.1, 0.3, 0.6] },
    )

    sectionIds.forEach((id) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    return () => {
      observer.disconnect()
      window.removeEventListener('hashchange', syncFromHash)
    }
  }, [sectionIds])

  return activeSection
}
