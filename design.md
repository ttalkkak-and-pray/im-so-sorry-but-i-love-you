# Design System: The Bureaucratic Editorial

## 1. Overview & Creative North Star
**Creative North Star: The Modern Scribe**

This design system is a digital translation of *Won-go-ji* (traditional Korean manuscript paper). It rejects the "floaty" nature of modern SaaS design in favor of "Bureaucratic Sincerity"—a philosophy that values structural permanence, tactile deliberate writing, and the rhythmic precision of a grid.

To move beyond a generic "paper" theme, we employ **Intentional Asymmetry**. While the underlying grid is rigid, content is placed with an editorial eye, allowing for wide margins and sudden, sharp focal points (like a cinnabar stamp on a government document). We do not use depth to mimic 3D space; we use layering to mimic stacked physical documents.

---

## 2. Colors
Our palette is rooted in natural pigments and aged materials. It avoids the synthetic "pure white" of digital screens to reduce eye strain and establish a historical weight.

### Palette Roles
- **Primary (`#046464`)**: Inspired by the teal-green ink of manuscript grids. Used for structural markers and primary actions.
- **Secondary (`#B52424`)**: A "Cinnabar Red" reserved for "stamps"—validation, critical alerts, and high-prestige branding elements.
- **Surface & Background (`#FCF9F0`)**: An aged parchment tone that serves as our canvas.
- **Neutral/Text (`#1C1C17`)**: A deep charcoal, mimicking dried ink rather than digital black.

### The "No-Shadow" Rule
This system prohibits the use of standard CSS drop shadows. Depth is achieved through **Tonal Layering**:
- **Nesting Hierarchy:** Place a `surface-container-highest` (`#E5E2DA`) element inside a `surface` (`#FCF9F0`) background to create a "recessed" or "cut-out" effect.
- **The Ink Bleed:** For floating elements (modals), use a subtle `surface-variant` with a 1px `outline-variant` (`#BEC9C8`) at 40% opacity. This mimics the sharp edge of a cut sheet of paper.

---

## 3. Typography
We use a high-contrast serif pairing to evoke the feeling of a printed literary journal.

- **Display & Headline (Noto Serif):** These should be treated as "Set Type." Large headings (`display-lg` at 3.5rem) should use tight letter-spacing to feel like a masthead.
- **Body & Title (Newsreader):** A sophisticated serif with variable weights. It mimics the rhythm of a handwritten manuscript.
- **Labels (Inter):** A clean sans-serif used sparingly for functional metadata (timestamps, page numbers) to provide a modern, bureaucratic contrast to the literary serifs.

**The Editorial Rhythm:** Always prioritize large top-margins (Scale `16` or `20`) for headlines to give the impression of a new chapter starting on a fresh page.

---

## 4. Elevation & Depth
In this system, "Up" does not mean "Closer to the light source." It means "The Top Sheet of Paper."

- **The Layering Principle:** Use the `surface-container` tiers to define priority.
- `surface-container-lowest`: Background canvas.
- `surface-container-high`: Interactive cards or document blocks.
- `surface-container-highest`: Active states or navigation sidebars.
- **Tactile Borders:** Instead of shadows, use the `outline` token (`#6F7979`) at a stroke of `px` (1px) to define the boundaries of the "manuscript paper."
- **Glassmorphism (The Vellum Effect):** For overlays, use `surface` colors at 85% opacity with a heavy `backdrop-blur`. This simulates vellum or semi-transparent tracing paper used in traditional drafting.

---

## 5. Components

### Buttons
- **Primary:** Square corners (`0px`), `primary` background, `on-primary` text. No gradients. The hover state should simply be a shift to `primary-container`.
- **Secondary (The Stamp):** For unique actions, use a `secondary` (`#B52424`) border with `secondary` text. It should feel like a seal of approval.

### Inputs & Fields
- **Manuscript Style:** Inputs should not be boxes. They should be underlined or enclosed in a visible grid cell using `outline-variant`.
- **Focus State:** When a user clicks an input, the background should shift to `primary-fixed-dim` (`#88D3D3`) at 10% opacity, mimicking a highlighter mark.

### Cards & Lists
- **The "No-Divider" Rule:** Forbid 1px horizontal lines between list items. Use the Spacing Scale (`4` or `5`) to create separation.
- **Grid Grouping:** Use a `surface-container-low` background to group related items, creating a "block" of content that feels like a separate sheet of paper.

### Signature Component: The "Dojo" (Seal)
A small, square component using the `secondary` color and `headline-sm` type. Used to indicate "Status: Finalized" or "Verified." It must be placed slightly askew (1-2 degree rotation) to mimic a hand-pressed ink stamp.

---

## 6. Do's and Don'ts

### Do
- **Embrace the Grid:** Use the `outline-variant` to create subtle vertical and horizontal lines that mimic the *Won-go-ji* paper structure.
- **Use Square Corners:** Every single radius must be `0px`. This is non-negotiable to maintain the bureaucratic aesthetic.
- **Prioritize Legibility:** Use `charcoal` on `parchment` for all long-form reading.

### Don't
- **No Rounded Corners:** Do not use `border-radius`. Even a 2px radius breaks the "printed document" illusion.
- **No Soft Gradients:** Avoid "modern" purple/blue gradients. If a gradient is needed, it must be a subtle transition between `primary` and `primary-container`.
- **No Floating Action Buttons (FAB):** In a manuscript world, everything has a fixed place. Buttons should be docked or inline, never floating "above" the content.

### Accessibility Note
The contrast between `on-surface` (`#1C1C17`) and `surface` (`#FCF9F0`) is exceptionally high, exceeding WCAG AAA standards. Ensure that functional secondary text uses `outline` (`#6F7979`) to maintain a clear hierarchy without losing readability.
