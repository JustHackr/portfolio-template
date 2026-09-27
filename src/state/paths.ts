type Container = Record<string, unknown> | unknown[]

export function getAtPath(source: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((value, key) => {
    if (value === null || typeof value !== 'object') return undefined
    return (value as Record<string, unknown>)[key]
  }, source)
}

export function setAtPath<T>(source: T, path: string, next: unknown): T {
  const [key, ...rest] = path.split('.')
  const container = (source ?? (/^\d+$/.test(key) ? [] : {})) as Container
  const current = (container as Record<string, unknown>)[key]
  const value = rest.length ? setAtPath(current, rest.join('.'), next) : next

  if (Array.isArray(container)) {
    const copy = [...container]
    copy[Number(key)] = value
    return copy as T
  }
  return { ...container, [key]: value } as T
}

const sectionNames: Record<string, string> = {
  profile: 'Profile',
  navigation: 'Navigation',
  academics: 'Subject',
  projects: 'Project',
  achievements: 'Achievement',
  journeyFields: 'Journey field',
  copy: 'Page text',
}

function humanize(key: string) {
  return key
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/^./, (letter) => letter.toUpperCase())
}

export function describePath(path: string) {
  const parts = path.split('.')
  const labels = parts.map((part, index) => {
    if (index === 0) return sectionNames[part] ?? humanize(part)
    if (/^\d+$/.test(part)) return `#${Number(part) + 1}`
    return humanize(part)
  })
  return labels.join(' › ')
}
