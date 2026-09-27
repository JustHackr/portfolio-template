import type { CSSProperties } from 'react'
import { useContent } from '../state/ContentContext'
import { Editable } from './Editable'
import { Icon } from './Icon'

export function initials(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase())
      .join('') || 'ME'
  )
}

export function Hero() {
  const { profile } = useContent().content
  const monogram = initials(profile.fullName)

  return (
    <section className="hero section-shell" id="home" aria-labelledby="hero-title">
      <div className="hero-orbit orbit-one" aria-hidden="true" />
      <div className="hero-orbit orbit-two" aria-hidden="true" />
      <div className="hero-visual-stage" aria-hidden="true">
        <div className="hero-halo halo-one" />
        <div className="hero-halo halo-two" />
        <div className="hero-core">
          <span className="core-ring ring-one" />
          <span className="core-ring ring-two" />
          <div className="core-mark">
            <span>{monogram}</span>
            <small>
              {profile.age} / {profile.grade.replace(/\D/g, '') || profile.grade}
            </small>
          </div>
        </div>
        <div className="floating-signal signal-ai">
          <Icon name="spark" size={15} />
          <span>{profile.direction}</span>
        </div>
        <div className="floating-signal signal-code">
          <Icon name="code" size={15} />
          <Editable path="copy.heroSignalBuild" />
        </div>
        <div className="floating-signal signal-science">
          <Icon name="atom" size={15} />
          <Editable path="copy.heroSignalUnderstand" />
        </div>
      </div>

      <div className="hero-kicker hero-enter" style={{ '--enter-delay': '0ms' } as CSSProperties}>
        <span className="status-dot" />
        <Editable path="profile.kicker" />
      </div>

      <h1 id="hero-title" className="hero-enter" style={{ '--enter-delay': '90ms' } as CSSProperties}>
        <Editable path="copy.heroGreeting" />{' '}
        <span className="hero-name">
          <Editable path="profile.nickname" suffix="." />
        </span>
      </h1>

      <div className="hero-story hero-enter" style={{ '--enter-delay': '200ms' } as CSSProperties}>
        <Editable as="p" className="hero-lead" path="profile.lead" multiline />
        <Editable as="p" className="hero-secondary" path="profile.secondary" multiline />
      </div>

      <div
        className="identity-stage hero-enter"
        style={{ '--enter-delay': '320ms' } as CSSProperties}
        aria-label="Profile overview"
      >
        <div className="identity-core">
          <span className="identity-monogram">{monogram}</span>
          <div>
            <Editable as="strong" path="profile.fullName" />
            <Editable path="profile.school" />
          </div>
        </div>

        <div className="identity-facts">
          <div>
            <Editable path="copy.heroAgeLabel" />
            <Editable as="strong" path="profile.age" />
          </div>
          <div>
            <Editable path="copy.heroYearLabel" />
            <Editable as="strong" path="profile.grade" />
          </div>
          <div>
            <Editable path="copy.heroIntoLabel" />
            <Editable as="strong" path="profile.interests" />
          </div>
          <div className="interest-pill">
            <span>
              <Icon name="spark" size={16} /> <Editable path="copy.heroDirectionLabel" />
            </span>
            <Editable as="strong" path="profile.direction" />
          </div>
        </div>
      </div>

      <a className="scroll-cue" href="#academics">
        <Editable path="copy.heroScrollCue" />
        <Icon name="arrow" size={16} />
      </a>
    </section>
  )
}
