# Content Creator application UI

**Scope:** This document describes only the Content Creator application interface.
It is not a publication design specification and must never enter the publication
rendering pipeline. Publication identity is defined exclusively by the registered
pack referenced by `post.json.style` under `content-styles/`.

The existing UI specification below is retained; introducing Content Styles does
not redesign the application.

---

version: alpha

name: WebParaConsultorios-origami-clinic

description: "A calm, editorial design system for healthcare practices built around the idea of folded paper becoming a digital doorway. The visual language combines warm paper-like surfaces, deep clinical blue, restrained teal, angular origami geometry, and highly legible typography. Sections feel assembled from precisely folded sheets rather than floating SaaS cards. Diagonal seams, clipped corners, layered paper planes, and folded page edges create depth without gradients or drop shadows. Healthcare is communicated through clarity, accessibility, human scale, appointment flows, practice information, and subtle spatial references to consultation rooms rather than generic medical symbols."

colors:

primary: "#173B52"

on-primary: "#F7F4EC"

primary-soft: "#D9E6E8"

ink: "#16272F"

ink-soft: "#52636A"

canvas: "#F4F1E8"

canvas-elevated: "#FAF8F2"

surface-paper: "#ECE8DD"

surface-cool: "#E4ECEB"

inverse-canvas: "#17313F"

inverse-ink: "#F7F4EC"

hairline: "#CBD2CF"

hairline-strong: "#AEBBB8"

fold-line: "#B9C7C6"

fold-highlight: "#FCFAF5"

clinic-teal: "#2C7874"

clinic-teal-dark: "#205D5A"

clinic-mint: "#C7DDD6"

clinic-sage: "#CFD8C7"

clinic-sky: "#C9DCE5"

clinic-sand: "#E7D8BE"

clinic-coral: "#D99383"

clinic-blue-soft: "#D2E1E7"

semantic-success: "#347653"

semantic-warning: "#A66D2F"

semantic-error: "#A84C45"

focus-ring: "#2C7874"

overlay-scrim: "#17313F"

typography:

display-xl:

```
fontFamily: "Atkinson Hyperlegible Next"

fontSize: 74px

fontWeight: 500

lineHeight: 0.98

letterSpacing: -1.40px

fontFeature: kern
```

display-lg:

```
fontFamily: "Atkinson Hyperlegible Next"

fontSize: 56px

fontWeight: 500

lineHeight: 1.02

letterSpacing: -0.90px

fontFeature: kern
```

headline:

```
fontFamily: "Atkinson Hyperlegible Next"

fontSize: 32px

fontWeight: 600

lineHeight: 1.18

letterSpacing: -0.32px

fontFeature: kern
```

subhead:

```
fontFamily: "Atkinson Hyperlegible Next"

fontSize: 25px

fontWeight: 400

lineHeight: 1.35

letterSpacing: -0.18px

fontFeature: kern
```

card-title:

```
fontFamily: "Atkinson Hyperlegible Next"

fontSize: 22px

fontWeight: 600

lineHeight: 1.30

letterSpacing: -0.12px

fontFeature: kern
```

body-lg:

```
fontFamily: "Atkinson Hyperlegible Next"

fontSize: 20px

fontWeight: 400

lineHeight: 1.50

letterSpacing: 0

fontFeature: kern
```

body:

```
fontFamily: "Atkinson Hyperlegible Next"

fontSize: 18px

fontWeight: 400

lineHeight: 1.55

letterSpacing: 0

fontFeature: kern
```

body-sm:

```
fontFamily: "Atkinson Hyperlegible Next"

fontSize: 16px

fontWeight: 400

lineHeight: 1.50

letterSpacing: 0

fontFeature: kern
```

link:

```
fontFamily: "Atkinson Hyperlegible Next"

fontSize: 18px

fontWeight: 600

lineHeight: 1.45

letterSpacing: 0

fontFeature: kern
```

button:

```
fontFamily: "Atkinson Hyperlegible Next"

fontSize: 17px

fontWeight: 600

lineHeight: 1.20

letterSpacing: 0

fontFeature: kern
```

eyebrow:

```
fontFamily: "IBM Plex Mono"

fontSize: 13px

fontWeight: 500

lineHeight: 1.35

letterSpacing: 1.10px

fontFeature: kern
```

caption:

```
fontFamily: "IBM Plex Mono"

fontSize: 12px

fontWeight: 400

lineHeight: 1.35

letterSpacing: 0.55px

fontFeature: kern
```

rounded:

none: 0px

xs: 2px

sm: 4px

md: 6px

full: 9999px

geometry:

fold-sm: 8px

fold-md: 16px

fold-lg: 28px

fold-xl: 48px

diagonal-small: 6deg

diagonal-large: 12deg

spacing:

hair: 1px

xxs: 4px

xs: 8px

sm: 12px

md: 16px

lg: 24px

xl: 32px

xxl: 48px

xxxl: 64px

section: 104px

components:

button-primary:

```
backgroundColor: "{colors.primary}"

textColor: "{colors.on-primary}"

typography: "{typography.button}"

rounded: "{rounded.sm}"

padding: 14px 22px

foldCorner: "{geometry.fold-sm}"
```

button-primary-pressed:

```
backgroundColor: "{colors.clinic-teal-dark}"

textColor: "{colors.on-primary}"

typography: "{typography.button}"

rounded: "{rounded.sm}"

foldCorner: "{geometry.fold-sm}"
```

button-secondary:

```
backgroundColor: "{colors.canvas-elevated}"

textColor: "{colors.primary}"

borderColor: "{colors.primary}"

borderWidth: 1px

typography: "{typography.button}"

rounded: "{rounded.sm}"

padding: 13px 21px

foldCorner: "{geometry.fold-sm}"
```

button-tertiary-text:

```
backgroundColor: transparent

textColor: "{colors.primary}"

typography: "{typography.link}"

rounded: "{rounded.none}"

padding: 8px 2px
```

button-icon-folded:

```
backgroundColor: "{colors.surface-cool}"

textColor: "{colors.primary}"

rounded: "{rounded.sm}"

size: 44px

foldCorner: "{geometry.fold-sm}"
```

appointment-button:

```
backgroundColor: "{colors.clinic-teal}"

textColor: "{colors.on-primary}"

typography: "{typography.button}"

rounded: "{rounded.sm}"

padding: 14px 22px

foldCorner: "{geometry.fold-sm}"
```

text-input:

```
backgroundColor: "{colors.canvas-elevated}"

textColor: "{colors.ink}"

borderColor: "{colors.hairline-strong}"

borderWidth: 1px

typography: "{typography.body}"

rounded: "{rounded.sm}"

padding: 14px 16px
```

text-input-focused:

```
backgroundColor: "{colors.canvas-elevated}"

textColor: "{colors.ink}"

borderColor: "{colors.focus-ring}"

borderWidth: 2px

typography: "{typography.body}"

rounded: "{rounded.sm}"

padding: 13px 15px
```

origami-section:

```
backgroundColor: "{colors.canvas-elevated}"

textColor: "{colors.ink}"

typography: "{typography.body}"

foldCorner: "{geometry.fold-lg}"

padding: 56px
```

origami-section-teal:

```
backgroundColor: "{colors.clinic-mint}"

textColor: "{colors.ink}"

typography: "{typography.body}"

foldCorner: "{geometry.fold-lg}"

padding: 56px
```

origami-section-blue:

```
backgroundColor: "{colors.clinic-blue-soft}"

textColor: "{colors.ink}"

typography: "{typography.body}"

foldCorner: "{geometry.fold-xl}"

padding: 56px
```

origami-section-sand:

```
backgroundColor: "{colors.clinic-sand}"

textColor: "{colors.ink}"

typography: "{typography.body}"

foldCorner: "{geometry.fold-lg}"

padding: 56px
```

origami-section-inverse:

```
backgroundColor: "{colors.inverse-canvas}"

textColor: "{colors.inverse-ink}"

typography: "{typography.body}"

foldCorner: "{geometry.fold-xl}"

padding: 56px
```

fold-seam:

```
color: "{colors.fold-line}"

width: 1px

angle: "{geometry.diagonal-large}"
```

consultation-panel:

```
backgroundColor: "{colors.canvas-elevated}"

textColor: "{colors.ink}"

borderColor: "{colors.hairline}"

borderWidth: 1px

typography: "{typography.body}"

rounded: "{rounded.sm}"

foldCorner: "{geometry.fold-md}"

padding: 28px
```

practice-preview:

```
backgroundColor: "{colors.canvas-elevated}"

textColor: "{colors.ink}"

borderColor: "{colors.hairline}"

borderWidth: 1px

rounded: "{rounded.sm}"

foldCorner: "{geometry.fold-lg}"

padding: 12px
```

process-step:

```
backgroundColor: "{colors.surface-paper}"

textColor: "{colors.ink}"

typography: "{typography.body}"

rounded: "{rounded.sm}"

foldCorner: "{geometry.fold-md}"

padding: 24px
```

specialty-tag:

```
backgroundColor: "{colors.surface-cool}"

textColor: "{colors.primary}"

typography: "{typography.body-sm}"

rounded: "{rounded.sm}"

padding: 7px 10px
```

trust-strip:

```
backgroundColor: "{colors.primary}"

textColor: "{colors.on-primary}"

typography: "{typography.body-sm}"

rounded: "{rounded.none}"

height: 40px
```

top-nav:

```
backgroundColor: "{colors.canvas}"

textColor: "{colors.ink}"

typography: "{typography.body-sm}"

rounded: "{rounded.none}"

height: 68px
```

footer:

```
backgroundColor: "{colors.inverse-canvas}"

textColor: "{colors.inverse-ink}"

typography: "{typography.caption}"

rounded: "{rounded.none}"

padding: 72px 32px
```

---

## Overview

WebParaConsultorios uses a visual system based on a simple metaphor:

**a traditional consultation space is folded into a clear digital doorway that patients can access.**

Origami provides the geometry.

Healthcare provides the purpose.

The system should not look like an origami craft website, a hospital, or a technology startup. Origami is expressed through structural decisions such as folded corners, diagonal seams, overlapping paper planes, asymmetric section boundaries, and carefully constructed negative space.

The healthcare relationship appears through calm visual hierarchy, accessible typography, clear appointment actions, real practice information, restrained colors, human photography, and layouts that resemble organized consultation spaces.

The result should feel like a professional folder handed to a patient, transformed into a modern website.

The page is constructed primarily from warm paper-colored surfaces rather than pure white. Dark blue establishes confidence. Teal signals interaction and appointments. Mint, sky, sage, and sand surfaces provide variation without turning the site into a rainbow.

There are no gradients.

There are no floating glass surfaces.

There are no large drop shadows.

There are no decorative medical crosses, shields, hearts, ECG lines, pills, or stethoscopes.

The visual identity is created through composition and geometry.

### Core visual idea

The recurring sequence is:

**paper → fold → opening → consultation → appointment**

A fold can indicate movement.

A clipped corner can indicate an interactive element.

Two overlapping paper planes can represent the relationship between professional and patient.

An opening created by two folded surfaces can subtly echo a consultation-room doorway.

A diagonal fold can guide the eye toward the next action.

Origami should therefore operate as a **layout grammar**, not as an illustration theme.

## Key Characteristics

* Warm paper canvas instead of pure white.
* Deep clinical blue as the primary brand color.
* Restrained teal for booking and conversion actions.
* Folded and clipped geometry instead of excessive rounded rectangles.
* Large editorial layouts with asymmetric compositions.
* Diagonal seams and folded corners used as navigation cues.
* Realistic consultation website previews rather than generic dashboard mockups.
* Healthcare communicated through trust, clarity and accessibility, not medical clichés.
* Custom geometric icons instead of Lucide or other generic icon libraries.
* Minimal elevation. Separation comes from paper layering, borders and color changes.
* One dominant visual idea per section.
* Large areas of quiet canvas between stronger compositions.
* No generic three-card feature rows.
* No decorative gradients, neon effects, glass effects, radial blobs or dot-grid backgrounds.

## Brand Relationship: Origami and Healthcare

The origami concept should always reinforce the service being offered.

### Folded doorway

The most important visual motif.

Two angular planes create an opening in the center.

This may be used in:

* the brand symbol
* hero artwork
* transitions between sections
* appointment CTA areas
* empty-state illustrations

The opening represents a consultorio becoming accessible on the internet.

### Folded consultation sheet

Information surfaces can resemble a neatly folded appointment sheet or patient information document.

Use this concept for:

* service explanations
* process steps
* FAQs
* specialty information
* package details

Do not add fake handwriting, paper textures, tape or scrapbook effects.

The system should remain polished and professional.

### Connection between two planes

When representing the professional-patient relationship, use two shapes that approach, overlap, or create a shared opening.

Avoid literal illustrations of a doctor shaking hands with a patient.

### Origami directionality

Fold lines should occasionally direct attention toward meaningful actions such as:

* Solicitar información
* Ver ejemplo
* Quiero mi página
* Contactar
* Agendar una llamada

Do not use animated arrows merely for decoration.

## Colors

### Primary

**Deep Clinic Blue** `{colors.primary}` is the primary brand color.

It represents professionalism and stability without feeling corporate or hospital-like.

Use it for:

* primary calls to action
* navigation emphasis
* major headings
* footer surfaces
* important section anchors

Do not flood entire pages with dark blue.

### Canvas

The default background is `{colors.canvas}`.

It is deliberately warmer than pure white.

This creates a subtle relationship with physical paper and prevents the interface from feeling like a generic software landing page.

`{colors.canvas-elevated}` is used for content sheets that need slightly more separation.

### Clinic Teal

`{colors.clinic-teal}` is the main action accent.

It is especially appropriate for actions related to:

* appointments
* contact
* consultation requests
* availability

Do not use teal indiscriminately for decoration.

A screen should normally contain only one strongly teal interactive focal point.

### Supporting Paper Colors

The supporting palette represents different sheets of paper rather than independent brand colors.

**Mint** `{colors.clinic-mint}`
Good for patient-contact or accessibility sections.

**Sky** `{colors.clinic-sky}`
Good for online-presence, visibility or website-related content.

**Sage** `{colors.clinic-sage}`
Good for trust, process or support content.

**Sand** `{colors.clinic-sand}`
Good for warm editorial storytelling.

**Coral** `{colors.clinic-coral}`
Use sparingly for small human accents or important notices.

Do not present all of these colors simultaneously.

One supporting paper color per major section is normally enough.

### Text

Primary text uses `{colors.ink}`.

Secondary explanatory text may use `{colors.ink-soft}`.

Unlike the original monochrome reference, this system allows restrained secondary text because healthcare interfaces benefit from explicit hierarchy and comfortable reading.

Never reduce text opacity so much that accessibility suffers.

## Typography

### Primary Typeface

Use **Atkinson Hyperlegible Next**.

The font was selected because its letterforms prioritize clarity and distinguishability while still feeling contemporary.

It works particularly well for a healthcare-oriented brand where readability should carry more weight than visual novelty.

Fallback:

`Atkinson Hyperlegible Next, Atkinson Hyperlegible, system-ui, sans-serif`

### Secondary Typeface

Use **IBM Plex Mono** only for taxonomy and tiny interface labels.

Examples:

`PROCESO`

`PARA PROFESIONALES DE SALUD`

`PASO 01`

`DISPONIBLE EN MÓVIL`

It should never be used for paragraphs or large headings.

### Hierarchy

| Token                     | Size | Weight | Line Height | Primary use             |
| ------------------------- | ---: | -----: | ----------: | ----------------------- |
| `{typography.display-xl}` | 74px |    500 |        0.98 | Desktop hero            |
| `{typography.display-lg}` | 56px |    500 |        1.02 | Section opener          |
| `{typography.headline}`   | 32px |    600 |        1.18 | Major internal headings |
| `{typography.subhead}`    | 25px |    400 |        1.35 | Lead paragraphs         |
| `{typography.card-title}` | 22px |    600 |        1.30 | Content panel titles    |
| `{typography.body-lg}`    | 20px |    400 |        1.50 | Hero support copy       |
| `{typography.body}`       | 18px |    400 |        1.55 | Default reading text    |
| `{typography.body-sm}`    | 16px |    400 |        1.50 | Supporting content      |
| `{typography.button}`     | 17px |    600 |        1.20 | CTA labels              |
| `{typography.eyebrow}`    | 13px |    500 |        1.35 | Section taxonomy        |
| `{typography.caption}`    | 12px |    400 |        1.35 | Metadata                |

### Typography Principles

Headlines should feel calm, not loud.

The hero can be large, but avoid ultra-heavy typography.

Prefer medium weights and strong spacing.

Line breaks should be deliberate.

Good:

> Su consultorio también
> debería tener una puerta
> en internet.

Avoid filling the hero with marketing jargon.

Body copy should remain highly readable and generally stay below 680px line width.

## Layout

### Grid

Maximum main content width:

`1240px`

Editorial reading width:

`640px - 720px`

Default desktop gutters:

`40px - 56px`

Tablet gutters:

`28px - 32px`

Mobile gutters:

`20px`

The layout does not need to remain perfectly symmetrical.

Controlled asymmetry is encouraged because it reinforces the folded-paper concept.

### Section Rhythm

Use approximately `{spacing.section}` between major narrative sections.

A typical home page rhythm may be:

warm paper hero
→ dark trust strip
→ white-space transition
→ folded problem statement
→ real practice demo
→ process section
→ specialty examples
→ testimonial or proof if real evidence exists
→ pricing or offer
→ appointment-oriented closing CTA
→ dark footer

Not every section requires a colored background.

Whitespace is part of the visual system.

### Origami Composition

Sections may use diagonal boundaries or folded corners, but the text itself must remain aligned to a stable grid.

Never rotate body copy.

Never tilt entire cards.

Never sacrifice readability to make a surface look more like origami.

The fold is an architectural detail around the content.

### Avoid Card Grids

Do not default to three equal feature cards in a row.

Prefer:

* one large story panel with an adjacent smaller detail
* alternating text and product preview
* split editorial layouts
* overlapping paper planes
* horizontal process sequences
* one dominant panel followed by supporting fragments

Repeated equal cards should only be used when the content truly represents equivalent items.

## Elevation and Depth

Depth comes from **layering**, not shadows.

### Level 0

Flat surface.

Used for:

* page canvas
* navigation
* large editorial sections
* footer

### Level 1

One-pixel border.

Used for:

* form fields
* real website previews
* FAQ rows
* information sheets

### Level 2

Paper overlap.

A second surface may be positioned 6px to 16px behind another surface.

The offset layer should use another solid paper color.

No blurred shadow is required.

### Fold depth

A folded corner may contain a triangular secondary surface.

Example:

main surface: `{colors.canvas-elevated}`

folded triangle: `{colors.primary-soft}`

fold seam: `{colors.fold-line}`

The fold should be subtle.

Avoid photorealistic paper effects.

### Prohibited Depth Treatments

Do not use:

* drop shadows on every component
* glassmorphism
* liquid glass
* blurred surfaces
* radial light orbs
* glowing edges
* neon borders
* fake 3D paper textures

## Shapes

### Primary Geometry

The system is predominantly rectangular.

Small radii exist only to prevent the interface from feeling harsh.

`{rounded.sm}` is the default maximum for most controls.

Large 24px to 32px rounded containers should not become the dominant visual language.

### Folded Corner

The signature component shape uses a clipped upper-right or lower-right corner.

Conceptual CSS:

```css
clip-path: polygon(
  0 0,
  calc(100% - 16px) 0,
  100% 16px,
  100% 100%,
  0 100%
);
```

Use the fold size according to scale:

`{geometry.fold-sm}` for buttons.

`{geometry.fold-md}` for panels.

`{geometry.fold-lg}` for feature surfaces.

`{geometry.fold-xl}` for large storytelling sections.

### Diagonal Seams

A thin diagonal line can indicate a paper fold.

Use `{colors.fold-line}`.

Keep the line subtle.

A fold seam should never resemble an arrow or chart line.

### Circles

Circles should be uncommon.

Use them only where the geometry is semantically appropriate, for example:

* status indicators
* pagination
* profile photography

Do not make every icon live inside a circle.

## Iconography

Do not use Lucide icons as the main visual language.

Create a small custom icon set using simple geometric strokes.

Icons may borrow geometry from folded paper:

* appointment calendar formed from two overlapping sheets
* location formed from an angular opening
* contact represented by two approaching planes
* web presence represented by a folded window
* mobile access represented by a framed paper plane
* specialties represented through abstract identifiers

Stroke width should remain consistent.

Recommended:

`1.5px - 1.75px`

Corners should be mostly square or lightly softened.

Avoid generic medical symbols unless context absolutely requires them.

## Photography

Photography should represent the physical consultation environment.

Prefer:

* private consultation rooms
* professionals in natural working environments
* reception details
* warm natural light
* clean but believable spaces
* Costa Rican or Latin American visual context when appropriate

Avoid:

* doctors posing with crossed arms against white backgrounds
* stock-photo handshakes
* exaggerated smiles
* operating rooms unless the specialty specifically requires them
* floating medical icons
* generic telemedicine imagery

Photography should feel closer to editorial architecture and professional portraiture.

## Real Product Demonstrations

The product should be demonstrated through **actual-looking healthcare practice websites**.

Do not use generic dashboard screenshots.

A website preview should visibly contain elements such as:

* professional name
* specialty
* consultation location
* real-looking portrait or practice photography
* services
* opening hours
* contact information
* appointment CTA
* mobile navigation
* map or location context where useful

Examples should feel designed.

They should not resemble raw HTML templates.

Each demo can have its own visual identity while still clearly belonging to WebParaConsultorios.

Possible demo specialties include:

* odontología
* psicología
* nutrición
* fisioterapia
* dermatología
* medicina general
* pediatría
* ginecología

The purpose of the demo is to make a professional imagine:

**“Así podría verse mi consultorio en internet.”**

## Components

### `button-primary`

Primary action.

Use for:

* Quiero mi página
* Empezar
* Solicitar información

Background:

`{colors.primary}`

Text:

`{colors.on-primary}`

Shape:

small clipped corner.

No pill shape.

No shadow.

### `appointment-button`

Use when the action specifically represents communication or appointments.

Background:

`{colors.clinic-teal}`

Typical labels:

* Agendar una llamada
* Solicitar una cita
* Contactar
* Hablar por WhatsApp

Do not use teal for unrelated actions.

### `button-secondary`

Outlined paper button.

Use next to a primary action.

Examples:

* Ver ejemplos
* Conocer cómo funciona
* Ver servicios

### `button-tertiary-text`

Simple text action.

Do not place it inside a decorative pill.

Use a small underline, border-bottom or directional fold detail on interaction.

### `text-input`

Fields should resemble clean document fields.

No floating labels unless required.

Use visible labels above inputs.

Focus must be obvious with `{colors.focus-ring}`.

Form usability takes priority over origami styling.

### `origami-section`

A large paper plane used for storytelling.

It may contain:

eyebrow
headline
body copy
CTA
illustration or product preview

The fold should normally appear on only one corner.

### `origami-section-teal`

Use for patient connection or communication stories.

### `origami-section-blue`

Use for digital presence or website demonstration.

### `origami-section-sand`

Use for explanatory or human storytelling.

### `origami-section-inverse`

Use sparingly.

Appropriate for:

* closing CTA
* high-confidence statement
* major proof point

Do not use several dark sections consecutively.

### `consultation-panel`

General information sheet.

Use instead of a generic SaaS card.

Possible content:

* specialty
* process explanation
* benefit
* feature
* FAQ answer
* pricing detail

### `practice-preview`

Container for a real consultation website demo.

This should look like a browserless editorial mockup, not a fake application window.

Do not add:

* fake browser traffic-light controls
* terminal chrome
* dashboard sidebars
* code snippets

The website itself is the visual.

### `process-step`

Used for the WebParaConsultorios process.

Recommended content:

`01`

`Nos comparte la información de su consultorio.`

`02`

`Diseñamos una propuesta profesional.`

`03`

`Revisamos juntos los detalles.`

`04`

`Publicamos su espacio en internet.`

The steps may be visually connected through a continuous fold line.

Avoid four floating cards.

### `specialty-tag`

Small label used to identify healthcare specialties.

It is rectangular with slight corner treatment.

Not a pill.

### `trust-strip`

Dark horizontal strip.

May contain concise trust signals such as:

* Dominio propio
* Diseño adaptable a celular
* Contacto directo
* Información clara
* Sitio administrado por nosotros

Do not use unsupported claims.

### `top-nav`

Background:

`{colors.canvas}`

Height:

68px.

The navigation should feel integrated into the paper canvas.

Recommended desktop structure:

logo
examples
how it works
pricing
FAQ
contact
primary CTA

No oversized mega menu.

### `footer`

Dark clinic-blue surface.

Should include:

* brand
* navigation
* contact information
* legal links
* privacy policy
* terms of service

Legal pages are part of the actual product and should never be omitted.

## Hero

The hero should immediately communicate what WebParaConsultorios sells.

Do not open with abstract technology language.

Recommended structural hierarchy:

eyebrow
headline
short explanation
primary CTA
secondary CTA
real practice website preview

The origami motif can frame the website preview using two folded planes.

One plane may represent the physical consultorio.

The second plane may contain the digital website.

Their overlap creates the visual relationship.

### Example conceptual headline

**Su consultorio también debería tener una puerta en internet.**

Supporting copy can explain:

WebParaConsultorios crea páginas profesionales para médicos y otros profesionales de la salud, para que nuevos pacientes puedan conocer sus servicios y contactarlos fácilmente.

### Hero Artwork

The preview should dominate visually on desktop.

It should show an attractive, credible consultation website.

Avoid abstract blobs or generic UI diagrams.

## Healthcare Signals

Healthcare should be visible without relying on medical iconography.

Use:

* professional names and credentials
* specialty labels
* consultation schedules
* appointment actions
* locations
* service descriptions
* calm photography
* accessible information architecture
* privacy-conscious language
* human contact

A visitor should understand that the service is for healthcare professionals even if every traditional medical icon is removed.

## Origami Decorative Language

Decorative origami should remain minimal.

Recommended treatments:

### Corner Fold

One folded corner on a large section.

### Fold Seam

A single 1px diagonal line through a large quiet surface.

### Overlap

Two flat sheets overlapping by 16px to 40px.

### Opening

Two opposing folded planes framing an empty central space.

### Paper Trail

A sequence of surfaces that gradually changes orientation between process steps.

Avoid:

* origami cranes
* paper airplanes
* complex animal folds
* Japanese decorative motifs unrelated to the business
* excessive polygons
* folds on every component

The metaphor should remain architectural.

## Do's

* Use origami to structure information.
* Use warm paper-colored backgrounds.
* Keep dark blue as the confidence anchor.
* Reserve teal for meaningful actions.
* Show real consultation website examples.
* Use diagonal lines sparingly.
* Maintain accessible contrast.
* Use strong whitespace.
* Keep body copy highly readable.
* Create custom geometric iconography.
* Let large sections carry the visual identity.
* Use asymmetry intentionally.
* Make mobile layouts significantly simpler than desktop.
* Include actual Terms of Service and Privacy Policy links.
* Use skeleton loaders when asynchronous product content requires loading feedback.
* Keep product demonstrations attractive enough to sell the service on their own.

## Don'ts

* Don't use harsh gradients.
* Don't use Lucide icons as the visual identity.
* Don't use pure white as the dominant page canvas.
* Don't use rainbow coloring.
* Don't use decorative drop shadows.
* Don't default to three feature cards in a row.
* Don't use emojis as visual decoration.
* Don't use liquid glass.
* Don't use excessively rounded containers.
* Don't use purple-and-black startup styling.
* Don't use radial orbs.
* Don't use dot-grid backgrounds.
* Don't use sparkle icons.
* Don't use animated arrows.
* Don't use neon colors.
* Don't use generic pastel SaaS palettes.
* Don't use terminal windows.
* Don't use fake testimonials.
* Don't create fake browser chrome around every website preview.
* Don't make all interactive elements pills.
* Don't hide the real product behind abstract illustrations.
* Don't use hover animation as decoration.
* Don't place origami folds on every container.
* Don't use medical crosses, ECG lines, hearts or stethoscopes as recurring brand motifs.
* Don't sacrifice readability for angular geometry.

## Responsive Behavior

### Breakpoints

| Name      |  Width | Main behavior                                                                     |
| --------- | -----: | --------------------------------------------------------------------------------- |
| Wide      | 1600px | Content remains capped near 1240px                                                |
| Desktop   | 1280px | Full asymmetric editorial compositions                                            |
| Tablet    |  960px | Complex overlaps simplify                                                         |
| Mobile-L  |  768px | Product previews disappear from marketing sections when they compete with content |
| Mobile    |  560px | Single-column editorial layout                                                    |
| Mobile-XS |  390px | Reduced fold geometry and tighter gutters                                         |

### Mobile Philosophy

Mobile should not attempt to reproduce desktop compositions at miniature scale.

Simplify.

Below approximately `768px`:

* Hide large decorative consultation-page previews when they are not essential to understanding the section.
* Do not shrink desktop mockups until their text becomes unreadable.
* Replace complex folded compositions with a single paper plane.
* Remove nonessential decorative seams.
* Keep CTAs visible.
* Keep service information and trust signals.
* Maintain generous touch targets.
* Prioritize actual content over decorative origami.

### Website Demo Behavior

Desktop:

Display full attractive website previews.

Tablet:

Use reduced but still legible previews where space allows.

Mobile:

Do not display large page previews inside narrow sections.

If a demo must remain available, provide a clear `Ver ejemplo` action that opens a dedicated demo experience.

The marketing page itself should remain clean and fast.

### Fold Behavior

Desktop surfaces may use `{geometry.fold-lg}` and `{geometry.fold-xl}`.

Tablet should generally reduce to `{geometry.fold-md}`.

Mobile should use `{geometry.fold-sm}` or remove the fold entirely.

Large decorative diagonals should disappear before they begin compromising layout.

## Accessibility

Healthcare-oriented design requires accessibility to be treated as part of the visual system.

### Contrast

All text and controls should meet WCAG AA minimum contrast requirements.

Primary CTA contrast should target AAA where practical.

### Typography

Do not set body copy below 16px.

Default mobile body size should remain approximately 17px to 18px.

### Forms

Every form input needs:

* persistent label
* visible focus state
* explicit error message
* appropriate autocomplete attributes
* accessible validation
* sufficient vertical spacing

Do not communicate errors using color alone.

### Motion

Respect `prefers-reduced-motion`.

Origami transitions should never be necessary to understand the interface.

No continuous decorative animation.

### Touch

Interactive controls should have at least a 44px effective touch target.

## Motion

Motion should reinforce folding.

Allowed examples:

* a section seam gently opening as it enters
* a folded corner changing depth on interaction
* two planes separating slightly to reveal content
* page preview entering from behind another sheet

Keep animation duration between approximately `180ms` and `400ms`.

Use restrained easing.

Do not make every element animate on scroll.

Avoid:

* bouncing
* floating
* looping
* glowing
* rotating icons
* excessive parallax

## Example Home Page Composition

### 1. Navigation

Warm paper canvas.

Simple navigation.

Primary action:

`Quiero mi página`

### 2. Hero

Left:

headline and short explanation.

Right:

large real consultation website preview framed by two folded planes.

The planes subtly create a doorway around the website.

### 3. Trust Strip

Deep clinic blue.

Short factual benefits.

### 4. Problem

Large editorial copy.

Possible framing:

**Sus pacientes ya buscan información antes de llamar.**

The section explains why having clear information online matters.

### 5. Transformation

A split composition.

Left:

traditional consultation information represented as a physical paper sheet.

Right:

the same information reorganized into an attractive website.

A diagonal fold connects both.

### 6. Real Website Examples

Show one strong demo at a time.

Alternate specialties between sections.

Do not create a generic three-column template gallery.

### 7. Process

Four steps connected through a continuous paper-fold path.

### 8. What the Website Includes

Use a large consultation sheet with structured rows rather than cards.

Possible rows:

Información profesional
Servicios
Horarios
Ubicación
Contacto
WhatsApp
Formulario
Diseño para celular
Dominio
SEO básico

### 9. Specialties

Use typography-led specialty tags or an editorial index.

Avoid icon grids.

### 10. Offer

Pricing should be simple and easy to understand.

Do not default to three artificial pricing tiers.

If the business has one main package, present one main package.

### 11. Final CTA

Dark folded section.

Headline:

**Hagamos que su consultorio sea más fácil de encontrar y contactar.**

Primary action:

`Quiero mi página`

### 12. Footer

Dark clinic blue.

Include actual legal and privacy links.

## Design Quality Test

Before approving a page, ask:

1. Would a doctor understand the service within five seconds?
2. Does the page look like a professional design studio rather than a SaaS dashboard?
3. Is origami visible through structure rather than decorative illustrations?
4. Does the healthcare relationship remain obvious without a medical cross?
5. Is there at least one convincing real website demonstration?
6. Does the design still work if all animations are disabled?
7. Are there unnecessary floating cards?
8. Is any color being used without a semantic reason?
9. Could any generic AI-generated startup landing page have produced this exact layout?
10. Does the mobile version intentionally simplify the desktop design?
11. Are legal, privacy and contact elements real and accessible?
12. Is the primary action obvious without being repeated excessively?

If the answer to question 9 is yes, the composition needs another iteration.

## Iteration Guide

1. Begin each new section by defining its communication goal.
2. Decide whether the section requires a fold at all.
3. Select one dominant paper surface.
4. Use one primary origami gesture.
5. Build the content on a stable grid.
6. Add the fold around the content rather than forcing content into the fold.
7. Use `{colors.primary}` only where confidence or hierarchy is required.
8. Use `{colors.clinic-teal}` primarily for conversion or appointment intent.
9. Prefer a real consultation website preview over an abstract illustration whenever the product itself can explain the value.
10. Check desktop and mobile separately rather than merely scaling one composition.
11. Remove any generic card, icon or decoration that does not reinforce the consultorio-to-patient relationship.
12. Run `npx @google/design.md lint DESIGN.md` after structural changes.

## Known Gaps

* Exact fold dimensions may require adjustment after testing the system in real page compositions.
* Custom iconography still needs a dedicated icon specification.
* Photography direction will need real production examples before tone can be fully standardized.
* Specialty-specific demo websites should eventually receive their own visual guidelines.
* Motion tokens should be documented once folding transitions are implemented.
* Error states, loading states and empty states require component-level specifications.
* The exact relationship between the WebParaConsultorios logo and the folded-doorway geometry should be synchronized with the final brand identity.
