import type { CopyKey } from '../content'
import { useContent } from '../state/ContentContext'
import { Editable } from './Editable'
import { Reveal } from './Reveal'

type Section = 'academics' | 'projects' | 'achievements' | 'journey'

export function SectionHeading({ section, className = '' }: { section: Section; className?: string }) {
  const { copy } = useContent().content
  const introKey = `${section}Intro` as CopyKey

  return (
    <Reveal>
      <header className={`section-heading ${className}`}>
        <div>
          <Editable as="span" className="eyebrow" path={`copy.${section}Eyebrow`} />
          <Editable as="h2" id={`${section}-title`} path={`copy.${section}Heading`} multiline />
        </div>
        {introKey in copy && <Editable as="p" path={`copy.${introKey}`} multiline />}
      </header>
    </Reveal>
  )
}
