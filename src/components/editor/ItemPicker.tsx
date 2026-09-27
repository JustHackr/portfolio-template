import { useId, useState } from 'react'

interface ItemPickerProps {
  label: string
  noun: string
  titles: string[]
  selected: number
  onSelect: (index: number) => void
  onAdd: () => void
  onMove: (direction: -1 | 1) => void
  onDelete: () => void
}

export function ItemPicker({
  label,
  noun,
  titles,
  selected,
  onSelect,
  onAdd,
  onMove,
  onDelete,
}: ItemPickerProps) {
  const id = useId()
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  return (
    <div className="editor-picker">
      <div className="editor-field">
        <label htmlFor={id}>{label}</label>
        <select
          id={id}
          value={titles.length ? selected : ''}
          onChange={(event) => {
            setConfirmingDelete(false)
            onSelect(Number(event.target.value))
          }}
        >
          {titles.map((title, index) => (
            <option key={index} value={index}>
              {title || `Untitled ${noun}`}
            </option>
          ))}
        </select>
      </div>
      <div className="editor-picker-actions">
        <button type="button" className="editor-button primary" onClick={onAdd}>
          Add {noun}
        </button>
        <button
          type="button"
          className="editor-button"
          onClick={() => onMove(-1)}
          disabled={selected <= 0}
          aria-label={`Move ${noun} earlier`}
        >
          ↑
        </button>
        <button
          type="button"
          className="editor-button"
          onClick={() => onMove(1)}
          disabled={selected >= titles.length - 1}
          aria-label={`Move ${noun} later`}
        >
          ↓
        </button>
        {confirmingDelete ? (
          <button
            type="button"
            className="editor-button danger"
            onClick={() => {
              setConfirmingDelete(false)
              onDelete()
            }}
          >
            Confirm delete
          </button>
        ) : (
          <button
            type="button"
            className="editor-button"
            onClick={() => setConfirmingDelete(true)}
            disabled={!titles.length}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  )
}
