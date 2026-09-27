import { useState } from 'react'
import { useContent } from '../state/ContentContext'
import { Disclosure } from './Disclosure'
import { Editable } from './Editable'
import { Icon } from './Icon'
import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'

function groupOf(category: string) {
  return category.split('·')[0].trim() || 'Other'
}

export function Achievements() {
  const { achievements, copy } = useContent().content
  const [filter, setFilter] = useState<string | null>(null)
  const groups = [...new Set(achievements.map((achievement) => groupOf(achievement.category)))]
  const activeFilter = filter && groups.includes(filter) ? filter : null

  return (
    <section
      className="content-section achievement-section section-shell"
      id="achievements"
      aria-labelledby="achievements-title"
    >
      <SectionHeading section="achievements" className="achievement-heading" />

      <Reveal>
        <div className="segmented filter-tabs" role="group" aria-label="Filter achievements">
          <button
            type="button"
            aria-pressed={activeFilter === null}
            className={activeFilter === null ? 'is-active' : ''}
            onClick={() => setFilter(null)}
          >
            {copy.achievementsAllLabel}
          </button>
          {groups.map((group) => (
            <button
              key={group}
              type="button"
              aria-pressed={activeFilter === group}
              className={activeFilter === group ? 'is-active' : ''}
              onClick={() => setFilter(group)}
            >
              {group}
            </button>
          ))}
        </div>
      </Reveal>

      <div className="timeline" key={activeFilter ?? 'all'}>
        <div className="timeline-line" aria-hidden="true" />
        {achievements.map((achievement, index) => {
          if (activeFilter && groupOf(achievement.category) !== activeFilter) return null
          const base = `achievements.${index}`
          return (
            <Reveal key={index} delay={index * 90}>
              <article className="timeline-entry">
                <div className="timeline-year">
                  <Editable path={`${base}.year`} />
                  <i aria-hidden="true" />
                </div>
                <Disclosure
                  className="achievement-card"
                  label={achievement.title}
                  defaultOpen={index === 0}
                  accessibleSummary={`${achievement.category}, ${achievement.result}`}
                  summary={
                    <>
                      <div>
                        <Editable className="achievement-category" path={`${base}.category`} />
                        <Editable as="h3" path={`${base}.title`} />
                        <Editable className="achievement-result" path={`${base}.result`} />
                      </div>
                      <span className="expand-icon">
                        <Icon name="arrow" />
                      </span>
                    </>
                  }
                >
                  <div className="achievement-content">
                    <Editable as="p" className="achievement-summary" path={`${base}.summary`} multiline />

                    {achievement.stats && achievement.stats.length > 0 && (
                      <div className="achievement-stats">
                        {achievement.stats.map((_, s) => (
                          <Editable key={s} path={`${base}.stats.${s}`} />
                        ))}
                      </div>
                    )}

                    {achievement.stages && achievement.stages.length > 0 && (
                      <div className="stage-track" aria-label={`${achievement.title} progression`}>
                        {achievement.stages.map((_, s) => (
                          <div key={s}>
                            <span>{String(s + 1).padStart(2, '0')}</span>
                            <Editable as="strong" path={`${base}.stages.${s}`} />
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="reflection-grid">
                      <div>
                        <Editable path="copy.achievementsHappenedLabel" />
                        <Editable as="p" path={`${base}.happened`} multiline />
                      </div>
                      <div>
                        <Editable path="copy.achievementsDidLabel" />
                        <Editable as="p" path={`${base}.contribution`} multiline />
                      </div>
                      <div>
                        <Editable path="copy.achievementsLearnedLabel" />
                        <Editable as="p" path={`${base}.learned`} multiline />
                      </div>
                    </div>

                    <div className="chip-list soft">
                      {achievement.skills.map((_, s) => (
                        <Editable key={s} path={`${base}.skills.${s}`} />
                      ))}
                    </div>
                  </div>
                </Disclosure>
              </article>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}
