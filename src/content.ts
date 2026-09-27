export type IconName =
  | 'arrow'
  | 'atom'
  | 'brain'
  | 'code'
  | 'edit'
  | 'moon'
  | 'play'
  | 'spark'
  | 'sun'
  | 'x'

export interface NavigationItem {
  id: string
  label: string
  cue: string
}

export interface AcademicSubject {
  id: string
  index: string
  title: string
  label: string
  project: string
  body: string
  quote: string
  concepts: string[]
  details: string[]
  developed: string[]
  accent: 'blue' | 'amber' | 'green'
  image?: string | null
}

export interface Project {
  number: string
  title: string
  category: string
  description: string
  note: string
  tags: string[]
  media: string[]
  accent: 'blue' | 'amber' | 'violet'
  why?: string
  /** Uploaded pictures, matched by position to the `media` placeholder labels. */
  images?: (string | null)[]
}

export interface Achievement {
  year: string
  title: string
  result: string
  category: string
  summary: string
  happened: string
  contribution: string
  learned: string
  skills: string[]
  stages?: string[]
  stats?: string[]
}

export const navigation: NavigationItem[] = [
  { id: 'home', label: 'Home', cue: 'Who am I?' },
  { id: 'academics', label: 'Academics', cue: 'What am I learning?' },
  { id: 'projects', label: 'Projects', cue: 'What have I made?' },
  {
    id: 'achievements',
    label: 'Achievements',
    cue: 'How have I challenged myself?',
  },
  {
    id: 'journey',
    label: 'My Journey',
    cue: 'Where am I going next?',
  },
]

export const academics: AcademicSubject[] = [
  {
    id: 'mathematics',
    index: '01',
    title: 'Mathematics',
    label: 'Subject category',
    project: 'Your Maths Project',
    body: 'Describe what you explored in this subject and how you approached it.',
    quote: 'Add a short reflection in your own words about what this project meant to you.',
    concepts: ['Concept one', 'Concept two', 'Concept three'],
    details: [
      'Something you worked on.',
      'A method or tool you used.',
      'A connection you made between ideas.',
    ],
    developed: ['Skill one', 'Skill two', 'Skill three'],
    accent: 'blue',
  },
  {
    id: 'physics',
    index: '02',
    title: 'Physics',
    label: 'Subject category',
    project: 'Your Physics Project',
    body: 'Describe what you explored in this subject and who you worked with.',
    quote: 'Add a short reflection in your own words about what this project meant to you.',
    concepts: ['Concept one', 'Concept two', 'Concept three'],
    details: [
      'Something you worked on.',
      'Your contribution to the work.',
      'How you presented or explained it.',
    ],
    developed: ['Skill one', 'Skill two', 'Skill three'],
    accent: 'amber',
  },
  {
    id: 'biology',
    index: '03',
    title: 'Biology',
    label: 'Subject category',
    project: 'Your Biology Project',
    body: 'Describe what you explored in this subject and what you observed.',
    quote: 'Add a short reflection in your own words about what this project meant to you.',
    concepts: ['Concept one', 'Concept two', 'Concept three'],
    details: [
      'Something you observed.',
      'A connection between theory and practice.',
      'A habit or skill you practised.',
    ],
    developed: ['Skill one', 'Skill two', 'Skill three'],
    accent: 'green',
  },
]

export const projects: Project[] = [
  {
    number: '001',
    title: 'Project One',
    category: 'Subject / Tool',
    description: 'One or two sentences describing what this project is and what it explores.',
    note: 'The main idea behind this project.',
    tags: ['Tag', 'Tag', 'Tag'],
    media: ['Picture one', 'Picture two'],
    accent: 'blue',
  },
  {
    number: '002',
    title: 'Project Two',
    category: 'Subject / Format',
    description: 'One or two sentences describing what this project is and who you made it with.',
    note: 'The main idea behind this project.',
    tags: ['Tag', 'Tag', 'Tag'],
    media: ['Picture one', 'Picture two'],
    accent: 'amber',
  },
  {
    number: '003',
    title: 'Project Three',
    category: 'Independent Project',
    description: 'One or two sentences describing a personal project you are proud of.',
    note: 'The main idea behind this project.',
    tags: ['Tag', 'Tag', 'Tag'],
    media: ['Picture one', 'Picture two', 'Picture three'],
    accent: 'violet',
    why: 'Explain why you started this project and what you hoped to learn.',
  },
]

export const achievements: Achievement[] = [
  {
    year: 'Year',
    title: 'Competition Name',
    result: 'Your result',
    category: 'Competition · Team',
    summary: 'A one-line summary of this achievement.',
    happened: 'What happened, in a sentence or two.',
    contribution: 'What you personally did.',
    learned: 'What you learned from it.',
    skills: ['Skill', 'Skill', 'Skill'],
    stages: ['Preparation', 'Development', 'Final'],
  },
  {
    year: 'Year',
    title: 'Academic Award',
    result: 'Your result',
    category: 'Academic',
    summary: 'A one-line summary of this achievement.',
    happened: 'What happened, in a sentence or two.',
    contribution: 'What you personally did.',
    learned: 'What you learned from it.',
    skills: ['Skill', 'Skill', 'Skill'],
    stages: ['Preparation', 'Progression', 'Result'],
  },
  {
    year: 'Year',
    title: 'Leadership Role',
    result: 'Your role',
    category: 'Leadership',
    summary: 'A one-line summary of this role.',
    happened: 'How you got this role.',
    contribution: 'What you do in this role.',
    learned: 'What this role has taught you.',
    skills: ['Skill', 'Skill', 'Skill'],
    stages: ['Start', 'Now'],
  },
]

export interface Profile {
  nickname: string
  fullName: string
  school: string
  age: string
  grade: string
  interests: string
  direction: string
  kicker: string
  lead: string
  secondary: string
}

export const profile: Profile = {
  nickname: 'Your Name',
  fullName: 'Your Full Name',
  school: 'Your School',
  age: 'Age',
  grade: 'Grade',
  interests: 'Interest · Interest · Interest',
  direction: 'Your direction',
  kicker: 'Student Portfolio',
  lead: 'Introduce yourself here — who you are, where you study, and what you care about.',
  secondary: 'Add a second sentence about your interests and what you enjoy building or learning.',
}

/** Every fixed piece of wording on the page, editable inline in edit mode. */
export const copy = {
  heroGreeting: "Hello, I'm",
  heroSignalBuild: 'Build',
  heroSignalUnderstand: 'Understand',
  heroAgeLabel: 'Age',
  heroYearLabel: 'Year',
  heroIntoLabel: 'Into',
  heroDirectionLabel: 'Current direction',
  heroScrollCue: 'Start the story',
  academicsEyebrow: '01 / Academics',
  academicsHeading: 'Learning becomes real when I can see it.',
  academicsIntro: 'A few subjects, and the projects that brought them to life.',
  academicsWorkedLabel: 'What I worked with',
  academicsIdeasLabel: 'Ideas involved',
  academicsDevelopedLabel: 'What I developed',
  projectsEyebrow: '02 / Projects',
  projectsHeading: 'Ideas become meaningful when I make them tangible.',
  projectsIntro: 'School work, collaboration, and independent curiosity.',
  projectsMediaLabel: 'Media',
  projectsNoteLabel: 'Why it matters',
  projectsWhyLabel: 'Why I built this',
  achievementsEyebrow: '03 / Achievements',
  achievementsHeading: 'A few things I’ve built, learned, and pushed myself through.',
  achievementsAllLabel: 'All',
  achievementsHappenedLabel: 'What happened',
  achievementsDidLabel: 'What I did',
  achievementsLearnedLabel: 'What I learned',
  journeyEyebrow: '04 / My Journey',
  journeyHeading: 'The story is still being written.',
  journeyIntro: 'A space for the moments, people, and lessons that have shaped you.',
  journeyMonthLabel: 'Next chapter',
  journeyMonthTitle: 'Coming up',
  journeyPlaceholderTitle: 'Ready for the moments that matter.',
  journeyPlaceholderBody: 'Add your upcoming milestones here.',
  footerMeta: 'Grade · Your School',
  footerMotto: 'Learning. Building. Becoming.',
  footerCopyright: '© Your Name',
  presentLabel: 'Present',
}

export type CopyKey = keyof typeof copy

export const journeyFields = [
  'Event / Activity',
  'What I did',
  'What I learned',
  'People I worked with',
]

export interface ElementStyle {
  scale?: number
  color?: string
  bold?: boolean
  italic?: boolean
  hidden?: boolean
}

export interface SiteContent {
  profile: Profile
  navigation: NavigationItem[]
  academics: AcademicSubject[]
  projects: Project[]
  achievements: Achievement[]
  journeyFields: string[]
  copy: Record<CopyKey, string>
  styles: Record<string, ElementStyle>
  accent: string
}

/** An empty accent keeps the theme's built-in blue for both light and dark mode. */
export const defaultContent: SiteContent = {
  profile,
  navigation,
  academics,
  projects,
  achievements,
  journeyFields,
  copy,
  styles: {},
  accent: '',
}
