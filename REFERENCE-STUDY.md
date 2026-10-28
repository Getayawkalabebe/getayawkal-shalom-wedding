# Belgrade Arbor → Getayawkal & Shalom

Reference inspected in the browser on 27 October 2026: https://belgradearbor.rs/en

This is a new presentation layer. Only the wedding facts, supplied photographs, song, translation content, and RSVP data contract are retained from the previous implementation. No previous layout or stylesheet is imported.

## Observed design system

- Heading font: PP Editorial Old, Regular (400), Ultralight (mapped to 300), Ultralight Italic. Interface: Work Sans, predominantly 400. Confirmed from rendered computed styles and @font-face declarations.
- At a 1280px viewport: hero heading about 134–142px; editorial paragraphs about 50px with 1.1 line height; utility labels about 12–18px. Title capitals are spacious in scale rather than heavily tracked. Editorial paragraphs use sentence case and light strokes.
- Palette observed: pine #2e3a26, vanilla #fdfbef, cream #fff4d6 / #f4f0db, antique gold #a68150, muted gold #ccbf99, bright yellow-green #e7fd55, slate blue approximately #30495b.
- Navigation: centered capsule, roughly 570px wide at 1280px, about 52px high, 22px below the top. Menu on left, symbol centered, outlined inquiry action on right. Expands vertically into a tall rounded panel with centered serif links and language choices at the bottom.
- Full-viewport photographic/cinematic heroes; huge titles; small offset supporting text; circular down arrows.
- Home: a long pinned scene with 01/02/03 progress, alternating large text and rounded asymmetric image masks. Then full-screen section openers, split list/image selectors, a blue editorial interlude, a horizontal image reveal, a ruled timeline, and a photographic footer.
- Buttons: thin rounded outlines, small uppercase sans labels, arrow icons; stacked labels roll vertically on hover. Some key actions use a flat pale-gold fill.
- Motion observed: blurred text resolves as it enters, line/word staggers, clipped image reveals, parallax, pinned crossfades, image expansion, horizontal travel, active progress strokes, sliding page/menu transitions. The wedding recreates these with CSS, IntersectionObserver, sticky scenes, and requestAnimationFrame, without copying reference JavaScript or its trackers.
- Forms: olive background, pale-gold small labels, thin underline inputs, pill selectors, large photo on the opposing half. Native control semantics are retained.

## Page-by-page adaptation

| Reference | Inspected content | Wedding adaptation |
| --- | --- | --- |
| Home `/en` | Opening, pinned scene, location, residences, business, roots, amenities, overhead reveal, installment rows, footer | `/invitation`: envelope opening, panoramic wedding hero, three pinned chapters, venue, celebration preview, blue photo composition, guest essentials, date/countdown, photographic footer |
| 3D `/en/3d` | Full-screen viewport, view-angle controls, floating bottom toolbar, loader and filters; scene loading was slow in the browser | `/moments`: immersive perspective photo carousel, numbered image navigator, keyboard/swipe controls, detail viewer and a grid view; photos remain 2D supplied photographs, not fabricated 3D captures |
| Residences `/en/residences` | Hero, sticky filters, outlined grid, result count, footer | `/celebration`: full-screen title, event filters, large numbered ceremony entries, Ethiopian/EAT time selector, calendar download |
| Residence `/en/residences/a-1-01` | Split detail, ruled specifications, view toggles, masked gallery, related items | Celebration detail panels and photo detail viewer. One representative detail template inspected; the 208 repetitive property records were not individually reviewed |
| Business `/en/business` | Hero/video CTA, pinned story, wing selectors, panoramic closing image | `/watch`: image-led livestream page, clear broadcast status, local-time conversion and calendar action |
| Retail `/en/retail-spaces` | Hero, sticky filters and two-column listing, footer | `/share`: photo collection page with supplied photos, sharing steps and the supplied Telegram invitation/QR |
| Contact `/en/contact` | Photo/form split, underline fields, tab selectors, submit state | `/rsvp`: full-height couple portrait, olive form, attendance pills, name/phone/party size/side/message, honest success and failure states |
| About `/en/about-the-investor` | Hero, masked editorial photos, numbered pinned project stories, closing statement | `/our-story`: supplied names, invitation language, faith/verse and portrait narrative; no invented dating history |
| Location and Amenities | Home anchors, interactive large serif lists | `/invitation#venue` and `/invitation#details`: venue/directions and guest-essential selector |
| Privacy `/en/privacy-policy` | Image hero, readable centered text, serif subheadings, footer | `/privacy`: concise factual explanation of wedding RSVP storage and external links, not copied real-estate legal terms |

## Assets and implementation

Nine original supplied photographs are extracted into separate local files for caching and lazy loading. The exact reference heading fonts and Work Sans are locally served. Editorial Old is used for this personal wedding project; the foundry describes free personal use at https://pangrampangram.com/pages/faq and the family at https://pangrampangram.com/products/editorial-old. A commercial reuse requires its appropriate license. No property photography, brand logo, marketing copy, tracking tags, or 3D building assets are used.

Motion targets: 0.45s page curtain, 0.65s capsule expansion, 0.9–1.2s image/text reveals, small stagger intervals, 3 chapters across a bounded sticky sequence. Reduced-motion visitors receive immediate page changes, visible text and ordinary stacked scenes. Small screens use shorter scroll sequences, readable type, and stacked form/detail layouts. All images and fonts are local to the site.

## Verification, 27 October 2026

TypeScript check passed. Browser QA covered the envelope opening, capsule navigation/page transition, desktop masked chapters, 390px phone layout, carousel/next-photo/detail viewer, schedule category and time filters, sharing QR, story layout, and the RSVP form. Local database submission succeeded; changing accept/2 guests to decline/0 guests left exactly one record. Invalid API input returned HTTP 400. No test RSVPs were sent to production.

The old presentation assets were removed. Legacy `/invitation.html` redirects to the new invitation route. The stream remains explicitly marked coming soon because no broadcast URL was supplied.
