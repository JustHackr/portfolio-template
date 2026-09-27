function readAsDataUrl(file: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

/** Shrinks uploads so several pictures still fit in the browser's ~5 MB local storage. */
function hasTransparency(context: CanvasRenderingContext2D, width: number, height: number) {
  const { data } = context.getImageData(0, 0, width, height)
  for (let i = 3; i < data.length; i += 16) {
    if (data[i] < 250) return true
  }
  return false
}

export async function imageFileToDataUrl(file: File, maxSize = 1400, quality = 0.8) {
  if (typeof createImageBitmap !== 'function' || file.type === 'image/svg+xml') {
    return readAsDataUrl(file)
  }

  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  const context = canvas.getContext('2d')
  if (!context) return readAsDataUrl(file)
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()
  const keepAlpha =
    ['image/png', 'image/webp', 'image/gif'].includes(file.type) &&
    hasTransparency(context, canvas.width, canvas.height)
  return canvas.toDataURL(keepAlpha ? 'image/png' : 'image/jpeg', quality)
}
