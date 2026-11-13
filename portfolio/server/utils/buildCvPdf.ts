import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from 'pdf-lib'

export interface CvProfile {
  full_name?: string | null
  headline?: string | null
  summary?: string | null
  email?: string | null
  phone?: string | null
  linkedin_url?: string | null
  website_url?: string | null
  location?: string | null
}

export interface CvExp {
  company?: string | null
  role?: string | null
  location?: string | null
  start_date?: string | null
  end_date?: string | null
  bullets?: string[] | null
}

export interface CvProject {
  title?: string | null
  description?: string | null
  role?: string | null
  tech_stack?: string[] | null
}

export interface CvEdu {
  institution?: string | null
  degree?: string | null
  start_date?: string | null
  end_date?: string | null
  is_expected?: boolean | null
}

export interface CvCert {
  name?: string | null
  issuer?: string | null
  issued_date?: string | null
}

export interface CvData {
  profile: CvProfile
  experiences?: CvExp[] | null
  projects?: CvProject[] | null
  skills?: Record<string, string[] | null> | null
  education?: CvEdu[] | null
  certifications?: CvCert[] | null
}

export type TextMeasurer = (text: string) => number

const A4_W = 595.28
const A4_H = 841.89
const MARGIN = 54
const COLUMN_W = A4_W - 2 * MARGIN
const LEADING = 2
const MIN_FONT_SIZE = 1

/**
 * Wraps text using the supplied font measurement instead of character counts.
 * Long unbroken tokens are split at measured boundaries so URLs and pasted
 * content cannot extend past the printable column.
 */
export function wrapTextByWidth(
  text: string,
  maxWidth: number,
  measureText: TextMeasurer,
): string[] {
  if (!Number.isFinite(maxWidth) || maxWidth <= 0) {
    throw new RangeError('maxWidth must be greater than zero')
  }

  const paragraphs = text.replace(/\r\n?/g, '\n').split('\n')
  const lines: string[] = []

  for (const paragraph of paragraphs) {
    const words = paragraph.trim().split(/\s+/).filter(Boolean)
    if (words.length === 0) {
      lines.push('')
      continue
    }

    let current = ''
    for (const word of words) {
      const chunks = splitTokenByWidth(word, maxWidth, measureText)
      if (chunks.length > 1) {
        if (current) lines.push(current)
        lines.push(...chunks.slice(0, -1))
        current = chunks[chunks.length - 1] ?? ''
        continue
      }

      const candidate = current ? `${current} ${word}` : word
      if (current && measureText(candidate) > maxWidth) {
        lines.push(current)
        current = word
      } else {
        current = candidate
      }
    }

    if (current) lines.push(current)
  }

  return lines
}

function splitTokenByWidth(
  token: string,
  maxWidth: number,
  measureText: TextMeasurer,
): string[] {
  if (measureText(token) <= maxWidth) return [token]

  const chunks: string[] = []
  let current = ''
  for (const character of token) {
    const candidate = current + character
    if (current && measureText(candidate) > maxWidth) {
      chunks.push(current)
      current = character
    } else {
      current = candidate
    }
  }
  if (current) chunks.push(current)
  return chunks
}

const asText = (value: string | null | undefined): string =>
  typeof value === 'string' ? value.trim() : ''

const nonEmpty = (values: Array<string | null | undefined>): string[] =>
  values.map(asText).filter(Boolean)

const safeTextForFont = (value: string, font: PDFFont): string => {
  const characterSet = new Set(font.getCharacterSet())
  return [...value]
    .map((character) => {
      if (character === '\n' || character === '\t') return character === '\t' ? ' ' : character
      const codePoint = character.codePointAt(0)
      return codePoint !== undefined && characterSet.has(codePoint) ? character : '?'
    })
    .join('')
}

const year = (value: string | null | undefined): string => {
  const match = asText(value).match(/^\d{4}/)
  return match?.[0] ?? ''
}

const dateRange = (start: string | null | undefined, end: string | null | undefined): string => {
  const startYear = year(start)
  const endYear = year(end)
  if (!startYear && !endYear) return ''
  return `${startYear || '?'} – ${endYear || 'Present'}`
}

class PdfCursor {
  public page: PDFPage
  private y: number
  private readonly addPage: () => PDFPage

  constructor(addPage: () => PDFPage) {
    this.addPage = addPage
    this.page = addPage()
    this.y = A4_H - MARGIN
  }

  private ensureSpace(height: number): void {
    if (this.y - height >= MARGIN) return
    this.page = this.addPage()
    this.y = A4_H - MARGIN
  }

  line(
    text: string,
    font: PDFFont,
    size: number,
    color: ReturnType<typeof rgb>,
    x = MARGIN,
    extraAfter = 0,
  ): void {
    const safeText = safeTextForFont(text, font)
    const measuredWidth = font.widthOfTextAtSize(safeText, size)
    const renderedSize = measuredWidth > COLUMN_W
      ? Math.max(MIN_FONT_SIZE, size * COLUMN_W / measuredWidth)
      : size
    const textHeight = font.heightAtSize(renderedSize)
    const lineHeight = textHeight + LEADING + extraAfter

    this.ensureSpace(lineHeight)
    this.page.drawText(safeText, {
      x,
      y: this.y - textHeight,
      size: renderedSize,
      font,
      color,
    })
    this.y -= lineHeight
  }

  wrapped(
    value: string,
    font: PDFFont,
    size: number,
    color: ReturnType<typeof rgb>,
    maxWidth = COLUMN_W,
    x = MARGIN,
    extraAfter = 0,
  ): void {
    const safeValue = safeTextForFont(value, font)
    const lines = wrapTextByWidth(
      safeValue,
      maxWidth,
      (line) => font.widthOfTextAtSize(line, size),
    )

    for (const line of lines) {
      if (line) this.line(line, font, size, color, x, extraAfter)
      else this.advance(font.heightAtSize(size) + LEADING)
    }
  }

  bullet(
    value: string,
    font: PDFFont,
    size: number,
    color: ReturnType<typeof rgb>,
  ): void {
    const prefix = '• '
    const prefixWidth = font.widthOfTextAtSize(prefix, size)
    const lines = wrapTextByWidth(
      safeTextForFont(value, font),
      COLUMN_W - prefixWidth,
      (line) => font.widthOfTextAtSize(line, size),
    )

    lines.forEach((line, index) => {
      this.line(
        `${index === 0 ? prefix : ' '.repeat(prefix.length)}${line}`,
        font,
        size,
        color,
        MARGIN,
        1,
      )
    })
  }

  advance(amount: number): void {
    if (amount <= 0) return
    this.ensureSpace(amount)
    this.y -= amount
  }

  rule(color: ReturnType<typeof rgb>): void {
    this.ensureSpace(10)
    this.y -= 4
    this.page.drawLine({
      start: { x: MARGIN, y: this.y },
      end: { x: A4_W - MARGIN, y: this.y },
      thickness: 0.5,
      color,
    })
    this.y -= 6
  }
}

const drawSectionTitle = (
  cursor: PdfCursor,
  title: string,
  font: PDFFont,
  color: ReturnType<typeof rgb>,
): void => {
  cursor.wrapped(title, font, 12, color, COLUMN_W, MARGIN, 1)
}

/**
 * Creates a text-based CV. The cursor owns all page transitions, and every
 * line is measured before drawing, which keeps selectable text inside A4 bounds.
 */
export async function buildCvPdf(data: CvData): Promise<Uint8Array> {
  const document = await PDFDocument.create()
  const regular = await document.embedFont(StandardFonts.Helvetica)
  const bold = await document.embedFont(StandardFonts.HelveticaBold)
  const mono = await document.embedFont(StandardFonts.Courier)
  const black = rgb(0.13, 0.12, 0.28)
  const gray = rgb(0.26, 0.39, 0.49)
  const teal = rgb(0.18, 0.61, 0.59)
  const cursor = new PdfCursor(() => document.addPage([A4_W, A4_H]))
  const profile = data.profile ?? {}
  const fullName = asText(profile.full_name) || 'Curriculum Vitae'

  document.setTitle(`${fullName} — Curriculum Vitae`, { showInWindowTitleBar: true })
  document.setAuthor(fullName)
  document.setSubject('Curriculum Vitae')
  document.setKeywords(['CV', 'resume', 'portfolio'])
  document.setCreator('Nova Sugiantara Portfolio')
  document.setProducer('Nova Sugiantara Portfolio')
  document.setCreationDate(new Date(0))
  document.setModificationDate(new Date(0))

  const headline = asText(profile.headline)
  if (fullName !== 'Curriculum Vitae') cursor.wrapped(fullName, bold, 24, black, COLUMN_W, MARGIN, 2)
  if (headline) cursor.wrapped(headline, regular, 11, gray, COLUMN_W, MARGIN, 2)

  const contacts = nonEmpty([
    profile.email,
    profile.location,
    profile.phone,
    profile.linkedin_url,
    profile.website_url,
  ])
  if (contacts.length) cursor.wrapped(contacts.join('  ·  '), mono, 8, gray, COLUMN_W, MARGIN, 4)
  cursor.rule(gray)

  const summary = asText(profile.summary)
  if (summary) {
    drawSectionTitle(cursor, 'Professional Summary', bold, black)
    cursor.wrapped(summary, regular, 9, black, COLUMN_W, MARGIN, 1)
    cursor.advance(4)
    cursor.rule(gray)
  }

  const skillEntries = Object.entries(data.skills ?? {})
    .map(([category, names]) => [asText(category), nonEmpty(names ?? [])] as const)
    .filter(([category, names]) => category && names.length)
  if (skillEntries.length) {
    drawSectionTitle(cursor, 'Technical Skills', bold, black)
    for (const [category, names] of skillEntries) {
      cursor.wrapped(`${category}: ${names.join(', ')}`, regular, 9, gray, COLUMN_W, MARGIN, 1)
    }
    cursor.advance(4)
    cursor.rule(gray)
  }

  const experiences = (data.experiences ?? []).filter((experience) =>
    asText(experience.company) || asText(experience.role) || (experience.bullets ?? []).some(asText),
  )
  if (experiences.length) {
    drawSectionTitle(cursor, 'Professional Experience', bold, black)
    for (const experience of experiences) {
      const company = asText(experience.company)
      const range = dateRange(experience.start_date, experience.end_date)
      const companyLine = [company, range].filter(Boolean).join(' — ')
      if (companyLine) cursor.wrapped(companyLine, bold, 10, teal, COLUMN_W, MARGIN, 1)
      if (asText(experience.role)) cursor.wrapped(asText(experience.role), regular, 9, black, COLUMN_W, MARGIN, 1)
      if (asText(experience.location)) cursor.wrapped(asText(experience.location), regular, 8, gray, COLUMN_W, MARGIN, 1)
      for (const bullet of experience.bullets ?? []) {
        if (asText(bullet)) cursor.bullet(asText(bullet), regular, 9, gray)
      }
      cursor.advance(2)
    }
    cursor.rule(gray)
  }

  const projects = (data.projects ?? []).filter((project) =>
    asText(project.title) || asText(project.description) || (project.tech_stack ?? []).some(asText),
  )
  if (projects.length) {
    drawSectionTitle(cursor, 'Selected Projects', bold, black)
    for (const project of projects) {
      const title = asText(project.title)
      const role = asText(project.role)
      const technologies = nonEmpty(project.tech_stack ?? [])
      const projectHeading = [title, role].filter(Boolean).join(' — ')
      if (projectHeading) cursor.wrapped(projectHeading, bold, 9, gray, COLUMN_W, MARGIN, 1)
      if (technologies.length) cursor.wrapped(`Stack: ${technologies.join(', ')}`, mono, 8, gray, COLUMN_W, MARGIN, 1)
      if (asText(project.description)) cursor.wrapped(asText(project.description), regular, 9, black, COLUMN_W, MARGIN, 1)
      cursor.advance(2)
    }
    cursor.advance(2)
    cursor.rule(gray)
  }

  const education = (data.education ?? []).filter((item) => asText(item.institution) || asText(item.degree))
  if (education.length) {
    drawSectionTitle(cursor, 'Education', bold, black)
    for (const item of education) {
      const degree = asText(item.degree)
      const institution = asText(item.institution)
      const expected = item.is_expected ? ' (Expected)' : ''
      const range = dateRange(item.start_date, item.end_date)
      const educationLine = [degree ? `${degree}${expected}` : '', institution, range]
        .filter(Boolean)
        .join(' — ')
      if (educationLine) cursor.wrapped(educationLine, regular, 9, black, COLUMN_W, MARGIN, 1)
    }
    cursor.advance(4)
    cursor.rule(gray)
  }

  const certifications = (data.certifications ?? []).filter((item) => asText(item.name) || asText(item.issuer))
  if (certifications.length) {
    drawSectionTitle(cursor, 'Certifications', bold, black)
    for (const certification of certifications) {
      const date = year(certification.issued_date)
      cursor.wrapped(
        [asText(certification.name), asText(certification.issuer), date].filter(Boolean).join(' — '),
        regular,
        9,
        gray,
        COLUMN_W,
        MARGIN,
        1,
      )
    }
  }

  return document.save()
}
