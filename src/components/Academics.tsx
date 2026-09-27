import { useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'
import { useContent } from '../state/ContentContext'
import { Editable } from './Editable'
import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'
import { SubjectMedia } from './SubjectMedia'

export function Academics() {
  const { academics } = useContent().content
  const [active, setActive] = useState(0)
  const [direction, setDirection] = useState<'forward' | 'back'>('forward')
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const index = Math.min(active, Math.max(academics.length - 1, 0))

  const select = (next: number) => {
    setDirection(next >= index ? 'forward' : 'back')
    setActive(next)
  }

  const handleKeys = (event: KeyboardEvent<HTMLDivElement>) => {
    const last = academics.length - 1
    const targets: Record<string, number> = {
      ArrowRight: index === last ? 0 : index + 1,
      ArrowLeft: index === 0 ? last : index - 1,
      Home: 0,
      End: last,
    }
    if (!(event.key in targets) || (event.target as HTMLElement).isContentEditable) return
    event.preventDefault()
    select(targets[event.key])
    tabRefs.current[targets[event.key]]?.focus()
  }

  return (
    <section className="content-section section-shell" id="academics" aria-labelledby="academics-title">
      <SectionHeading section="academics" />

      <Reveal>
        <div
          className="segmented subject-tabs"
          role="tablist"
          aria-label="Subjects"
          onKeyDown={handleKeys}
          style={{ '--tab-count': academics.length, '--tab-index': index } as CSSProperties}
        >
          <span className="segmented-indicator" aria-hidden="true" />
          {academics.map((subject, i) => (
            <button
              key={i}
              ref={(element) => {
                tabRefs.current[i] = element
              }}
              type="button"
              role="tab"
              id={`subject-tab-${i}`}
              aria-label={subject.title}
              aria-selected={i === index}
              aria-controls={`subject-panel-${i}`}
              tabIndex={i === index ? 0 : -1}
              className={i === index ? 'is-active' : ''}
              onClick={() => select(i)}
            >
              <span className="segmented-index">{String(i + 1).padStart(2, '0')}</span>
              <Editable path={`academics.${i}.title`} />
            </button>
          ))}
        </div>
      </Reveal>

      <div className="subject-stage">
        {academics.map((subject, i) => (
          <article
            key={i}
            role="tabpanel"
            id={`subject-panel-${i}`}
            aria-labelledby={`subject-tab-${i}`}
            hidden={i !== index}
            className={`subject-panel accent-${subject.accent} enter-${direction}`}
          >
            <div className="subject-hero">
              <div className="subject-copy">
                <Editable className="subject-label" path={`academics.${i}.label`} />
                <Editable as="h3" path={`academics.${i}.project`} />
                <Editable as="p" className="subject-name" path={`academics.${i}.title`} />
                <Editable as="p" className="academic-body" path={`academics.${i}.body`} multiline />
                <blockquote>
                  <Editable path={`academics.${i}.quote`} prefix="“" suffix="”" multiline />
                </blockquote>
              </div>
              <div className="subject-visual">
                <SubjectMedia subject={subject} index={i} />
              </div>
            </div>

            <div className="subject-grid">
              <div className="subject-card">
                <Editable as="h4" path="copy.academicsWorkedLabel" />
                <ul>
                  {subject.details.map((_, d) => (
                    <Editable key={d} as="li" path={`academics.${i}.details.${d}`} multiline />
                  ))}
                </ul>
              </div>
              <div className="subject-card">
                <Editable as="h4" path="copy.academicsIdeasLabel" />
                <div className="chip-list">
                  {subject.concepts.map((_, c) => (
                    <Editable key={c} path={`academics.${i}.concepts.${c}`} />
                  ))}
                </div>
              </div>
              <div className="subject-card">
                <Editable as="h4" path="copy.academicsDevelopedLabel" />
                <div className="chip-list soft">
                  {subject.developed.map((_, t) => (
                    <Editable key={t} path={`academics.${i}.developed.${t}`} />
                  ))}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
