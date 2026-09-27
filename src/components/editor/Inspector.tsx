import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from 'react'
import { useContent } from '../../state/ContentContext'
import { describePath } from '../../state/paths'

interface Position {
  top: number
  left: number
}

function findTarget(path: string) {
  return document.querySelector<HTMLElement>(`[data-edit-path="${path}"]`)
}

export function Inspector() {
  const { content, selectedPath, setSelectedPath, setStyle } = useContent()
  const [position, setPosition] = useState<Position | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (!selectedPath) return
    const place = () => {
      const target = findTarget(selectedPath)
      const toolbar = ref.current
      if (!target || !toolbar) return setPosition(null)
      const rect = target.getBoundingClientRect()
      const width = toolbar.offsetWidth || 320
      const height = toolbar.offsetHeight || 48
      const above = rect.top - height - 10
      setPosition({
        top: above > 80 ? above : Math.min(rect.bottom + 10, window.innerHeight - height - 12),
        left: Math.max(12, Math.min(rect.left, window.innerWidth - width - 12)),
      })
    }
    place()
    window.addEventListener('scroll', place, { passive: true })
    window.addEventListener('resize', place)
    return () => {
      window.removeEventListener('scroll', place)
      window.removeEventListener('resize', place)
    }
  }, [selectedPath, content])

  useEffect(() => {
    if (!selectedPath) return
    const clear = (event: PointerEvent) => {
      const target = event.target as HTMLElement
      if (target.closest('[data-edit-path], .inspector, .editor-panel, .edit-bar')) return
      setSelectedPath(null)
    }
    document.addEventListener('pointerdown', clear)
    return () => document.removeEventListener('pointerdown', clear)
  }, [selectedPath, setSelectedPath])

  if (!selectedPath) return null

  const style = content.styles[selectedPath] ?? {}
  const scale = style.scale ?? 1
  const update = (patch: Partial<typeof style>) => setStyle(selectedPath, { ...style, ...patch })
  const keepFocus = (event: ReactMouseEvent) => {
    if (!(event.target as HTMLElement).closest('input')) event.preventDefault()
  }

  return (
    <div
      ref={ref}
      className="inspector"
      role="toolbar"
      aria-label={`Style ${describePath(selectedPath)}`}
      style={position ? { top: position.top, left: position.left } : { visibility: 'hidden' }}
      onMouseDown={keepFocus}
    >
      <span className="inspector-label">{describePath(selectedPath)}</span>
      <div className="inspector-controls">
        <button
          type="button"
          aria-label="Smaller text"
          onClick={() => update({ scale: Math.max(0.5, +(scale - 0.1).toFixed(2)) })}
        >
          A−
        </button>
        <output aria-label="Text size">{Math.round(scale * 100)}%</output>
        <button
          type="button"
          aria-label="Larger text"
          onClick={() => update({ scale: Math.min(3, +(scale + 0.1).toFixed(2)) })}
        >
          A+
        </button>
        <span className="inspector-divider" />
        <button
          type="button"
          aria-label="Bold"
          aria-pressed={!!style.bold}
          onClick={() => update({ bold: style.bold ? undefined : true })}
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          aria-label="Italic"
          aria-pressed={!!style.italic}
          onClick={() => update({ italic: style.italic ? undefined : true })}
        >
          <em>I</em>
        </button>
        <label className="inspector-color" aria-label="Text color">
          <input
            type="color"
            value={style.color ?? '#2864e8'}
            onChange={(event) => update({ color: event.target.value })}
          />
          <span style={{ background: style.color ?? 'conic-gradient(red, yellow, lime, cyan, blue, magenta, red)' }} />
        </label>
        <span className="inspector-divider" />
        <button
          type="button"
          aria-pressed={!!style.hidden}
          onClick={() => update({ hidden: style.hidden ? undefined : true })}
        >
          {style.hidden ? 'Show' : 'Hide'}
        </button>
        <button type="button" onClick={() => setStyle(selectedPath, undefined)}>
          Reset
        </button>
      </div>
    </div>
  )
}

interface EditBarProps {
  panelOpen: boolean
  onTogglePanel: () => void
  onDone: () => void
}

export function EditBar({ panelOpen, onTogglePanel, onDone }: EditBarProps) {
  const { storageFull } = useContent()

  return (
    <div className="edit-bar" role="region" aria-label="Edit mode">
      <span className="edit-bar-dot" aria-hidden="true" />
      <p>
        <strong>Editing</strong> Click any text to change it.
        {storageFull && (
          <span className="edit-bar-warning" role="alert">
            {' '}Browser storage is full. Export your content or use smaller pictures.
          </span>
        )}
      </p>
      <button type="button" className="edit-bar-button" onClick={onTogglePanel} aria-pressed={panelOpen}>
        {panelOpen ? 'Close site editor' : 'Open site editor'}
      </button>
      <button type="button" className="edit-bar-button primary" onClick={onDone}>
        Done
      </button>
    </div>
  )
}
