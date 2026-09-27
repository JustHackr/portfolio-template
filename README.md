# Portfolio Template

A clean, Apple-inspired student portfolio with a built-in visual editor. Click any text to change it, upload your own pictures, reorder projects and achievements, and pick your accent colour — no coding needed.

## Sections

- **Home** — name, introduction, and a quick profile strip
- **Academics** — tabbed subjects, each with a project, reflection, and skills
- **Projects** — cards with picture slots and an optional "Why I built this" drawer
- **Achievements** — filterable, expandable milestones
- **My Journey** — a space for what comes next

There's also a guided **presentation mode** for walking someone through the page.

## Getting started

```bash
npm install
npm run dev
```

Open the local address it prints, then press the **pencil** button in the top bar.

## Editing your portfolio

- **Click any text** to edit it in place. A small toolbar lets you resize, bold, italicise, recolour, or hide it.
- **Open site editor** (in the bottom bar) to edit your profile, add or remove subjects, projects, and achievements, and change the accent colour.
- **Add picture** buttons appear on every picture placeholder while editing. Pictures are compressed automatically.

Edits are saved in your browser only. To make them part of the site for everyone:

1. In the site editor, open the **Data** tab and export your content.
2. Save the downloaded file as `src/published-content.json`.
3. Rebuild and deploy (`npm run build`, or push to a host like Vercel or Netlify).

To hide the pencil button on a device, visit your site with `?noedit` at the end of the address. Use `?edit` to bring it back.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the local editor |
| `npm run build` | Build the site into `dist/` |
| `npm test` | Run the test suite |

## Credit

Template by [JustRadr](https://github.com/JustHackr). The footer credit is part of the template — please keep it.
