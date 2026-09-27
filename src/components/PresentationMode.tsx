import { useEffect, useRef, useState } from 'react'
import { useContent } from '../state/ContentContext'
import { Icon } from './Icon'

interface PresentationModeProps {
  open: boolean
  onClose: () => void
}

export function PresentationMode({ open, onClose }: PresentationModeProps) {
  const { navigation } = useContent().content
  const [step, setStep] = useState(0)
  const dialogRef = useRef<HTMLDivElement>(null)
  const returnFocusRef = useRef<HTMLElement | null>(null)
  const current = navigation[step]

  useEffect(() => {
    if (!open) return
    returnFocusRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null
    setStep(0)
    document.body.classList.add('presentation-active')
    const firstSection = document.getElementById(navigation[0].id)
    firstSection?.scrollIntoView?.()
    dialogRef.current?.focus()

    const handleKeys = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key !== 'Tab' || !dialogRef.current) return

      const controls = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>('button:not([disabled])'),
      )
      const first = controls[0]
      const last = controls.at(-1)
      if (!first || !last) return

      if (event.shiftKey && (document.activeElement === first || document.activeElement === dialogRef.current)) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && (document.activeElement === last || document.activeElement === dialogRef.current)) {
        event.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', handleKeys)

    return () => {
      document.body.classList.remove('presentation-active')
      window.removeEventListener('keydown', handleKeys)
      returnFocusRef.current?.focus()
    }
  }, [open, onClose])

  if (!open) return null

  const goTo = (nextStep: number) => {
    const bounded = Math.max(0, Math.min(navigation.length - 1, nextStep))
    setStep(bounded)
    document.getElementById(navigation[bounded].id)?.scrollIntoView?.({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'auto'
        : 'smooth',
    })
  }

  return (
    <div
      ref={dialogRef}
      className="presentation-dock"
      role="dialog"
      aria-modal="true"
      aria-label="Presentation mode"
      tabIndex={-1}
    >
      <div className="presentation-progress" aria-hidden="true">
        <span style={{ width: `${((step + 1) / navigation.length) * 100}%` }} />
      </div>
      <div className="presentation-copy">
        <span>
          {String(step + 1).padStart(2, '0')} / {String(navigation.length).padStart(2, '0')}
        </span>
        <strong>{current.cue}</strong>
      </div>
      <div className="presentation-controls">
        <button
          type="button"
          onClick={() => goTo(step - 1)}
          disabled={step === 0}
          aria-label="Previous section"
        >
          <Icon name="arrow" />
        </button>
        <button
          type="button"
          onClick={() => goTo(step + 1)}
          disabled={step === navigation.length - 1}
          aria-label="Next section"
        >
          <Icon name="arrow" />
        </button>
        <button type="button" onClick={onClose} aria-label="Exit presentation">
          <Icon name="x" />
        </button>
      </div>
    </div>
  )
}
