import { useId, useState, type ReactNode } from 'react'

interface DisclosureProps {
  label: string
  summary: ReactNode
  children: ReactNode
  className?: string
  defaultOpen?: boolean
  accessibleSummary?: string
}

export function Disclosure({
  label,
  summary,
  children,
  className = '',
  defaultOpen = false,
  accessibleSummary,
}: DisclosureProps) {
  const [open, setOpen] = useState(defaultOpen)
  const panelId = useId()

  return (
    <div className={`disclosure ${open ? 'is-open' : ''} ${className}`}>
      <button
        className="disclosure-trigger"
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={`${open ? 'Close' : 'Open'} ${label} details${
          accessibleSummary ? ` — ${accessibleSummary}` : ''
        }`}
        onClick={() => setOpen((current) => !current)}
      >
        {summary}
      </button>
      <div
        id={panelId}
        className="disclosure-panel"
        role="region"
        aria-label={`${label} details`}
        hidden={!open}
      >
        <div className="disclosure-panel-inner">{children}</div>
      </div>
    </div>
  )
}
