import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import type { AcademicSubject, Achievement, Profile, Project, SiteContent } from '../../content'
import { useContent } from '../../state/ContentContext'
import { Icon } from '../Icon'
import { ItemPicker } from './ItemPicker'
import { ListField, TextField } from './fields'

const tabs = ['Profile', 'Academics', 'Projects', 'Achievements', 'Style', 'Data'] as const
type Tab = (typeof tabs)[number]

const accentPresets = [
  { name: 'Classic blue', value: '#2864e8' },
  { name: 'Ocean teal', value: '#0f8b8d' },
  { name: 'Forest green', value: '#39815d' },
  { name: 'Sunset amber', value: '#c2721f' },
  { name: 'Berry red', value: '#c73a55' },
  { name: 'Royal violet', value: '#7153d9' },
]

const newAchievement: Achievement = {
  year: String(new Date().getFullYear()),
  title: 'New achievement',
  result: 'Result',
  category: 'Category',
  summary: 'Describe this achievement in one or two sentences.',
  happened: 'What happened?',
  contribution: 'What did you do?',
  learned: 'What did you learn?',
  skills: [],
  stages: [],
  stats: [],
}

const newSubject: AcademicSubject = {
  id: 'subject',
  index: '',
  title: 'New subject',
  label: 'Subject type',
  project: 'Project title',
  body: 'Describe what you explored.',
  quote: 'A reflection in your own words.',
  concepts: [],
  details: [],
  developed: [],
  accent: 'blue',
}

const newProject: Project = {
  number: '',
  title: 'New project',
  category: 'Category',
  description: 'Describe the project.',
  note: 'Why does it matter to you?',
  tags: [],
  media: ['Photo placeholder'],
  accent: 'blue',
}

function moveItem<T>(items: T[], index: number, direction: -1 | 1) {
  const target = index + direction
  if (target < 0 || target >= items.length) return items
  const next = [...items]
  ;[next[index], next[target]] = [next[target], next[index]]
  return next
}

interface EditorPanelProps {
  open: boolean
  onClose: () => void
}

export function EditorPanel({ open, onClose }: EditorPanelProps) {
  const [tab, setTab] = useState<Tab>('Profile')
  const panelRef = useRef<HTMLDivElement>(null)
  const returnFocusRef = useRef<HTMLElement | null>(null)
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])

  useEffect(() => {
    if (!open) return
    returnFocusRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null
    panelRef.current?.focus()
    document.body.classList.add('editor-open')

    return () => {
      document.body.classList.remove('editor-open')
      returnFocusRef.current?.focus()
    }
  }, [open])

  if (!open) return null

  const handleTabKeys = (event: KeyboardEvent<HTMLDivElement>) => {
    const current = tabs.indexOf(tab)
    const keyMap: Record<string, number> = {
      ArrowRight: (current + 1) % tabs.length,
      ArrowLeft: (current - 1 + tabs.length) % tabs.length,
      Home: 0,
      End: tabs.length - 1,
    }
    if (!(event.key in keyMap)) return
    event.preventDefault()
    const next = keyMap[event.key]
    setTab(tabs[next])
    tabRefs.current[next]?.focus()
  }

  return (
    <div
      ref={panelRef}
      className="editor-panel"
      role="dialog"
      aria-modal="false"
      aria-labelledby="editor-title"
      tabIndex={-1}
      onKeyDown={(event) => {
        if (event.key === 'Escape') onClose()
      }}
    >
      <header className="editor-header">
        <div>
          <span className="eyebrow">Builder</span>
          <h2 id="editor-title">Site editor</h2>
        </div>
        <button
          type="button"
          className="icon-button"
          onClick={onClose}
          aria-label="Close site editor"
        >
          <Icon name="x" />
        </button>
      </header>

      <div className="editor-tabs" role="tablist" aria-label="Editor sections" onKeyDown={handleTabKeys}>
        {tabs.map((name, index) => (
          <button
            key={name}
            ref={(element) => {
              tabRefs.current[index] = element
            }}
            type="button"
            role="tab"
            id={`editor-tab-${name}`}
            aria-selected={tab === name}
            aria-controls={`editor-panel-${name}`}
            tabIndex={tab === name ? 0 : -1}
            onClick={() => setTab(name)}
          >
            {name}
          </button>
        ))}
      </div>

      <div
        className="editor-body"
        role="tabpanel"
        id={`editor-panel-${tab}`}
        aria-labelledby={`editor-tab-${tab}`}
      >
        {tab === 'Profile' && <ProfileTab />}
        {tab === 'Academics' && <AcademicsTab />}
        {tab === 'Achievements' && <AchievementsTab />}
        {tab === 'Projects' && <ProjectsTab />}
        {tab === 'Style' && <StyleTab />}
        {tab === 'Data' && <DataTab />}
      </div>
    </div>
  )
}

function ProfileTab() {
  const { content, setContent } = useContent()
  const field = (key: keyof Profile) => ({
    value: content.profile[key],
    onChange: (value: string) =>
      setContent((current) => ({ ...current, profile: { ...current.profile, [key]: value } })),
  })

  return (
    <div className="editor-form">
      <TextField label="Nickname" {...field('nickname')} hint="Shown in the big “Hello, I'm …” heading." />
      <TextField label="Full name" {...field('fullName')} />
      <TextField label="School" {...field('school')} />
      <div className="editor-row">
        <TextField label="Age" {...field('age')} />
        <TextField label="Grade" {...field('grade')} />
      </div>
      <TextField label="Interests" {...field('interests')} />
      <TextField label="Current direction" {...field('direction')} />
      <TextField label="Top line" {...field('kicker')} />
      <TextField label="Introduction" multiline {...field('lead')} />
      <TextField label="Second paragraph" multiline {...field('secondary')} />
    </div>
  )
}

function useListEditor<K extends 'achievements' | 'projects' | 'academics'>(
  key: K,
  blank: SiteContent[K][number],
) {
  const { content, setContent } = useContent()
  const items = content[key] as SiteContent[K]
  const [selected, setSelected] = useState(0)
  const index = Math.min(selected, Math.max(items.length - 1, 0))

  const setItems = (update: (items: SiteContent[K]) => SiteContent[K]) =>
    setContent((current) => ({ ...current, [key]: update(current[key] as SiteContent[K]) }))

  return {
    items,
    index,
    item: items[index] as SiteContent[K][number] | undefined,
    select: setSelected,
    add: () => {
      const fresh = 'id' in blank ? { ...blank, id: `subject-${Date.now()}` } : { ...blank }
      setItems((list) => [...list, fresh] as SiteContent[K])
      setSelected(items.length)
    },
    move: (direction: -1 | 1) => {
      setItems((list) => moveItem(list as SiteContent[K][number][], index, direction) as SiteContent[K])
      setSelected(index + direction)
    },
    remove: () => {
      setItems((list) => list.filter((_, i) => i !== index) as SiteContent[K])
      setSelected(Math.max(index - 1, 0))
    },
    update: (patch: Partial<SiteContent[K][number]>) =>
      setItems(
        (list) => list.map((entry, i) => (i === index ? { ...entry, ...patch } : entry)) as SiteContent[K],
      ),
  }
}

function AcademicsTab() {
  const editor = useListEditor('academics', newSubject)
  const item = editor.item as AcademicSubject | undefined

  return (
    <div className="editor-form">
      <ItemPicker
        label="Subject to edit"
        noun="subject"
        titles={editor.items.map((entry) => entry.title)}
        selected={editor.index}
        onSelect={editor.select}
        onAdd={editor.add}
        onMove={editor.move}
        onDelete={editor.remove}
      />
      {item && (
        <>
          <div className="editor-row">
            <TextField label="Subject" value={item.title} onChange={(title) => editor.update({ title })} />
            <TextField label="Subject type" value={item.label} onChange={(label) => editor.update({ label })} />
          </div>
          <TextField label="Project title" value={item.project} onChange={(project) => editor.update({ project })} />
          <TextField label="Description" multiline value={item.body} onChange={(body) => editor.update({ body })} />
          <TextField label="Reflection quote" multiline value={item.quote} onChange={(quote) => editor.update({ quote })} />
          <ListField label="What I worked with" value={item.details} onChange={(details) => editor.update({ details })} />
          <ListField label="Ideas involved" value={item.concepts} onChange={(concepts) => editor.update({ concepts })} />
          <ListField label="What I developed" value={item.developed} onChange={(developed) => editor.update({ developed })} />
          <div className="editor-field">
            <label htmlFor="editor-subject-accent">Accent</label>
            <select
              id="editor-subject-accent"
              value={item.accent}
              onChange={(event) => editor.update({ accent: event.target.value as AcademicSubject['accent'] })}
            >
              <option value="blue">Blue</option>
              <option value="amber">Amber</option>
              <option value="green">Green</option>
            </select>
          </div>
        </>
      )}
    </div>
  )
}

function AchievementsTab() {
  const editor = useListEditor('achievements', newAchievement)
  const item = editor.item as Achievement | undefined

  return (
    <div className="editor-form">
      <ItemPicker
        label="Achievement to edit"
        noun="achievement"
        titles={editor.items.map((entry) => entry.title)}
        selected={editor.index}
        onSelect={editor.select}
        onAdd={editor.add}
        onMove={editor.move}
        onDelete={editor.remove}
      />
      {item && (
        <>
          <TextField label="Title" value={item.title} onChange={(title) => editor.update({ title })} />
          <div className="editor-row">
            <TextField label="Result" value={item.result} onChange={(result) => editor.update({ result })} />
            <TextField label="Year" value={item.year} onChange={(year) => editor.update({ year })} />
          </div>
          <TextField label="Category" value={item.category} onChange={(category) => editor.update({ category })} />
          <TextField label="Summary" multiline value={item.summary} onChange={(summary) => editor.update({ summary })} />
          <TextField label="What happened" multiline value={item.happened} onChange={(happened) => editor.update({ happened })} />
          <TextField
            label="What I did"
            multiline
            value={item.contribution}
            onChange={(contribution) => editor.update({ contribution })}
          />
          <TextField label="What I learned" multiline value={item.learned} onChange={(learned) => editor.update({ learned })} />
          <ListField label="Skills" value={item.skills} onChange={(skills) => editor.update({ skills })} />
          <ListField label="Progress stages" value={item.stages} onChange={(stages) => editor.update({ stages })} />
          <ListField label="Highlights" value={item.stats} onChange={(stats) => editor.update({ stats })} />
        </>
      )}
    </div>
  )
}

function ProjectsTab() {
  const editor = useListEditor('projects', newProject)
  const item = editor.item as Project | undefined

  return (
    <div className="editor-form">
      <ItemPicker
        label="Project to edit"
        noun="project"
        titles={editor.items.map((entry) => entry.title)}
        selected={editor.index}
        onSelect={editor.select}
        onAdd={editor.add}
        onMove={editor.move}
        onDelete={editor.remove}
      />
      {item && (
        <>
          <TextField label="Title" value={item.title} onChange={(title) => editor.update({ title })} />
          <div className="editor-row">
            <TextField label="Category" value={item.category} onChange={(category) => editor.update({ category })} />
            <TextField label="Number" value={item.number} onChange={(number) => editor.update({ number })} />
          </div>
          <TextField
            label="Description"
            multiline
            value={item.description}
            onChange={(description) => editor.update({ description })}
          />
          <TextField label="Why it matters" multiline value={item.note} onChange={(note) => editor.update({ note })} />
          <TextField
            label="Why I built this"
            multiline
            value={item.why ?? ''}
            hint="Leave empty to hide the “Why I built this” drawer."
            onChange={(why) => editor.update({ why: why || undefined })}
          />
          <ListField label="Tags" value={item.tags} onChange={(tags) => editor.update({ tags })} />
          <ListField label="Media placeholders" value={item.media} onChange={(media) => editor.update({ media })} />
        </>
      )}
    </div>
  )
}

function StyleTab() {
  const { content, setContent } = useContent()
  const setAccent = (accent: string) => setContent((current) => ({ ...current, accent }))

  return (
    <div className="editor-form">
      <div className="editor-field">
        <label htmlFor="editor-accent">Accent color</label>
        <div className="editor-color-row">
          <input
            id="editor-accent"
            type="color"
            value={content.accent || '#2864e8'}
            onChange={(event) => setAccent(event.target.value)}
          />
          <span>{content.accent || 'Theme default'}</span>
        </div>
      </div>
      <div className="editor-swatches" role="group" aria-label="Accent presets">
        {accentPresets.map((preset) => (
          <button
            key={preset.value}
            type="button"
            className="editor-swatch"
            style={{ background: preset.value }}
            aria-label={preset.name}
            aria-pressed={content.accent === preset.value}
            onClick={() => setAccent(preset.value)}
          />
        ))}
      </div>
      <button type="button" className="editor-button" onClick={() => setAccent('')}>
        Use theme default
      </button>
      <p className="editor-hint">
        The accent colors buttons, links, highlights, and the progress bar. Light and dark mode
        are still switched with the moon/sun button.
      </p>
    </div>
  )
}

function DataTab() {
  const { content, resetContent, importContent } = useContent()
  const [confirmingReset, setConfirmingReset] = useState(false)
  const [status, setStatus] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const exportContent = () => {
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'portfolio-portfolio-content.json'
    link.click()
    URL.revokeObjectURL(url)
    setStatus('Exported portfolio-content.json.')
  }

  return (
    <div className="editor-form">
      <p className="editor-hint">
        Changes save automatically in this browser. Export a file to keep a backup or move your
        edits to another computer. To publish them for every visitor, save the exported file as
        src/published-content.json and redeploy.
      </p>
      <button type="button" className="editor-button primary" onClick={exportContent}>
        Export content file
      </button>
      <button type="button" className="editor-button" onClick={() => fileRef.current?.click()}>
        Import content file
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="application/json,.json"
        hidden
        aria-label="Content file to import"
        onChange={async (event) => {
          const file = event.target.files?.[0]
          event.target.value = ''
          if (!file) return
          try {
            importContent(await file.text())
            setStatus(`Imported ${file.name}.`)
          } catch {
            setStatus('That file could not be read. Choose a file exported from this editor.')
          }
        }}
      />
      <div className="editor-danger-zone">
        {confirmingReset ? (
          <>
            <p>This removes every edit and restores the original content.</p>
            <button
              type="button"
              className="editor-button danger"
              onClick={() => {
                resetContent()
                setConfirmingReset(false)
                setStatus('Restored the original content.')
              }}
            >
              Yes, reset everything
            </button>
            <button type="button" className="editor-button" onClick={() => setConfirmingReset(false)}>
              Cancel
            </button>
          </>
        ) : (
          <button type="button" className="editor-button" onClick={() => setConfirmingReset(true)}>
            Reset all changes
          </button>
        )}
      </div>
      <p className="editor-status" role="status">
        {status}
      </p>
    </div>
  )
}
