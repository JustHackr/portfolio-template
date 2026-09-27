import { useCallback, useMemo, useState } from 'react'
import { navigation } from './content'
import { Academics } from './components/Academics'
import { Achievements } from './components/Achievements'
import { EditorPanel } from './components/editor/EditorPanel'
import { EditBar, Inspector } from './components/editor/Inspector'
import { Footer } from './components/Footer'
import { Hero } from './components/Hero'
import { Journey } from './components/Journey'
import { Navigation } from './components/Navigation'
import { PresentationMode } from './components/PresentationMode'
import { Projects } from './components/Projects'
import { useActiveSection } from './hooks/useActiveSection'
import { useScrollProgress } from './hooks/useScrollProgress'
import { useTheme } from './hooks/useTheme'
import { ContentProvider, useContent } from './state/ContentContext'

const EDITOR_ACCESS_KEY = 'portfolio-editor'

/** Edits only ever save to the visitor's own browser; visiting with ?noedit hides the pencil on that device. */
function hasEditorAccess() {
  if (import.meta.env.DEV) return true
  const params = new URLSearchParams(window.location.search)
  if (params.has('noedit')) window.localStorage.setItem(EDITOR_ACCESS_KEY, 'off')
  if (params.has('edit')) window.localStorage.removeItem(EDITOR_ACCESS_KEY)
  return window.localStorage.getItem(EDITOR_ACCESS_KEY) !== 'off'
}

function Portfolio() {
  const { editMode, setEditMode } = useContent()
  const [presenting, setPresenting] = useState(false)
  const [panelOpen, setPanelOpen] = useState(false)
  const canEdit = useMemo(hasEditorAccess, [])
  const sectionIds = useMemo(() => navigation.map((item) => item.id), [])
  const activeSection = useActiveSection(sectionIds)
  const scrollProgress = useScrollProgress()
  const { theme, toggleTheme } = useTheme()
  const closePresentation = useCallback(() => setPresenting(false), [])
  const closePanel = useCallback(() => setPanelOpen(false), [])

  const finishEditing = () => {
    setEditMode(false)
    setPanelOpen(false)
  }

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Navigation
        activeSection={activeSection}
        theme={theme}
        scrollProgress={scrollProgress}
        onThemeToggle={toggleTheme}
        onPresent={() => {
          finishEditing()
          setPresenting(true)
        }}
        canEdit={canEdit}
        editMode={editMode}
        onEditToggle={() => (editMode ? finishEditing() : setEditMode(true))}
      />
      <main id="main-content">
        <Hero />
        <Academics />
        <Projects />
        <Achievements />
        <Journey />
      </main>
      <Footer />
      {editMode && (
        <>
          <Inspector />
          <EditBar
            panelOpen={panelOpen}
            onTogglePanel={() => setPanelOpen((open) => !open)}
            onDone={finishEditing}
          />
        </>
      )}
      <EditorPanel open={panelOpen} onClose={closePanel} />
      <PresentationMode open={presenting} onClose={closePresentation} />
    </>
  )
}

export default function App() {
  return (
    <ContentProvider>
      <Portfolio />
    </ContentProvider>
  )
}
