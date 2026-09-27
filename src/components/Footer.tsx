import { Editable } from './Editable'

export const TEMPLATE_CREDIT = {
  author: 'JustRadr',
  url: 'https://github.com/JustHackr',
}

export function Footer() {
  return (
    <footer className="site-footer section-shell">
      <div>
        <Editable as="strong" path="profile.fullName" />
        <Editable path="copy.footerMeta" />
      </div>
      <Editable as="p" path="copy.footerMotto" />
      <Editable path="copy.footerCopyright" />
      <p className="template-credit">
        Portfolio template by{' '}
        <a href={TEMPLATE_CREDIT.url} target="_blank" rel="noreferrer">
          {TEMPLATE_CREDIT.author}
        </a>
      </p>
    </footer>
  )
}
