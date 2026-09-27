import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('portfolio application', () => {
  it('offers the complete story through accessible navigation', async () => {
    const user = userEvent.setup()
    render(<App />)

    expect(screen.getByRole('navigation', { name: 'Primary navigation' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '#home')
    expect(screen.getByRole('link', { name: 'Academics' })).toHaveAttribute('href', '#academics')
    expect(screen.getByRole('link', { name: 'Projects' })).toHaveAttribute('href', '#projects')
    expect(screen.getByRole('link', { name: 'Achievements' })).toHaveAttribute(
      'href',
      '#achievements',
    )
    expect(screen.getByRole('link', { name: 'My Journey' })).toHaveAttribute(
      'href',
      '#journey',
    )
    const menuToggle = screen.getByRole('button', { name: 'Open section menu' })
    expect(menuToggle).toHaveAttribute('aria-expanded', 'false')
    await user.click(menuToggle)
    expect(menuToggle).toHaveAttribute('aria-expanded', 'true')
    const menu = screen.getByRole('menu', { name: 'Portfolio sections' })
    const menuItems = within(menu).getAllByRole('menuitem')
    expect(menuItems).toHaveLength(5)
    expect(menuItems[0]).toHaveFocus()
    await user.keyboard('{ArrowDown}')
    expect(menuItems[1]).toHaveFocus()
    await user.keyboard('{Escape}')
    expect(menuToggle).toHaveAttribute('aria-expanded', 'false')
    expect(menuToggle).toHaveFocus()

    await user.click(menuToggle)
    await user.click(
      within(screen.getByRole('menu', { name: 'Portfolio sections' })).getByRole(
        'menuitem',
        { name: 'Academics' },
      ),
    )
    expect(menuToggle).toHaveAttribute('aria-expanded', 'false')
    expect(menuToggle).toHaveTextContent('Academics')

    expect(screen.getByRole('progressbar', { name: 'Page progress' })).toBeInTheDocument()
  })

  it('opens and closes guided presentation mode', async () => {
    const user = userEvent.setup()
    render(<App />)

    const trigger = screen.getByRole('button', { name: 'Start presentation' })
    await user.click(trigger)
    const dialog = screen.getByRole('dialog', { name: 'Presentation mode' })
    expect(dialog).toBeInTheDocument()
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveFocus()
    expect(within(dialog).getByText('Who am I?')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Exit presentation' }))
    expect(screen.queryByRole('dialog', { name: 'Presentation mode' })).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })

  it('switches the visual theme', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Use dark theme' }))
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark')
    expect(screen.getByRole('button', { name: 'Use light theme' })).toBeInTheDocument()
  })

  it('switches academic subjects with accessible tabs', async () => {
    const user = userEvent.setup()
    render(<App />)

    const mathematics = screen.getByRole('tab', { name: 'Mathematics' })
    const physics = screen.getByRole('tab', { name: 'Physics' })
    expect(mathematics).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tabpanel', { name: 'Mathematics' })).toBeVisible()

    await user.click(physics)
    expect(physics).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tabpanel', { name: 'Physics' })).toBeVisible()

    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('tab', { name: 'Biology' })).toHaveFocus()
    expect(screen.getByRole('tab', { name: 'Biology' })).toHaveAttribute('aria-selected', 'true')
  })

  it('filters achievements by category', async () => {
    const user = userEvent.setup()
    render(<App />)

    const filters = screen.getByRole('group', { name: 'Filter achievements' })
    await user.click(within(filters).getByRole('button', { name: 'Leadership' }))
    expect(screen.getByText('Leadership Role', { selector: 'h3' })).toBeInTheDocument()
    expect(screen.queryByText('Academic Award', { selector: 'h3' })).not.toBeInTheDocument()

    await user.click(within(filters).getByRole('button', { name: 'All' }))
    expect(screen.getByText('Academic Award', { selector: 'h3' })).toBeInTheDocument()
  })

  it('opens achievement drawers accessibly', async () => {
    const user = userEvent.setup()
    render(<App />)

    const achievementToggle = screen.getByRole('button', {
      name: /Open Academic Award details/,
    })
    await user.click(achievementToggle)
    expect(achievementToggle).toHaveAttribute('aria-expanded', 'true')
  })

  it('edits profile and achievement content from the site editor', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Edit page' }))
    await user.click(screen.getByRole('button', { name: 'Open site editor' }))
    const editor = screen.getByRole('dialog', { name: 'Site editor' })

    const nickname = within(editor).getByLabelText('Nickname')
    await user.clear(nickname)
    await user.type(nickname, 'Alex')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent("Hello, I'm Alex.")

    await user.click(within(editor).getByRole('tab', { name: 'Achievements' }))
    await user.selectOptions(
      within(editor).getByLabelText('Achievement to edit'),
      'Leadership Role',
    )
    const didField = within(editor).getByLabelText('What I did')
    await user.clear(didField)
    await user.type(didField, 'I organised the weekly meetings.')
    expect(
      screen.getByText('I organised the weekly meetings.', { selector: 'p' }),
    ).toBeInTheDocument()
    expect(window.localStorage.getItem('portfolio-content')).toContain(
      'I organised the weekly meetings.',
    )

    await user.click(within(editor).getByRole('button', { name: 'Add achievement' }))
    expect(screen.getByText('New achievement', { selector: 'h3' })).toBeInTheDocument()

    await user.click(within(editor).getByRole('tab', { name: 'Data' }))
    await user.click(within(editor).getByRole('button', { name: 'Reset all changes' }))
    await user.click(within(editor).getByRole('button', { name: 'Yes, reset everything' }))
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent("Hello, I'm Your Name.")
    expect(screen.queryByText('New achievement', { selector: 'h3' })).not.toBeInTheDocument()

    await user.click(within(editor).getByRole('button', { name: 'Close site editor' }))
    expect(screen.queryByRole('dialog', { name: 'Site editor' })).not.toBeInTheDocument()
  })

  it('edits any text inline and styles it with the inspector', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Edit page' }))
    expect(screen.getByRole('region', { name: 'Edit mode' })).toBeInTheDocument()

    const heading = screen.getByText('The story is still being written.', { selector: 'h2' })
    expect(heading).toHaveAttribute('contenteditable', 'true')
    await user.click(heading)
    heading.textContent = 'My journey so far.'
    fireEvent.blur(heading)
    await user.click(screen.getByRole('button', { name: 'Larger text' }))
    await user.click(screen.getByRole('button', { name: 'Bold' }))

    const saved = JSON.parse(window.localStorage.getItem('portfolio-content') ?? '{}')
    expect(saved.copy.journeyHeading).toBe('My journey so far.')
    expect(saved.styles['copy.journeyHeading']).toEqual({ scale: 1.1, bold: true })

    await user.click(screen.getByRole('button', { name: 'Done' }))
    const finished = screen.getByText('My journey so far.', { selector: 'h2' })
    expect(finished).not.toHaveAttribute('contenteditable')
    expect(finished).toHaveStyle({ fontWeight: '700' })
  })

  it('replaces placeholder pictures with uploaded images', async () => {
    const user = userEvent.setup()
    render(<App />)

    expect(screen.queryAllByLabelText('Upload picture for Picture one')).toHaveLength(0)
    await user.click(screen.getByRole('button', { name: 'Edit page' }))

    const file = new File(['<svg xmlns="http://www.w3.org/2000/svg"/>'], 'pattern.svg', { type: 'image/svg+xml' })
    await user.upload(screen.getAllByLabelText('Upload picture for Picture one')[0], file)

    expect(await screen.findByRole('img', { name: 'Picture one' })).toHaveAttribute(
      'src',
      expect.stringMatching(/^data:image\/svg\+xml/),
    )

    await user.click(screen.getAllByRole('button', { name: 'Remove picture for Picture one' })[0])
    expect(screen.queryByRole('img', { name: 'Picture one' })).not.toBeInTheDocument()
  })

  it('keeps the template credit fixed while editing', async () => {
    const user = userEvent.setup()
    render(<App />)

    const credit = screen.getByRole('link', { name: 'JustRadr' })
    expect(credit).toHaveAttribute('href', 'https://github.com/JustHackr')

    await user.click(screen.getByRole('button', { name: 'Edit page' }))
    const editingCredit = screen.getByRole('link', { name: 'JustRadr' })
    expect(editingCredit.closest('[contenteditable]')).toBeNull()
    expect(editingCredit.closest('[data-edit-path]')).toBeNull()
  })

  it('starts with placeholder content ready to personalise', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: "Hello, I'm Your Name." })).toBeInTheDocument()
    expect(screen.getByText('Project One', { selector: 'h3' })).toBeInTheDocument()
    expect(screen.getByText('Competition Name')).toBeInTheDocument()
  })
})
