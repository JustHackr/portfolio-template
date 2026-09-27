import {
  useState,
  type ClipboardEvent,
  type CSSProperties,
  type ElementType,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
} from 'react'
import type { ElementStyle } from '../content'
import { useContent } from '../state/ContentContext'
import { describePath, getAtPath } from '../state/paths'

interface EditableProps {
  path: string
  as?: ElementType
  className?: string
  id?: string
  multiline?: boolean
  prefix?: string
  suffix?: string
}

export function styleFor(style: ElementStyle | undefined): CSSProperties | undefined {
  if (!style) return undefined
  return {
    fontSize: style.scale ? `calc(1em * ${style.scale})` : undefined,
    color: style.color,
    fontWeight: style.bold ? 700 : undefined,
    fontStyle: style.italic ? 'italic' : undefined,
  }
}

function readText(element: HTMLElement) {
  const text = element.innerText ?? element.textContent ?? ''
  return text.replace(/\u00a0/g, ' ').replace(/\n{3,}/g, '\n\n').trim()
}

export function Editable({
  path,
  as: Tag = 'span',
  className = '',
  id,
  multiline = false,
  prefix = '',
  suffix = '',
}: EditableProps) {
  const { content, editMode, setValue, selectedPath, setSelectedPath } = useContent()
  const [version, setVersion] = useState(0)
  const raw = getAtPath(content, path)
  const value = typeof raw === 'string' ? raw : raw == null ? '' : String(raw)
  const style = content.styles[path]

  if (!editMode) {
    if (style?.hidden) return null
    return (
      <Tag id={id} className={className || undefined} style={styleFor(style)}>
        {prefix}
        {value}
        {suffix}
      </Tag>
    )
  }

  const commit = (element: HTMLElement) => {
    const next = readText(element)
    if (next !== value) setValue(path, next)
    setVersion((current) => current + 1)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    event.stopPropagation()
    if (event.key === 'Escape') {
      event.currentTarget.textContent = value
      event.currentTarget.blur()
    } else if (event.key === 'Enter' && !multiline) {
      event.preventDefault()
      event.currentTarget.blur()
    }
  }

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setSelectedPath(path)
  }

  const classes = [
    className,
    'is-editable',
    selectedPath === path ? 'is-selected' : '',
    style?.hidden ? 'is-hidden-element' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <>
      {prefix}
      <Tag
        key={version}
        id={id}
        className={classes}
        style={styleFor(style)}
        data-edit-path={path}
        data-edit-label={describePath(path)}
        contentEditable
        suppressContentEditableWarning
        spellCheck
        role={Tag === 'span' ? 'textbox' : undefined}
        aria-label={Tag === 'span' ? describePath(path) : undefined}
        aria-multiline={Tag === 'span' ? multiline : undefined}
        onFocus={() => setSelectedPath(path)}
        onBlur={(event: FocusEvent<HTMLElement>) => commit(event.currentTarget)}
        onKeyDown={handleKeyDown}
        onKeyUp={(event: KeyboardEvent<HTMLElement>) => event.stopPropagation()}
        onClick={handleClick}
        onPaste={(event: ClipboardEvent<HTMLElement>) => {
          event.preventDefault()
          const text = event.clipboardData.getData('text/plain')
          document.execCommand('insertText', false, multiline ? text : text.replace(/\s+/g, ' '))
        }}
      >
        {value}
      </Tag>
      {suffix}
    </>
  )
}
