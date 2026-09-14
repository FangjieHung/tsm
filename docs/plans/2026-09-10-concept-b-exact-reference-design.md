# Concept B Exact Reference Design

## Goal

Rebuild Concept B so the local rendered interface closely reproduces the six approved generated reference images. The references define composition, spacing, surfaces, image cropping, typography hierarchy, and interaction styling. Existing Chinese content, routes, anchor IDs, semantic structure, and image assets remain in place.

## Visual System

- Canvas: near-white `#FFFFFF` with pale cool-blue ambient depth only behind media and cards.
- Primary: `#0F8DB2`; dark type: `#082A45`; supporting text: muted blue-grey.
- Shapes: 28-32px rounded media/cards, 999px pill buttons, 1px white or pale-blue edge highlights.
- Type: compact, heavy Chinese sans headlines; small wide-tracked English labels only where the references show one; normal Chinese body copy with generous leading.
- Depth: soft blue-tinted shadows. Glass is reserved for the hero content pane; all other cards use an opaque pale-blue surface rather than repeated glass.
- Media: high-key clinical photography in fixed frames, with controlled `object-position` and no visual overlays except the hero collage.

## Reference Extraction

### Header and footer

The approved images do not depict these regions. They will use the same component grammar: 72px white header, thin pale-blue lower rule, dark-blue navigation, one teal pill login action, and a white footer with a pale-blue rule, restrained navigation links, and teal hover/focus states. No dark inversion, gradients, or unrelated visual motif.

### Hero

Source: `exec-c51c20f0-cd85-4b12-9fb7-a8146aa084d0.png`.

- Full-width 5-column clinical collage on white canvas, not a boxed section.
- Large frosted copy pane occupies the left two columns and overlaps the media grid.
- Media hierarchy: wide researcher frame above, portrait microscope frame at upper right, bacteria and DNA wide frames below, slim data frame at lower right.
- Copy: tracked blue English label; dark-blue 2-line heavy heading; 3-line body; teal pill CTA.
- The pane needs a high-contrast solid fallback and its text must never fade into white during reveal animation.

### Quick access

Source: `exec-e8478cfc-b5e2-4a09-8009-3967e0c1d045.png`.

- Open white heading area with cropped laboratory image fading from the right.
- One large two-tone heading and a concise lead.
- Three equal, pale-blue illustrated cards with a large teal count, bold title, short description, right-side illustration, and white circular arrow control.
- Existing three quick links map one-to-one to the cards. No numbered eyebrow above every section.

### Academic events

Source: `exec-c7218fb7-eac7-4445-8061-c224d0234c69.png`.

- Two-column layout: one large, near-square microscope image on the left and one white editorial content panel on the right.
- Right panel: compact English label, display heading, one lead paragraph, archive pill at the upper right, and two horizontal event rows.
- Each row combines a fixed date rail, category/title/meta stack, and one teal pill action. Hairline dividers separate rows.

### Resources

Source: `exec-87c48ef4-0e86-4405-83ea-37b2249e2be2.png`.

- Large left research image at 1:1-ish ratio; open right content column, not a boxed card.
- One teal capsule label, display heading, lead copy, and four rows separated by one pale-blue divider each.
- Each row uses an icon in a pale-blue circular field, title and description, and a pale-blue circular arrow at the far edge.

### News

Source: `exec-68416cfa-6bf7-4e2b-a551-954a63c359a4.png`.

- Open heading with short teal rule at top left and archive link at top right.
- Three equal editorial columns: 16:9 image, category/date metadata, 2-3 line headline, concise description, and text plus circular arrow at bottom.
- Card containers are removed; only image frames use the rounded-corner system.

### Membership

Source: `exec-62ce0352-d978-4417-a01b-fe6cb5ffbe7f.png`.

- Open title/lead section with small right-aligned supporting statement.
- A four-column action row: one large image-led login card and three equal pale-blue service cards.
- Every service card uses a pale circular icon field, a strong title, description, and white circular arrow CTA.
- Existing membership actions map one-to-one. The login card stays visually dominant.

## Responsive Behaviour

- Desktop (>=1200px): preserve each reference composition at a 1440px maximum content width.
- Tablet (768-1199px): hero becomes a 2-column collage; events/resources stack image above content; cards become 2 columns where necessary.
- Mobile (<768px): every grid becomes one column; source ordering remains meaningful, all CTAs meet 44px targets, no cropped copy, and image frames keep their intended aspect ratios.

## Accessibility and Delivery

- Preserve all existing heading hierarchy, link destinations, alt text, focus styles, and skip link.
- `prefers-reduced-motion` keeps all content fully opaque with no entrance delay.
- Use CSS tokens and scoped Concept B rules only; Concepts A and C must not change.
- Validate with unit tests, production build, desktop and mobile localhost screenshots, then commit the implementation in small reviewable increments.
