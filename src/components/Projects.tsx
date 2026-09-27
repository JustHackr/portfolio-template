import { useState, type CSSProperties } from 'react'
import type { Project } from '../content'
import { useContent } from '../state/ContentContext'
import { PatternMark } from './PatternVisual'
import { Disclosure } from './Disclosure'
import { Editable } from './Editable'
import { ImageUpload } from './editor/ImageUpload'
import { Icon } from './Icon'
import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'

function ProjectVisual({ project, index }: { project: Project; index: number }) {
  const [activeSlot, setActiveSlot] = useState<number | null>(null)
  const photos = project.media
    .map((label, slot) => ({ label, slot, src: project.images?.[slot] }))
    .filter((photo): photo is { label: string; slot: number; src: string } => !!photo.src)
  const current = photos.find((photo) => photo.slot === activeSlot) ?? photos[0]

  return (
    <div
      className={`project-visual visual-${project.accent} ${current ? 'has-photo' : ''}`}
      aria-label={`${project.title} media`}
    >
      {current && (
        <img key={current.src} className="project-photo" src={current.src} alt={current.label} />
      )}
      <div className="visual-topline">
        <Editable path={`projects.${index}.number`} />
        <Editable path="copy.projectsMediaLabel" />
      </div>
      <div className="visual-mark" aria-hidden="true">
        {current ? null : index % 3 === 2 ? (
          <svg viewBox="0 0 360 120">
            <path d="M0 61h52l9-20 15 49 18-71 20 42h44l10-13 12 25 13-13h35l10-32 17 56 15-23h90" />
          </svg>
        ) : index % 3 === 0 ? (
          <PatternMark />
        ) : (
          <div className="orbit-visual">
            <span />
            <i />
          </div>
        )}
      </div>
      <div className="placeholder-row">
        {project.media.map((label, m) => {
          const src = project.images?.[m]
          return (
            <div key={m} className={`media-slot ${src ? 'is-filled' : ''} ${current?.slot === m ? 'is-current' : ''}`}>
              {src ? (
                <button
                  type="button"
                  className="media-thumb"
                  onClick={() => setActiveSlot(m)}
                  aria-label={`Show picture: ${label}`}
                  aria-pressed={current?.slot === m}
                >
                  <img src={src} alt="" />
                </button>
              ) : null}
              <Editable path={`projects.${index}.media.${m}`} />
              <ImageUpload path={`projects.${index}.images.${m}`} label={label} hasImage={!!src} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function Projects() {
  const { projects } = useContent().content

  return (
    <section className="content-section section-shell" id="projects" aria-labelledby="projects-title">
      <SectionHeading section="projects" />

      <div className="project-list">
        {projects.map((project, index) => (
          <Reveal key={index} delay={index * 70}>
            <article
              className="project-card"
              style={{ '--project-index': index } as CSSProperties}
            >
              <ProjectVisual project={project} index={index} />
              <div className="project-copy">
                <div className="project-meta">
                  <Editable path={`projects.${index}.category`} />
                  <span>{project.number}</span>
                </div>
                <Editable as="h3" path={`projects.${index}.title`} />
                <Editable as="p" path={`projects.${index}.description`} multiline />
                <div className="project-tags">
                  {project.tags.map((_, t) => (
                    <Editable key={t} path={`projects.${index}.tags.${t}`} />
                  ))}
                </div>
                <div className="project-note">
                  <Editable path="copy.projectsNoteLabel" />
                  <Editable as="strong" path={`projects.${index}.note`} multiline />
                </div>
                {project.why && (
                  <Disclosure
                    className="why-built"
                    label={`${project.title} project`}
                    summary={
                      <>
                        <Editable path="copy.projectsWhyLabel" /> <Icon name="arrow" size={16} />
                      </>
                    }
                  >
                    <Editable as="p" path={`projects.${index}.why`} multiline />
                  </Disclosure>
                )}
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
