import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react'
import { useContent } from '../state/ContentContext'
import { Icon } from './Icon'

interface SectionMenuProps {
  activeSection: string
}

export function SectionMenu({ activeSection }: SectionMenuProps) {
  const { navigation } = useContent().content
const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const active = navigation.find((item) => item.id === activeSection) ?? navigation[0]

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => {
      document.removeEventListener('mousedown', close)
    }
  }, [])

  useEffect(() => {
    if (!open) return
    const current =
      menuRef.current?.querySelector<HTMLButtonElement>('.is-current') ??
      menuRef.current?.querySelector<HTMLButtonElement>('[role="menuitem"]')
    current?.focus()
  }, [open])

  const handleMenuKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    const items = Array.from(
      menuRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]') ?? [],
    )
    if (!items.length) return

    if (event.key === 'Escape') {
      event.preventDefault()
      setOpen(false)
      triggerRef.current?.focus()
      return
    }

    const currentIndex = Math.max(0, items.indexOf(document.activeElement as HTMLButtonElement))
    const destinations: Record<string, number> = {
      ArrowDown: (currentIndex + 1) % items.length,
      ArrowUp: (currentIndex - 1 + items.length) % items.length,
      Home: 0,
      End: items.length - 1,
    }
    const destination = destinations[event.key]
    if (destination !== undefined) {
      event.preventDefault()
      items[destination].focus()
    }
  }

  const goTo = (id: string) => {
    setOpen(false)
    window.history.replaceState(null, '', `#${id}`)
    window.dispatchEvent(new Event('hashchange'))
    document.getElementById(id)?.scrollIntoView?.({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'auto'
        : 'smooth',
    })
  }

  return (
    <div className={`section-menu ${open ? 'is-open' : ''}`} ref={rootRef}>
      <button
        ref={triggerRef}
        className="section-menu-trigger"
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={`${open ? 'Close' : 'Open'} section menu`}
        onClick={() => setOpen((current) => !current)}
      >
        <span>
          <small>{active.cue}</small>
          {active.label}
        </span>
        <Icon name="arrow" size={15} />
      </button>
      {open && (
        <div
          ref={menuRef}
          className="section-menu-popover"
          role="menu"
          aria-label="Portfolio sections"
          onKeyDown={handleMenuKeyDown}
        >
          {navigation.map((item, index) => (
            <button
              key={item.id}
              type="button"
              role="menuitem"
              aria-label={item.label}
              className={item.id === activeSection ? 'is-current' : ''}
              onClick={() => goTo(item.id)}
            >
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{item.label}</strong>
              <small>{item.cue}</small>
              <Icon name="arrow" size={15} />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
