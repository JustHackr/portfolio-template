import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { useContent } from '../state/ContentContext'
import { Editable } from './Editable'
import { initials } from './Hero'
import { Icon } from './Icon'
import { SectionMenu } from './SectionMenu'

interface NavigationProps {
  activeSection: string
  theme: 'light' | 'dark'
  scrollProgress: number
  onThemeToggle: () => void
  onPresent: () => void
  canEdit: boolean
  editMode: boolean
  onEditToggle: () => void
}

export function Navigation({
  activeSection,
  theme,
  scrollProgress,
  onThemeToggle,
  onPresent,
  canEdit,
  editMode,
  onEditToggle,
}: NavigationProps) {
  const { navigation, profile } = useContent().content
  const linksRef = useRef<HTMLDivElement>(null)
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null)

  useLayoutEffect(() => {
    const place = () => {
      const link = linksRef.current?.querySelector<HTMLElement>('.is-active')
      setIndicator(link ? { left: link.offsetLeft, width: link.offsetWidth } : null)
    }
    place()
    window.addEventListener('resize', place)
    return () => window.removeEventListener('resize', place)
  }, [activeSection, navigation])

  return (
    <header className="site-header">
      <nav className="nav-shell" aria-label="Primary navigation">
        <div
          className="page-progress"
          role="progressbar"
          aria-label="Page progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(scrollProgress * 100)}
        >
          <span style={{ transform: `scaleX(${scrollProgress})` }} />
        </div>
        <a className="wordmark" href="#home" aria-label="Back to top">
          {initials(profile.fullName)}<span aria-hidden="true">.</span>
        </a>

        <div className="nav-links" ref={linksRef}>
          <span
            className="nav-indicator"
            aria-hidden="true"
            style={
              indicator
                ? ({ '--nav-left': `${indicator.left}px`, '--nav-width': `${indicator.width}px` } as CSSProperties)
                : { opacity: 0 }
            }
          />
          {navigation.map((item, index) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={activeSection === item.id ? 'is-active' : ''}
              aria-current={activeSection === item.id ? 'location' : undefined}
            >
              <Editable path={`navigation.${index}.label`} />
            </a>
          ))}
        </div>

        <SectionMenu activeSection={activeSection} />

        <div className="nav-actions">
          {canEdit && (
            <button
              className={`icon-button ${editMode ? 'is-on' : ''}`}
              type="button"
              onClick={onEditToggle}
              aria-label={editMode ? 'Finish editing' : 'Edit page'}
              aria-pressed={editMode}
            >
              <Icon name="edit" />
            </button>
          )}
          <button
            className="icon-button"
            type="button"
            onClick={onThemeToggle}
            aria-label={theme === 'light' ? 'Use dark theme' : 'Use light theme'}
          >
            <Icon name={theme === 'light' ? 'moon' : 'sun'} />
          </button>
          <button
            className="present-button"
            type="button"
            onClick={onPresent}
            aria-label="Start presentation"
          >
            <Icon name="play" size={15} />
            <Editable path="copy.presentLabel" />
          </button>
        </div>
      </nav>
    </header>
  )
}
