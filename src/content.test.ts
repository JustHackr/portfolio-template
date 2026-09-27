import { describe, expect, it } from 'vitest'
import { academics, achievements, navigation, profile, projects } from './content'

describe('template content', () => {
  it('contains every main section in story order', () => {
    expect(navigation.map((item) => item.label)).toEqual([
      'Home',
      'Academics',
      'Projects',
      'Achievements',
      'My Journey',
    ])
  })

  it('ships with placeholder content only', () => {
    expect(profile.fullName).toBe('Your Full Name')
    expect(profile.school).toBe('Your School')
    expect(academics).toHaveLength(3)
    expect(projects.map((project) => project.title)).toEqual([
      'Project One',
      'Project Two',
      'Project Three',
    ])
    expect(achievements.every((achievement) => achievement.year === 'Year')).toBe(true)
  })
})
