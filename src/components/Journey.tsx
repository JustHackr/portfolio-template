import { useContent } from '../state/ContentContext'
import { Editable } from './Editable'
import { Icon } from './Icon'
import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'

export function Journey() {
  const { journeyFields } = useContent().content

  return (
    <section className="content-section journey section-shell" id="journey" aria-labelledby="journey-title">
      <SectionHeading section="journey" />

      <Reveal>
        <div className="journey-empty">
          <div className="journey-month">
            <Editable path="copy.journeyMonthLabel" />
            <Editable as="strong" path="copy.journeyMonthTitle" />
          </div>
          <div className="journey-placeholder">
            <span className="journey-icon">
              <Icon name="spark" size={22} />
            </span>
            <div>
              <Editable as="h3" path="copy.journeyPlaceholderTitle" />
              <Editable as="p" path="copy.journeyPlaceholderBody" multiline />
            </div>
          </div>
          <div className="journey-fields" aria-label="Future timeline structure">
            {journeyFields.map((_, index) => (
              <Editable key={index} path={`journeyFields.${index}`} />
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  )
}
