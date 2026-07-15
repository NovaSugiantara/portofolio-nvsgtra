import { marked } from 'marked'
import sanitizeHtml from 'sanitize-html'

export function renderSanitizedMarkdown(md: string): string {
  const html = marked.parse(md, { async: false }) as string
  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      'img', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'pre', 'code', 'blockquote', 'hr', 'br',
    ]),
    allowedAttributes: {
      a: ['href', 'target', 'rel'],
      img: ['src', 'alt', 'width', 'height', 'loading'],
      code: ['class'],
    },
    // no script handlers or event attributes allowed (default)
  })
}
