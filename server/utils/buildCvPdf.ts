import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

interface CvProfile { full_name: string; headline: string; summary?: string | null; email?: string | null; phone?: string | null; linkedin_url?: string | null; website_url?: string | null; location?: string | null }
interface CvExp { company: string; role: string; start_date: string; end_date?: string | null; bullets?: string[] }
interface CvProject { title: string; description?: string | null; tech_stack?: string[] }
interface CvEdu { institution: string; degree: string; start_date?: string | null; end_date?: string | null; is_expected?: boolean }
interface CvCert { name: string; issuer: string }

export interface CvData {
  profile: CvProfile
  experiences: CvExp[]
  projects: CvProject[]
  skills: Record<string, string[]>
  education: CvEdu[]
  certifications: CvCert[]
}

const A4_W = 595.28
const A4_H = 841.89
const MARGIN = 54
const LINE_H = 13
const COL_W = A4_W - 2 * MARGIN
const MAX_CHARS = Math.floor(COL_W / 5.5) // ~90 chars for 10pt Helvetica

function wrap(text: string): string[] {
  const lines: string[] = []
  let cur = ''
  for (const w of text.split(' ')) {
    if ((cur + ' ' + w).trim().length > MAX_CHARS) {
      lines.push(cur)
      cur = w
    } else {
      cur = cur ? cur + ' ' + w : w
    }
  }
  if (cur) lines.push(cur)
  return lines
}

export async function buildCvPdf(data: CvData): Promise<Uint8Array> {
  const doc = await PDFDocument.create()
  const f = await doc.embedFont(StandardFonts.Helvetica)
  const b = await doc.embedFont(StandardFonts.HelveticaBold)
  const m = await doc.embedFont(StandardFonts.Courier)
  const black = rgb(0.13, 0.12, 0.28) // #321E48
  const gray = rgb(0.26, 0.39, 0.49)  // #43637E
  const teal = rgb(0.18, 0.61, 0.59)  // #2D9C96

  let page = doc.addPage([A4_W, A4_H])
  let y = A4_H - MARGIN

  const tb = (h: number) => { y -= h }
  const hr = () => { y -= 4; page.drawLine({ start: { x: MARGIN, y }, end: { x: A4_W - MARGIN, y }, thickness: 0.5, color: gray }); y -= 6 }
  const t = (text: string, size = 10, bold = false, color = black, monof = false, extra = 0) => {
    const font = monof ? m : bold ? b : f
    page.drawText(text, { x: MARGIN, y, size, font, color })
    y -= size * 1.35 + extra
  }

  // --- Header ---
  t(data.profile.full_name, 24, true, black, false, 2)
  t(data.profile.headline, 11, false, gray, false, 2)

  const contacts = [
    data.profile.email, data.profile.location, data.profile.phone,
  ].filter(Boolean).join('  ·  ')
  if (contacts) t(contacts, 8, false, gray, false, 4)
  hr()

  // --- Summary ---
  if (data.profile.summary) {
    t('Professional Summary', 12, true, black)
    for (const line of wrap(data.profile.summary)) t(line, 9)
    tb(4)
    hr()
  }

  // --- Skills ---
  t('Technical Skills', 12, true, black)
  for (const [cat, names] of Object.entries(data.skills)) {
    if (names.length === 0) continue
    t(`${cat}: ${names.join(', ')}`, 9, false, gray)
  }
  tb(4)
  hr()

  // --- Experience ---
  t('Professional Experience', 12, true, black)
  for (const exp of data.experiences) {
    const yrs = `${exp.start_date?.slice(0, 4)} – ${exp.end_date?.slice(0, 4) ?? 'Present'}`
    t(`${exp.company} — ${yrs}`, 10, true, teal)
    t(exp.role, 9, false, black)
    for (const bullet of exp.bullets ?? []) {
      for (const line of wrap(bullet)) t(`  • ${line}`, 9, false, gray, false, 1)
    }
    tb(2)
  }
  hr()

  // --- Projects --- (only top 6 to fit)
  t('Selected Projects', 12, true, black)
  for (const proj of data.projects.slice(0, 6)) {
    const tech = (proj.tech_stack ?? []).join(', ')
    t(`${proj.title}  —  ${tech}`, 9, false, gray, false, 1)
  }
  tb(4)
  hr()

  // --- Education ---
  t('Education', 12, true, black)
  for (const edu of data.education) {
    const note = edu.is_expected ? '(Expected)' : ''
    t(`${edu.degree}${note ? ' ' + note : ''}  —  ${edu.institution}`, 9)
  }
  tb(4)
  hr()

  // --- Certifications ---
  if (data.certifications.length) {
    t('Certifications', 12, true, black)
    for (const cert of data.certifications) {
      t(`${cert.name}  —  ${cert.issuer}`, 9, false, gray)
    }
  }

  return await doc.save()
}
