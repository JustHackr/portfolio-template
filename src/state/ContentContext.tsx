import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { defaultContent, type ElementStyle, type SiteContent } from '../content'
import published from '../published-content.json'
import { setAtPath } from './paths'

export const CONTENT_STORAGE_KEY = 'portfolio-content'

interface ContentContextValue {
  content: SiteContent
  setContent: (update: (current: SiteContent) => SiteContent) => void
  setValue: (path: string, value: unknown) => void
  setStyle: (path: string, style: ElementStyle | undefined) => void
  resetContent: () => void
  importContent: (json: string) => void
  editMode: boolean
  setEditMode: (editing: boolean) => void
  selectedPath: string | null
  setSelectedPath: (path: string | null) => void
  storageFull: boolean
}

const ContentContext = createContext<ContentContextValue | null>(null)

function merge(base: SiteContent, patch: Partial<SiteContent>): SiteContent {
  const list = <K extends keyof SiteContent>(key: K) =>
    (Array.isArray(patch[key]) ? patch[key] : base[key]) as SiteContent[K]

  return {
    profile: { ...base.profile, ...patch.profile },
    navigation: list('navigation'),
    academics: list('academics'),
    projects: list('projects'),
    achievements: list('achievements'),
    journeyFields: list('journeyFields'),
    copy: { ...base.copy, ...patch.copy },
    styles: { ...patch.styles },
    accent: typeof patch.accent === 'string' ? patch.accent : base.accent,
  }
}

/** Defaults from content.ts, overridden by an exported file saved as published-content.json. */
export const baseContent = merge(defaultContent, {
  ...(published as Partial<SiteContent>),
  styles: (published as Partial<SiteContent>).styles ?? {},
})

export function parseContent(json: string): SiteContent {
  const parsed = JSON.parse(json) as Partial<SiteContent>
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    throw new Error('Content file must be a JSON object.')
  }
  return merge(baseContent, { ...parsed, styles: parsed.styles ?? baseContent.styles })
}

function loadContent(): SiteContent {
  try {
    const saved = window.localStorage.getItem(CONTENT_STORAGE_KEY)
    return saved ? parseContent(saved) : baseContent
  } catch {
    return baseContent
  }
}

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContentState] = useState<SiteContent>(loadContent)
  const [dirty, setDirty] = useState(false)
  const [editMode, setEditModeState] = useState(false)
  const [selectedPath, setSelectedPath] = useState<string | null>(null)
  const [storageFull, setStorageFull] = useState(false)

  const setContent = useCallback((update: (current: SiteContent) => SiteContent) => {
    setContentState(update)
    setDirty(true)
  }, [])

  const setValue = useCallback(
    (path: string, value: unknown) => setContent((current) => setAtPath(current, path, value)),
    [setContent],
  )

  const setStyle = useCallback(
    (path: string, style: ElementStyle | undefined) =>
      setContent((current) => {
        const styles = { ...current.styles }
        if (style && Object.values(style).some((value) => value !== undefined)) {
          styles[path] = style
        } else {
          delete styles[path]
        }
        return { ...current, styles }
      }),
    [setContent],
  )

  const setEditMode = useCallback((editing: boolean) => {
    setEditModeState(editing)
    if (!editing) setSelectedPath(null)
  }, [])

  const resetContent = useCallback(() => {
    window.localStorage.removeItem(CONTENT_STORAGE_KEY)
    setContentState(baseContent)
    setSelectedPath(null)
    setDirty(false)
  }, [])

  const importContent = useCallback((json: string) => {
    setContentState(parseContent(json))
    setDirty(true)
  }, [])

  useEffect(() => {
    if (!dirty) return
    try {
      window.localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(content))
      setStorageFull(false)
    } catch {
      setStorageFull(true)
    }
  }, [content, dirty])

  useEffect(() => {
    document.body.classList.toggle('edit-mode', editMode)
    return () => document.body.classList.remove('edit-mode')
  }, [editMode])

  useEffect(() => {
    const root = document.documentElement
    if (content.accent) {
      root.style.setProperty('--blue', content.accent)
      root.style.setProperty(
        '--blue-soft',
        `color-mix(in srgb, ${content.accent}, var(--bg) 88%)`,
      )
    } else {
      root.style.removeProperty('--blue')
      root.style.removeProperty('--blue-soft')
    }
  }, [content.accent])

  const value = useMemo(
    () => ({
      content,
      setContent,
      setValue,
      setStyle,
      resetContent,
      importContent,
      editMode,
      setEditMode,
      selectedPath,
      setSelectedPath,
      storageFull,
    }),
    [
      content,
      setContent,
      setValue,
      setStyle,
      resetContent,
      importContent,
      editMode,
      setEditMode,
      selectedPath,
      storageFull,
    ],
  )

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
}

export function useContent() {
  const context = useContext(ContentContext)
  if (!context) {
    throw new Error('useContent must be used inside ContentProvider')
  }
  return context
}
