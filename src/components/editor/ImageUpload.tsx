import { useRef, useState } from 'react'
import { useContent } from '../../state/ContentContext'
import { imageFileToDataUrl } from '../../state/images'

interface ImageUploadProps {
  path: string
  label: string
  hasImage: boolean
  className?: string
  addText?: string
}

export function ImageUpload({ path, label, hasImage, className = '', addText = 'Add picture' }: ImageUploadProps) {
  const { editMode, setValue } = useContent()
  const inputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)

  if (!editMode) return null

  return (
    <div className={`image-upload ${className}`}>
      <button
        type="button"
        className="image-upload-button"
        onClick={() => inputRef.current?.click()}
        disabled={busy}
      >
        {busy ? 'Loading…' : hasImage ? 'Replace picture' : addText}
      </button>
      {hasImage && (
        <button
          type="button"
          className="image-upload-button subtle"
          onClick={() => setValue(path, null)}
          aria-label={`Remove picture for ${label}`}
        >
          Remove
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        aria-label={`Upload picture for ${label}`}
        onChange={async (event) => {
          const file = event.target.files?.[0]
          event.target.value = ''
          if (!file) return
          setBusy(true)
          try {
            setValue(path, await imageFileToDataUrl(file))
          } finally {
            setBusy(false)
          }
        }}
      />
    </div>
  )
}
