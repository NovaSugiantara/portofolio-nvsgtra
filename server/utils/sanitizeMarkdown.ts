import { marked } from 'marked'
import sanitizeHtml from 'sanitize-html'

const ALLOWED_MARKDOWN_TAGS = [
  'p', 'br', 'strong', 'em', 'del', 's', 'blockquote',
  'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'pre', 'code', 'hr', 'a', 'img',
  'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
]

export function renderSanitizedMarkdown(md: string): string {
  if (md.length > 100_000) {
    throw new Error('Markdown content exceeds the maximum length')
  }

  const html = marked.parse(md, { async: false, gfm: true }) as string
  return sanitizeHtml(html, {
    allowedTags: ALLOWED_MARKDOWN_TAGS,
    allowedAttributes: {
      a: ['href', 'title', 'target', 'rel'],
      img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
      code: ['class'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    allowedSchemesByTag: {
      a: ['http', 'https', 'mailto'],
      img: ['https'],
    },
    allowProtocolRelative: false,
    disallowedTagsMode: 'discard',
    transformTags: {
      a: (tagName, attributes) => ({
        tagName,
        attribs: {
          ...attributes,
          rel: 'noopener noreferrer nofollow',
          target: '_blank',
        },
      }),
    },
  })
}
