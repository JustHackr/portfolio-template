import { useEffect, useId, useState } from 'react'

interface TextFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  multiline?: boolean
  hint?: string
}

export function TextField({ label, value, onChange, multiline, hint }: TextFieldProps) {
  const id = useId()
  const hintId = `${id}-hint`

  return (
    <div className="editor-field">
      <label htmlFor={id}>{label}</label>
      {multiline ? (
        <textarea
          id={id}
          value={value}
          rows={3}
          aria-describedby={hint ? hintId : undefined}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <input
          id={id}
          type="text"
          value={value}
          aria-describedby={hint ? hintId : undefined}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
      {hint && (
        <small id={hintId} className="editor-hint">
          {hint}
        </small>
      )}
    </div>
  )
}

interface ListFieldProps {
  label: string
  value: string[] | undefined
  onChange: (value: string[]) => void
}

/** Edits a string list as one item per line, keeping blank lines while the user types. */
export function ListField({ label, value = [], onChange }: ListFieldProps) {
  const id = useId()
  const joined = value.join('\n')
  const [draft, setDraft] = useState(joined)

  useEffect(() => {
    setDraft((current) => (clean(current).join('\n') === joined ? current : joined))
  }, [joined])

  return (
    <div className="editor-field">
      <label htmlFor={id}>{label}</label>
      <textarea
        id={id}
        value={draft}
        rows={3}
        aria-describedby={`${id}-hint`}
        onChange={(event) => {
          setDraft(event.target.value)
          onChange(clean(event.target.value))
        }}
      />
      <small id={`${id}-hint`} className="editor-hint">
        One item per line.
      </small>
    </div>
  )
}

function clean(text: string) {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}
