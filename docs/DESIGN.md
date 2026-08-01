# Design Specification

## Nova Sugiantara Portfolio

**Document status:** Draft for implementation  
**Primary owners:** Product design and frontend engineering  
**Product type:** Professional software engineering portfolio  
**Last updated:** 29 July 2026

This document defines the user experience, information architecture, visual system, responsive behavior, component rules, interaction states, accessibility requirements, and design constraints for Nova Sugiantara's portfolio website.

The specification is intentionally content first. It prioritizes evidence of engineering work, individual contribution, technical judgment, production responsibility, and collaboration over decorative presentation.

Implementation details such as complete CSS, framework configuration, and component source code are outside this document and should be maintained in the supporting engineering documentation listed in Section 18.

---

## 1. Design Objectives

The portfolio must help a visitor evaluate Nova quickly and with minimal interpretation.

### 1.1 Primary objectives

1. Establish Nova's professional identity within the first visible screen.
2. Communicate a clear technical focus without relying on a long technology list.
3. Make selected projects and professional experience easy to scan.
4. Distinguish Nova's individual contribution from team outcomes.
5. Present technical decisions, constraints, and trade offs in a credible way.
6. Provide direct access to the résumé and contact methods.
7. Remain readable, accessible, and functional across common device sizes and input methods.

### 1.2 Experience target

The product should feel:

1. Professional
2. Calm
3. Technical
4. Content first
5. Modern
6. Restrained
7. Readable
8. Credible

The interface should not resemble a creative agency landing page, a decorative developer theme, or a résumé template filled with generic claims.

### 1.3 Success indicators

The design is successful when a first time visitor can answer the following questions without opening more than one page:

1. Who is Nova?
2. What kind of software work does Nova do?
3. Which projects best demonstrate that work?
4. What did Nova personally contribute?
5. How can Nova be contacted?

### 1.4 Major design decision

| Item | Specification |
| --- | --- |
| Decision | Use a content first portfolio structure with projects and experience as the primary evidence. |
| Rationale | Recruiters and engineering leaders need verifiable context more than visual novelty. |
| User benefit | Visitors can assess relevance and competence with less scrolling and interpretation. |
| Trade off | The site may appear less visually expressive than design focused portfolios. |
| Implementation consideration | Decorative elements must never compete with project summaries, outcomes, or navigation. |

---

## 2. Audience and User Goals

### 2.1 Primary audiences

| Audience | Main question | Required evidence |
| --- | --- | --- |
| Technical recruiter | Does Nova match the role and technology requirements? | Role summary, skills, experience, résumé, location, availability |
| Engineering manager | Can Nova contribute safely to production systems? | Project decisions, ownership, debugging, testing, maintainability, collaboration |
| Startup founder | Can Nova translate business needs into working software? | Product context, scope ownership, practical trade offs, delivery outcomes |
| Product manager | Can Nova work effectively across disciplines? | Requirement clarification, collaboration, delivery context, product impact |
| Potential client | Can Nova solve this type of problem reliably? | Relevant projects, role boundaries, process, contact path |
| Software engineer | Is the work technically credible? | Architecture context, constraints, decisions, lessons learned |

### 2.2 User goals

Visitors should be able to:

1. Understand Nova's role within five to ten seconds.
2. Identify primary areas of technical work.
3. Scan selected projects without opening every case study.
4. Review professional experience chronologically.
5. Inspect detailed project reasoning when needed.
6. Download or open the résumé.
7. Reach Nova through a clear contact method.

### 2.3 Reading modes

The design must support two common reading modes.

| Mode | Behavior | Design response |
| --- | --- | --- |
| Fast evaluation | Scans headings, project titles, roles, dates, and outcomes | Strong headings, concise summaries, visible metadata, predictable layout |
| Detailed evaluation | Reads case studies, decisions, trade offs, and lessons | Narrow reading measure, structured sections, anchored navigation, meaningful captions |

---

## 3. Scope

### 3.1 Included pages

1. Home
2. About
3. Experience
4. Projects
5. Project detail or case study
6. Skills
7. Résumé
8. Contact

### 3.2 Included global capabilities

1. Responsive navigation
2. Light and dark themes
3. Résumé access
4. Project filtering only when the number of projects justifies it
5. Accessible contact form or direct contact links
6. Semantic metadata and social preview support
7. Reduced motion support

### 3.3 Explicitly excluded

The following are not part of the initial product scope:

1. CV builder
2. Blog publishing platform
3. Client portal
4. User authentication
5. Content management system
6. Real time chat
7. Visitor analytics dashboard
8. Public comments
9. Decorative command line interface
10. Automatically generated testimonials or metrics

### 3.4 Future scope rule

A new feature may be added only when it supports a documented visitor goal. Features must not be introduced solely to make the portfolio appear more technically complex.

---

## 4. Design Principles

### 4.1 Evidence before claims

The interface should show projects, responsibilities, decisions, and outcomes before broad statements about ability.

### 4.2 Clarity before novelty

Navigation, content order, and component behavior should follow familiar patterns. A visitor should not need to learn how the portfolio works.

### 4.3 Contribution before technology

Technology labels provide context but do not prove impact. Project cards and case studies should prioritize the problem, role, contribution, and outcome.

### 4.4 Restraint creates credibility

Visual emphasis should be limited. Color, type scale, spacing, and motion must support hierarchy rather than decorate every section.

### 4.5 Accessibility is a release requirement

Accessibility requirements are testable acceptance criteria, not optional recommendations.

### 4.6 Progressive disclosure

Summary pages should provide enough information to make a decision. Detailed technical context belongs in case studies and expanded sections.

### 4.7 Major design decisions

| Decision | Rationale | User benefit | Trade off | Implementation consideration |
| --- | --- | --- | --- | --- |
| Keep the primary navigation conventional | Familiar navigation reduces orientation cost | Visitors reach relevant content quickly | Less opportunity for unconventional presentation | Use clear text labels and visible active states |
| Use projects and experience as the strongest visual sections | These sections provide the most credible evidence | Evaluation is faster and more reliable | About and skills receive less visual prominence | Maintain balanced spacing but stronger project hierarchy |
| Limit decorative motion | Continuous animation distracts from technical content | Better readability and lower motion sensitivity risk | Fewer visual spectacle moments | Use motion only for state changes and feedback |
| Use theme support without changing information hierarchy | Theme is a preference, not a separate design concept | Consistent experience in both modes | More token validation and testing | Test every component in both themes |

---

## 5. Information Architecture

### 5.1 Primary navigation

Recommended order:

1. Home
2. Projects
3. Experience
4. About
5. Contact
6. Résumé

Skills may be a homepage and About section rather than a primary navigation destination. A dedicated Skills page is acceptable when it contains explanatory capability groups rather than only a list of technologies.

### 5.2 Sitemap

```text
Home
├── Selected Projects
│   └── Project Detail
├── Experience Preview
├── Capabilities
└── Contact Callout

Projects
└── Project Detail

Experience
About
Skills
Résumé
Contact
```

### 5.3 Homepage information order

1. Professional identity
2. Value proposition
3. Selected projects
4. Experience preview
5. Core capabilities
6. Engineering approach preview
7. Contact callout

### 5.4 Navigation behavior

| Context | Required behavior |
| --- | --- |
| Desktop | Display primary navigation, résumé action, and optional theme control in one row |
| Tablet | Preserve visible navigation while space allows; otherwise use compact navigation |
| Mobile | Use a menu button that opens an accessible navigation panel |
| Current page | Indicate the current destination with more than color alone |
| Keyboard | Preserve logical tab order and return focus to the menu trigger after closing |

### 5.5 URL expectations

Use predictable paths:

```text
/
/about
/experience
/projects
/projects/[slug]
/skills
/resume
/contact
```

Project slugs should remain stable after publication.

---

## 6. Page Specifications

### 6.1 Home

#### Purpose

Provide a concise professional overview and route visitors toward project evidence, experience, the résumé, or contact.

#### Required sections

1. Header
2. Hero
3. Selected projects
4. Experience preview
5. Core capabilities
6. Engineering approach preview
7. Contact callout
8. Footer

#### Hero requirements

The hero must include:

1. Professional role
2. Clear headline
3. Summary of approximately 40 to 80 words
4. Primary action to view projects
5. Secondary action to view the résumé or contact Nova
6. Optional portrait

The hero should not consume the full desktop viewport. At a common laptop height, the start of the selected projects section should be visible or clearly implied.

#### Selected projects requirements

Display three or four projects. Each card must communicate:

1. Project title
2. Project category
3. Problem or business context
4. Nova's role
5. Main contribution
6. Outcome when verified
7. Limited technology context
8. Case study action

#### Experience preview requirements

Show the most relevant recent roles with:

1. Company
2. Role
3. Period
4. One sentence scope summary
5. One or two selected contributions
6. Link to the full experience page

### 6.2 About

#### Purpose

Explain Nova's professional background, engineering approach, working style, and values without repeating the résumé.

#### Required sections

1. Professional introduction
2. Career context
3. Engineering principles
4. Problem solving approach
5. Collaboration style
6. Production responsibility
7. Personal notes relevant to working style
8. Contact or résumé action

The About page should not contain unsupported personality claims or an extensive personal biography.

### 6.3 Experience

#### Purpose

Show professional progression, scope, ownership, and relevant contributions.

#### Experience item structure

1. Company
2. Role
3. Employment type when useful
4. Period
5. Location or remote context when useful
6. Scope summary
7. Selected contributions
8. Technology context
9. Related projects when public

Contribution statements should be specific and verifiable. Avoid generic statements such as “worked on multiple projects.”

### 6.4 Projects

#### Purpose

Allow visitors to compare relevant work and choose which case studies to inspect.

#### Required behavior

1. Show project cards in a responsive grid or vertical list.
2. Keep the initial ordering curated rather than alphabetical.
3. Use filters only when there are at least six projects and categories improve discovery.
4. Preserve full card meaning without hover.
5. Clearly distinguish public, private, internal, and conceptual work where applicable.

#### Empty or limited portfolio state

When fewer than three public projects are available, use a curated list with deeper summaries. Do not create fictional projects to fill the layout.

### 6.5 Project detail

#### Purpose

Present the problem, Nova's contribution, technical reasoning, and verified outcome in enough detail for professional evaluation.

The detailed structure is defined in Section 13.

### 6.6 Skills

#### Purpose

Explain practical capabilities and technology experience in context.

#### Recommended groups

1. Backend engineering
2. Frontend development
3. Databases and caching
4. APIs and integrations
5. Infrastructure and deployment
6. Testing and code quality
7. Developer tooling

Each group should include a concise explanation of how the capability is applied. Do not use percentages, stars, proficiency bars, or unsupported labels such as “expert.”

### 6.7 Résumé

#### Purpose

Provide a recruiter friendly summary and access to the current résumé file.

#### Required elements

1. Short professional summary
2. Core capabilities
3. Experience summary
4. Education
5. Certifications when applicable
6. Languages when relevant
7. Download or open résumé action
8. File format and last updated date

The web summary must remain useful if the file download is unavailable.

### 6.8 Contact

#### Purpose

Make professional contact straightforward and set clear expectations.

#### Required elements

1. Direct introduction
2. Preferred communication method
3. Email
4. LinkedIn
5. GitHub
6. Location or timezone when relevant
7. Availability statement
8. Response expectation
9. Optional contact form

The page must not imply immediate availability unless that information is current.

---

## 7. Layout System

### 7.1 Containers

| Context | Maximum width | Notes |
| --- | ---: | --- |
| General page content | 1280px | Used for navigation, project grids, and broad sections |
| Standard content | 1120px | Preferred for most page sections |
| Long form reading | 720px | Used for case study narrative and About content |
| Compact form | 640px | Used for contact and narrow task flows |

### 7.2 Horizontal spacing

| Viewport range | Page gutter |
| --- | ---: |
| Mobile | 20px |
| Tablet | 32px |
| Desktop | 48px |
| Large desktop | 64px maximum |

Gutters may use fluid sizing between ranges. Content must not touch the viewport edge.

### 7.3 Vertical rhythm

| Element | Mobile | Desktop |
| --- | ---: | ---: |
| Major section spacing | 64px | 96px to 120px |
| Section heading to content | 24px | 32px |
| Card internal spacing | 20px | 24px to 28px |
| Paragraph spacing | 16px | 16px to 20px |
| Related control spacing | 8px to 12px | 8px to 16px |

### 7.4 Grid behavior

Use flexible layouts based on content density.

1. Project cards may use one, two, or three columns.
2. Experience content should use a readable vertical list rather than a decorative timeline by default.
3. Case studies should use a single reading column with optional metadata beside it on wide screens.
4. Contact content should remain narrow enough for easy form completion.
5. Do not force all content into a twelve column grid when a simpler layout is more readable.

### 7.5 Major layout decision

| Item | Specification |
| --- | --- |
| Decision | Use flexible content layouts rather than a universal twelve column grid. |
| Rationale | Portfolio sections have different reading and comparison needs. |
| User benefit | Content remains readable and naturally grouped. |
| Trade off | The system has fewer globally identical alignment rules. |
| Implementation consideration | Use shared containers, spacing tokens, and responsive primitives to preserve consistency. |

---

## 8. Visual System

### 8.1 Visual hierarchy

Hierarchy should be created through:

1. Type size
2. Type weight
3. Spacing
4. Content order
5. Surface contrast
6. Limited accent color

Hierarchy should not depend on glow, animation, oversized badges, or multiple simultaneous accent treatments.

### 8.2 Surfaces

Use a small number of surface levels:

| Level | Intended use |
| --- | --- |
| Page background | Main application background |
| Primary surface | Cards, form areas, grouped content |
| Muted surface | Supporting metadata, callouts, code context, subtle section distinction |
| Inverse surface | Limited high contrast section or footer treatment |

### 8.3 Borders and shadows

1. Prefer subtle borders for component separation.
2. Use shadows only when they clarify elevation or interaction.
3. Project cards should not rely on large shadows in their default state.
4. Dark theme elevation should use surface contrast before heavy shadows.
5. Border radius should remain consistent and moderate.

Recommended radius categories:

| Token | Value range | Use |
| --- | ---: | --- |
| Small | 4px to 6px | Labels and compact controls |
| Medium | 8px to 10px | Buttons, fields, cards |
| Large | 12px to 16px | Large media containers only |

### 8.4 Iconography

Use a consistent line icon set when an icon improves recognition.

1. Icons must not replace visible text for primary navigation.
2. Decorative icons should be avoided.
3. Icon only buttons require accessible names and tooltips when meaning is not universally clear.
4. External links should indicate that they open a separate destination when useful.
5. Social links should use recognizable icons with visible or screen reader labels.

### 8.5 Photography and project media

#### Portrait

A portrait is optional. When included:

1. Use a natural, unfiltered image.
2. Use a consistent aspect ratio.
3. Use a rectangular or softly rounded container.
4. Keep the image secondary to the headline and summary.
5. Provide meaningful alternative text when the image conveys identity.
6. Do not add animated frames, duotone filters, floating badges, or decorative overlays.

#### Project media

1. Use real product screenshots when permission allows.
2. Crop screenshots to preserve relevant context.
3. Add captions that explain what the viewer should notice.
4. Label redacted or reconstructed screens clearly.
5. Do not use generic mockups as evidence of implemented work.

---

## 9. Typography

### 9.1 Font strategy

Use one primary sans serif family for headings and body copy. An optional monospace family may be used for technical metadata, code identifiers, and compact labels.

Recommended stack:

```text
Primary: Inter, system-ui, sans-serif
Monospace: JetBrains Mono, ui-monospace, monospace
```

A different high quality sans serif may be used, but headings and body should not use separate display families unless there is a clear readability benefit.

### 9.2 Type scale

| Style | Fluid size | Line height | Weight | Intended use |
| --- | --- | ---: | ---: | --- |
| Display | 40px to 56px | 1.08 to 1.15 | 650 to 700 | Homepage headline |
| Page title | 34px to 44px | 1.15 | 650 to 700 | Main page heading |
| Section title | 26px to 32px | 1.2 | 600 to 700 | Major sections |
| Card title | 19px to 22px | 1.3 | 600 | Project and experience titles |
| Body large | 18px to 20px | 1.6 | 400 | Hero summary and introductions |
| Body | 16px to 18px | 1.6 to 1.7 | 400 | Standard reading content |
| Small | 14px to 15px | 1.5 | 400 to 500 | Supporting information |
| Metadata | 12px to 14px | 1.4 to 1.5 | 500 to 600 | Dates, categories, compact labels |

### 9.3 Typography rules

1. Body text must not be smaller than 16px under normal zoom.
2. Long form content should remain within approximately 60 to 80 characters per line.
3. Do not use monospace for paragraphs.
4. Use sentence case for headings and controls.
5. Avoid all caps except for short technical abbreviations.
6. Use moderate heading weight; extra bold should not be the default.
7. Links in paragraphs must remain distinguishable without relying only on color.

### 9.4 Major typography decision

| Item | Specification |
| --- | --- |
| Decision | Use one primary sans serif family across headings and body. |
| Rationale | A unified type system supports calm hierarchy and reduces unnecessary visual branding. |
| User benefit | Reading remains consistent across summaries and case studies. |
| Trade off | The design has less typographic contrast than a multi family system. |
| Implementation consideration | Create hierarchy through size, weight, width, and spacing. |

---

## 10. Color and Theme

### 10.1 Source palette

The supplied palette is retained as a brand reference:

```text
#321E48
#43637E
#65DCD5
#D9FFF4
```

Neutral supporting colors are permitted because using the supplied palette for every surface would reduce hierarchy and may produce an overly tinted interface.

### 10.2 Semantic tokens

#### Light theme

| Token | Value | Purpose |
| --- | --- | --- |
| `background-primary` | `#FBFCFD` | Main page background |
| `background-secondary` | `#F3F6F8` | Alternate section background |
| `surface-primary` | `#FFFFFF` | Cards and form surfaces |
| `surface-muted` | `#F6FAF9` | Supporting content areas |
| `text-primary` | `#321E48` | Headings and primary body text |
| `text-secondary` | `#43637E` | Secondary copy and metadata |
| `text-muted` | `#5F7080` | Noncritical supporting text |
| `accent-primary` | `#1F7A75` | Primary actions and links |
| `accent-hover` | `#185F5B` | Hover and pressed emphasis |
| `accent-soft` | `#D9FFF4` | Subtle selected and callout background |
| `border-default` | `#DCE4E8` | Standard component border |
| `border-strong` | `#AAB8C2` | Emphasized separation |
| `focus-ring` | `#1F7A75` | Keyboard focus indication |
| `status-success` | `#216E4E` | Success text and indicators |
| `status-warning` | `#8A5700` | Warning text and indicators |
| `status-error` | `#B42318` | Error text and indicators |

#### Dark theme

| Token | Value | Purpose |
| --- | --- | --- |
| `background-primary` | `#21162C` | Main page background |
| `background-secondary` | `#291B36` | Alternate section background |
| `surface-primary` | `#321E48` | Cards and form surfaces |
| `surface-muted` | `#3A2850` | Supporting content areas |
| `text-primary` | `#D9FFF4` | Headings and primary body text |
| `text-secondary` | `#B7CAD7` | Secondary copy and metadata |
| `text-muted` | `#9FB4C3` | Noncritical supporting text |
| `accent-primary` | `#65DCD5` | Primary actions and links |
| `accent-hover` | `#83E7E1` | Hover emphasis |
| `accent-soft` | `#263F46` | Selected and callout background |
| `border-default` | `#4C3B5E` | Standard component border |
| `border-strong` | `#6A577D` | Emphasized separation |
| `focus-ring` | `#65DCD5` | Keyboard focus indication |
| `status-success` | `#7ED6A8` | Success text and indicators |
| `status-warning` | `#F2C66D` | Warning text and indicators |
| `status-error` | `#FF9B91` | Error text and indicators |

### 10.3 Accent usage

1. Accent color should identify actions, links, active states, and limited emphasis.
2. Accent color should not be used for large body text areas.
3. A section should normally contain one dominant accent action.
4. Technology labels should use neutral surfaces unless a selected state requires accent.
5. Status colors must be paired with text or icons.

### 10.4 Contrast validation

The following ratios have been calculated for the specified color pairs. Component level testing is still required because font size, font weight, opacity, and state styling can change conformance.

| Foreground | Background | Ratio | Intended use | Requirement | Status |
| --- | --- | ---: | --- | --- | --- |
| `#321E48` | `#FBFCFD` | 14.45:1 | Light theme primary text | WCAG AA normal text | Verified |
| `#43637E` | `#FBFCFD` | 6.15:1 | Light theme secondary text | WCAG AA normal text | Verified |
| `#5F7080` | `#FBFCFD` | 4.97:1 | Light theme muted text | WCAG AA normal text | Verified |
| `#FFFFFF` | `#1F7A75` | 5.12:1 | Light theme primary button text | WCAG AA normal text | Verified |
| `#321E48` | `#65DCD5` | 9.01:1 | Dark text on bright accent | WCAG AA normal text | Verified |
| `#D9FFF4` | `#321E48` | 13.82:1 | Dark theme primary text on surface | WCAG AA normal text | Verified |
| `#B7CAD7` | `#321E48` | 8.79:1 | Dark theme secondary text | WCAG AA normal text | Verified |
| `#9FB4C3` | `#321E48` | 6.92:1 | Dark theme muted text | WCAG AA normal text | Verified |
| `#D9FFF4` | `#3A2850` | 12.23:1 | Dark theme text on muted surface | WCAG AA normal text | Verified |

### 10.5 Theme behavior

1. Default to the user's system preference on the first visit.
2. Allow a manual theme selection.
3. Persist the manual selection locally.
4. Ensure the theme control has a visible label or accessible name.
5. Prevent a visible incorrect theme flash where practical.
6. Do not change layout, content order, or imagery meaning between themes.

---

## 11. Component Guidelines

### 11.1 Header

**Purpose:** Provide orientation and access to primary destinations.

**Content rules:**

1. Use “Nova Sugiantara” or a restrained text mark.
2. Keep link labels explicit.
3. Present Résumé as a distinct but not oversized action.
4. Do not include social links when they crowd primary navigation.

**Behavior:**

1. May remain sticky after the visitor scrolls.
2. Sticky state may use an opaque or nearly opaque surface with a subtle border.
3. Do not require glass blur.
4. Active destination must use text weight, underline, shape, or an equivalent noncolor indicator.

### 11.2 Mobile navigation

**Purpose:** Provide complete navigation within limited width.

**Content rules:** Preserve the same destinations as desktop.

**Behavior:**

1. Use a clearly labeled menu trigger.
2. Move focus into the open panel.
3. Keep focus within a modal panel when the rest of the page is inert.
4. Close on Escape.
5. Return focus to the trigger after closing.
6. Prevent background scrolling when using an overlay panel.

### 11.3 Buttons

Use no more than three variants.

| Variant | Purpose | Typical use |
| --- | --- | --- |
| Primary | Most important action in a section | View projects, send message |
| Secondary | Supporting action | View résumé, visit GitHub |
| Tertiary | Low emphasis navigation action | Read case study, view all experience |

**Content rules:**

1. Use specific verb led labels.
2. Avoid vague labels such as “Learn more” when a more precise destination is available.
3. Avoid placing two primary buttons beside each other.
4. Show an external destination indicator when useful.

### 11.4 Text links

1. Inline links must be visually distinguishable from body text.
2. Underlines may be persistent or appear through a strong noncolor treatment.
3. Link labels should describe the destination.
4. External links should not unexpectedly replace unsaved form state.

### 11.5 Project card

**Purpose:** Enable comparison and route to detailed evidence.

**Required content:**

1. Project title
2. Category or product type
3. Problem or context
4. Nova's role
5. Main contribution
6. Outcome when verified
7. Up to four technology labels when useful
8. Case study action

**Rules:**

1. The entire card may be clickable only when nested interactive controls are avoided.
2. Important content must remain visible without hover.
3. Do not place technology labels before the problem statement.
4. Use equal card height only when it does not create excessive empty space.
5. A screenshot is optional and must not replace the textual summary.

### 11.6 Experience item

**Purpose:** Communicate scope and progression.

**Required content:**

1. Company
2. Role
3. Period
4. Scope summary
5. Selected contributions
6. Technology context when relevant

Use a straightforward vertical layout. Decorative timeline connectors are optional and must not reduce readability.

### 11.7 Skill group

**Purpose:** Explain a capability area in context.

**Required content:**

1. Capability name
2. One sentence explanation
3. Relevant technologies
4. Optional related project link

Do not display rankings, percentages, stars, or years beside every technology.

### 11.8 Technology label

1. Use compact neutral styling.
2. Use sentence case or official product capitalization.
3. Avoid more than four labels in a summary card.
4. Full technology lists belong on detail pages.
5. Labels are metadata, not primary calls to action.

### 11.9 Case study navigation

1. Provide a link back to all projects.
2. Support anchored navigation only when the case study is long enough to justify it.
3. On desktop, anchored navigation may remain visible beside the reading column.
4. On mobile, use an inline contents list or compact disclosure.
5. Current section indication must not rely only on color.

### 11.10 Contact form

**Recommended fields:**

1. Name
2. Email
3. Message
4. Optional subject or inquiry type

**Rules:**

1. Keep the form short.
2. Use persistent visible labels.
3. Mark optional fields explicitly.
4. Validate after meaningful interaction or submission, not on every keystroke.
5. Preserve entered content after a recoverable error.
6. Show a clear submission result.
7. Provide a direct email alternative.

### 11.11 Footer

Include:

1. Name and role
2. Primary contact link
3. GitHub and LinkedIn
4. Copyright information
5. Optional theme control only when not already convenient elsewhere

Avoid repeating the full primary navigation and a large technology list unless testing shows a clear need.

### 11.12 Theme control

1. Show the current theme state.
2. Use a text label, accessible name, or segmented control.
3. Do not rely on sun and moon icons alone.
4. Preserve keyboard focus after the theme changes.
5. Announce the new state to assistive technology when necessary.

---

## 12. Interaction States

### 12.1 Shared state model

| State | Required treatment |
| --- | --- |
| Default | Complete content, sufficient contrast, no implied interaction without affordance |
| Hover | Subtle visual feedback for pointer users; must not reveal essential content |
| Focus visible | Clear outline with sufficient contrast and spacing from the component edge |
| Active or pressed | Immediate response through small color or position change |
| Current or selected | Persistent noncolor indicator and correct semantic state |
| Disabled | Reduced emphasis, unavailable cursor when appropriate, and semantic disabled state |
| Loading | Preserve layout, identify the affected action, prevent duplicate submission |
| Success | Clear confirmation text and optional icon |
| Warning | Explain the risk and available action |
| Error | Identify the problem, associate it with the relevant field or action, and provide recovery guidance |

### 12.2 Button states

| State | Specification |
| --- | --- |
| Default | Solid accent for primary, bordered or neutral surface for secondary, text treatment for tertiary |
| Hover | Darken or lighten within the same semantic role; optional 1px to 2px translation |
| Focus visible | 2px minimum focus ring with offset |
| Active | Remove translation and show pressed color |
| Disabled | Do not rely only on opacity; retain readable label |
| Loading | Keep label context, show progress, retain width, disable repeat activation |

### 12.3 Form states

| State | Specification |
| --- | --- |
| Default | Visible label, border, and input purpose |
| Hover | Slight border emphasis |
| Focus visible | Strong focus ring and border |
| Filled | Preserve label and entered value |
| Error | Error border, icon when useful, and adjacent explanatory message |
| Disabled | Visually distinct and semantically disabled |
| Success | Confirmation should appear near the completed action and receive appropriate focus or announcement |

### 12.4 Loading behavior

1. Prefer immediate navigation for static content.
2. Use skeleton placeholders only when content retrieval is genuinely delayed.
3. Avoid simulated loading animations.
4. Contact submission must show progress and prevent duplicate requests.
5. If a page fails to load, preserve navigation and provide a retry path.

---

## 13. Project Case Study Design

### 13.1 Required structure

Each published case study should contain:

1. Project summary
2. Business context
3. Problem
4. Constraints
5. Nova's role
6. Team context
7. Responsibilities
8. Technical approach
9. Important decisions
10. Trade offs
11. Challenges
12. Outcome
13. Verified metrics
14. Technologies
15. Lessons learned
16. Related links

### 13.2 Header composition

The case study header should show:

1. Project title
2. One sentence summary
3. Project type
4. Nova's role
5. Period
6. Status or confidentiality note
7. Primary visual when available

Technology should not be the largest element in the header.

### 13.3 Contribution clarity

Use explicit language to separate individual and team work.

| Meaning | Preferred language |
| --- | --- |
| Individual ownership | “I designed,” “I implemented,” “I investigated,” “I maintained” |
| Shared ownership | “I collaborated with,” “The team implemented,” “I contributed to” |
| Organizational outcome | “The product enabled,” “The change reduced,” “The workflow supported” |

Do not imply sole ownership of work completed by a team.

### 13.4 Decision records

Important technical decisions should use a compact structure:

| Field | Content |
| --- | --- |
| Context | What condition or constraint required a decision? |
| Options | Which practical alternatives were considered? |
| Decision | What was selected? |
| Rationale | Why was it selected? |
| Trade off | What limitation or cost was accepted? |
| Result | What was observed after implementation? |

### 13.5 Metrics

1. Publish only verified metrics.
2. Explain the measurement context when the number could be misinterpreted.
3. Use ranges when exact figures are confidential.
4. Label estimates as estimates.
5. When metrics are unavailable, describe the observable outcome without inventing a number.

### 13.6 Confidential work

When project details cannot be disclosed:

1. Describe the product category and problem without naming the client.
2. Remove confidential screenshots and identifiers.
3. Use generalized architecture diagrams only when accurate.
4. State that details have been limited for confidentiality.
5. Do not fabricate a replacement public project.

### 13.7 Reading experience

1. Keep narrative content within the long form reading width.
2. Use descriptive section headings.
3. Place diagrams and screenshots close to the related explanation.
4. Use captions to explain relevance.
5. Avoid large uninterrupted paragraphs.
6. Provide previous and next project navigation where useful.

---

## 14. Responsive Behavior

### 14.1 Reference ranges

Breakpoints are implementation tools rather than device labels. The following ranges describe expected behavior and may be adjusted when content requires it.

| Range | Approximate width | General behavior |
| --- | ---: | --- |
| Compact | Below 640px | Single column, mobile navigation, stacked actions |
| Medium | 640px to 959px | One or two columns, reduced navigation density |
| Wide | 960px to 1439px | Full navigation, two or three column project layouts |
| Large | 1440px and above | Increased outer whitespace, capped content width |

### 14.2 Global responsive rules

1. Content order must remain logical when layout columns collapse.
2. No required information may exist only in hover states.
3. Touch targets should remain approximately 44 by 44 pixels where practical.
4. Text should reflow at 200 percent zoom without loss of content or functionality.
5. Horizontal page scrolling is not permitted at common viewport widths.
6. Fixed heights should be avoided for text containing components.

### 14.3 Section behavior

| Section | Compact | Medium | Wide and large |
| --- | --- | --- | --- |
| Header | Menu trigger, name, optional résumé action | Compact visible links or menu based on fit | Full navigation and actions |
| Hero | Text first, portrait below or omitted, stacked actions | Text with optional image beside or below | Two column layout when portrait is present |
| Selected projects | One column | Two columns | Two or three columns based on card density |
| Experience | Single vertical list | Single vertical list | Optional metadata column plus content column |
| Capabilities | One column | Two columns | Two or three columns |
| Case study | Single column, inline contents | Single reading column | Reading column with optional side metadata |
| Contact | Single column, full width controls | Narrow centered form | Narrow form with supporting contact details |
| Footer | Stacked groups | Two groups | Two or three restrained groups |

### 14.4 Typography scaling

Use fluid scaling within safe limits. Headings must not force awkward single word lines or dominate compact screens.

### 14.5 Images

1. Use responsive image sources.
2. Define width and height to reduce layout shift.
3. Avoid loading large desktop media on compact screens when a smaller source is available.
4. Preserve the meaningful crop across sizes.
5. Project screenshots may become horizontally scrollable only when preserving interface detail is essential and the scroll container is labeled.

### 14.6 Tables, code, and technical content

1. Prefer stacked definition layouts on compact screens when tables become unreadable.
2. Wrap ordinary text inside cells.
3. Permit horizontal scrolling for genuinely tabular data, with visible affordance.
4. Wrap long identifiers where safe.
5. Code blocks may scroll horizontally and must remain keyboard accessible.

---

## 15. Motion Guidelines

### 15.1 Motion principles

1. Motion must communicate state, hierarchy, or continuity.
2. Motion must not delay access to content.
3. Continuous decorative animation is not permitted.
4. Essential information must not depend on animation.
5. Reduced motion preferences must be respected.

### 15.2 Timing guidance

| Interaction | Duration |
| --- | ---: |
| Hover feedback | 120ms to 180ms |
| Focus or state transition | 120ms to 180ms |
| Component opening or closing | 180ms to 240ms |
| Page transition | 200ms to 300ms maximum |
| Loading indicator | Based on actual request duration |

### 15.3 Allowed motion

1. Small color transitions
2. Small opacity transitions
3. Translation of approximately 1px to 4px for direct interaction feedback
4. Mobile menu opening and closing
5. Disclosure expansion
6. Form submission progress
7. Route transition that does not block reading

### 15.4 Prohibited motion

1. Persistent parallax
2. Animated gradients
3. Rotating borders
4. Floating decorative elements
5. Repeating glow pulses
6. Autoplay illustration movement
7. Scroll linked transformations for decoration
8. Large card tilt effects

### 15.5 Reduced motion

When `prefers-reduced-motion: reduce` is active:

1. Remove nonessential translation and scaling.
2. Use immediate or near immediate state changes.
3. Preserve loading and progress information without decorative movement.
4. Disable smooth scrolling when it interferes with user preference.

---

## 16. Accessibility Requirements

### 16.1 Semantic structure

1. Use one meaningful `h1` per page.
2. Preserve sequential heading levels.
3. Use `header`, `nav`, `main`, `section`, `article`, `aside`, and `footer` where appropriate.
4. Give multiple navigation regions distinct accessible labels.
5. Use lists for actual grouped items, not for visual indentation alone.

### 16.2 Keyboard access

1. Every interactive control must be reachable and operable by keyboard.
2. Focus order must follow the visual and reading order.
3. Focus must not become trapped except inside an intentional modal interaction.
4. Escape should close dismissible overlays.
5. A skip link must move focus to the main content.

### 16.3 Focus visibility

1. All interactive controls require a visible focus indicator.
2. The indicator should have at least a 2px visual thickness or equivalent clarity.
3. The indicator must remain visible against adjacent surfaces.
4. Focus styling must not be removed without an accessible replacement.

### 16.4 Color and contrast

1. Normal text must meet at least WCAG AA contrast.
2. Large text must meet the applicable WCAG AA threshold.
3. User interface boundaries and focus indicators must remain perceivable.
4. State must not be communicated by color alone.
5. Every theme and interaction state must be tested independently.

### 16.5 Forms

1. Every field must have a persistent label.
2. Instructions must appear before they are needed.
3. Required fields must be indicated in text.
4. Error messages must identify the problem and recovery action.
5. Errors must be programmatically associated with their fields.
6. Submission status must be announced to assistive technology.
7. Autofill and appropriate input purpose attributes should be supported.

### 16.6 Images and media

1. Informative images require concise meaningful alternative text.
2. Decorative images require empty alternative text.
3. Complex diagrams require an adjacent explanation or long description.
4. Captions must explain why a project screenshot matters, not merely repeat its filename.
5. Text should not be embedded in images when equivalent HTML can be used.

### 16.7 Links and controls

1. Link purpose should be understandable from its text or context.
2. Repeated “Read more” links should include accessible project context.
3. Icon only controls require accessible names.
4. External links and file downloads should be identified when the behavior may surprise the visitor.

### 16.8 Zoom and reflow

1. Content must remain usable at 200 percent browser zoom.
2. Text spacing overrides should not break the layout.
3. Horizontal scrolling should be limited to content that genuinely requires it, such as code or wide tables.
4. Sticky elements must not cover focused content.

### 16.9 Accessibility verification

Release testing must include:

1. Keyboard only navigation
2. Screen reader smoke test
3. Automated accessibility scan
4. Color contrast verification
5. 200 percent zoom test
6. Reduced motion test
7. Light and dark theme test
8. Mobile touch target review

Automated tests do not replace manual review.

---

## 17. Content Guidelines

### 17.1 Voice

Content should be:

1. Direct
2. Specific
3. Professional
4. Calm
5. Honest about scope and ownership

### 17.2 Preferred content pattern

Use:

```text
Context → Responsibility → Decision → Outcome
```

Example:

```text
The reservation workflow could not cancel one room within a multi room booking. I updated the backend cancellation flow and synchronization rules so property staff could cancel an individual booking detail without cancelling the complete reservation.
```

### 17.3 Avoided language

Do not use unsupported promotional language such as:

1. High tech
2. Striking
3. Premium
4. World class
5. Cutting edge
6. High energy
7. Sophisticated interplay
8. Immersive experience
9. Visually stunning
10. Rockstar
11. Ninja
12. Best in class

### 17.4 Project writing rules

1. Lead with the problem or product context.
2. State Nova's role explicitly.
3. Separate individual and team contributions.
4. Explain important constraints.
5. Include trade offs when they affected the result.
6. Publish metrics only when verified.
7. Avoid long technology inventories in summaries.
8. Explain acronyms on first use unless they are common to the target audience.

### 17.5 Interface writing

1. Button labels should describe the action.
2. Error messages should explain recovery.
3. Empty states should explain why no content is available and what can be done next.
4. Dates should use one consistent format.
5. Availability and response expectations must remain current.
6. Do not imply that a contact form submission succeeded until the system confirms it.

### 17.6 Content length guidance

| Content type | Recommended length |
| --- | --- |
| Hero headline | 5 to 12 words |
| Hero summary | 40 to 80 words |
| Project card summary | 35 to 70 words |
| Experience scope summary | 25 to 60 words |
| Capability description | 20 to 45 words |
| Contact introduction | 25 to 50 words |
| Case study section | As needed, divided into readable subsections |

---

## 18. Technical Boundaries

### 18.1 This document includes

1. Design objectives
2. Information architecture
3. Page structure
4. Layout rules
5. Visual direction
6. Semantic design tokens
7. Component purpose and behavior
8. Interaction states
9. Responsive expectations
10. Accessibility requirements
11. Acceptance criteria

### 18.2 This document does not include

1. Complete Tailwind configuration
2. Full CSS variable implementation
3. Framework specific component source code
4. JavaScript event handlers
5. Build tooling configuration
6. Deployment configuration
7. Analytics implementation
8. Content data schema details

### 18.3 Supporting documentation

Maintain implementation details in:

```text
DESIGN.md
CONTENT.md
ACCESSIBILITY.md
docs/design-tokens.md
docs/frontend-guidelines.md
docs/content-schema.md
```

### 18.4 Engineering constraints

1. Core content must remain usable without client side animation.
2. Navigation and contact paths must remain functional when optional scripts fail.
3. Images must be optimized and dimensioned to reduce layout shift.
4. Theme implementation must use semantic tokens rather than component specific color duplication.
5. Component APIs should preserve semantic HTML.
6. Third party scripts must not block primary content rendering.
7. Performance decisions must not remove accessible labels or states.

---

## 19. Design Acceptance Criteria

The design is ready for implementation when all criteria below are satisfied.

### 19.1 Information architecture

1. All eight scoped pages are represented.
2. Primary navigation labels are clear and consistent.
3. Projects and experience are visually prioritized over decoration.
4. Every page has a defined purpose and primary action.
5. No excluded product feature appears in the core design.

### 19.2 Homepage

1. Nova's name and role are visible in the initial viewport.
2. The hero contains no unsupported claim.
3. The project section begins without excessive scrolling on a common laptop viewport.
4. Three or four selected projects can be shown without technology labels dominating the cards.
5. Résumé and contact routes are discoverable.

### 19.3 Projects and experience

1. Every project card shows problem, role, contribution, and outcome context.
2. Every case study distinguishes individual from team contribution.
3. Metrics are verified, qualified, or omitted.
4. Confidential work is clearly labeled and safely generalized.
5. Experience items are readable without relying on a decorative timeline.

### 19.4 Components and states

1. Every interactive component has default, hover, focus visible, and active behavior.
2. Disabled, loading, success, warning, and error states are defined where applicable.
3. Essential content is not hidden behind hover.
4. Primary actions are visually distinct without competing with each other.
5. Contact form errors provide a recovery action.

### 19.5 Responsive design

1. Layouts are defined for compact, medium, wide, and large ranges.
2. Content order remains logical after columns collapse.
3. No common viewport produces unintended page level horizontal scrolling.
4. Buttons and fields remain usable on touch devices.
5. Long case study content preserves readable line length.

### 19.6 Accessibility

1. Keyboard navigation is complete.
2. Focus indicators are visible in both themes.
3. The heading structure is valid.
4. A skip link is included.
5. Form labels and errors are programmatically associated.
6. Verified color pairs meet their documented contrast targets.
7. Reduced motion behavior is defined and testable.
8. Images have appropriate alternative text behavior.
9. The interface remains usable at 200 percent zoom.
10. Automated and manual accessibility checks are planned.

### 19.7 Visual quality

1. The visual system uses semantic tokens.
2. Accent color is limited to meaningful emphasis.
3. The design does not use prohibited decorative effects.
4. Typography remains readable and moderately weighted.
5. Project media supports rather than replaces the written evidence.
6. Light and dark themes preserve the same hierarchy and meaning.

### 19.8 Content quality

1. Content is concise and specific.
2. Promotional clichés are removed.
3. Project descriptions follow context, responsibility, decision, and outcome.
4. Technology labels remain secondary.
5. Availability, contact details, and résumé information are current.

---

## 20. Future Considerations

The following may be considered after the core portfolio is complete and validated:

1. Project filtering when the portfolio contains enough work to create a discovery problem.
2. A writing section for technical articles when Nova has original material to publish.
3. A dedicated speaking or community section when there is verified content.
4. Multilingual content when audience data demonstrates a need.
5. Privacy friendly analytics for understanding content usage.
6. Print optimized résumé and case study layouts.
7. A structured project content schema to simplify updates.

Future additions must preserve the content first hierarchy and must not reduce performance, readability, or accessibility.

---

## Appendix A. Design constraints summary

The initial release must not use:

1. Rotating decorative elements
2. Large glowing backgrounds
3. Persistent parallax
4. Animated gradients
5. Excessive glassmorphism
6. Neon visual treatments
7. Decorative terminal windows
8. Fake code snippets
9. Skill progress bars
10. Percentage based skill ratings
11. Autoplay animations
12. Large technology badge collections
13. Animated portrait frames
14. Hover only project information
15. Unverified project metrics

## Appendix B. Handoff checklist

Before engineering handoff, provide:

1. Page level responsive designs
2. Component inventory
3. Component state designs
4. Light and dark theme examples
5. Typography and color token references
6. Content length examples
7. Project card variants
8. Case study layout
9. Contact form validation behavior
10. Accessibility annotations
11. Image crop guidance
12. Empty, loading, success, and error states where applicable
