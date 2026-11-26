# Portfolio publication rules

Typography: never leave conjunctions at the end of a line. Bind each conjunction (and, or, but, &, и, а, но, или, etc.) to the following word with a non-breaking space. Let the pair move to the next line naturally; do not introduce unconditional line breaks or change wording. Apply to all live website text.


## Start here

At the start of every portfolio task, read this file and the parent project's [AGENTS.md](../AGENTS.md), then read [the current handoff](../HANDOFF_CODEX_2026-11-25.md). Read the relevant parts of [HANDOFF.md](../HANDOFF.md) for Figma references and historical decisions. Investigate the task against these rules before proposing or editing anything. For design work, inspect the relevant Figma reference, existing HTML and CSS, and the affected desktop or mobile layout. Work in site-github. Treat figma-main as archival and do not run tools/build-gh.js.

## Site design system

Base every design change on the portfolio site's design system in Figma. Before editing, check the relevant Figma components, variants, and styles, then reuse their existing equivalents in the site's code. Apply the design system to typography (including fonts and heading styles), colors, spacing, corner radii, and other visual properties. If the relevant Figma reference is unavailable or ambiguous, identify what is missing and ask for the reference or clarification. Introduce new elements, component variants, or design tokens only when the user explicitly requests them.

The [Portfolio-AM-2026 Design System](https://www.figma.com/design/5rrt0qWmU5DM6ZXBmIsEIo/Portfolio-AM-2026) includes:

- [Foundations](https://www.figma.com/design/5rrt0qWmU5DM6ZXBmIsEIo/Portfolio-AM-2026?node-id=341-1121) for tokens, grids, and the typography reference.
- [Components](https://www.figma.com/design/5rrt0qWmU5DM6ZXBmIsEIo/Portfolio-AM-2026?node-id=341-1327), including Get in touch (358:2782) and Service accordion (441:1590, Closed/Open in Desktop/Mobile layouts).
- [Case blocks](https://www.figma.com/design/5rrt0qWmU5DM6ZXBmIsEIo/Portfolio-AM-2026?node-id=341-1436) with Desktop and Mobile layout variants.

Typography uses Gabarito for display, Onest for body, Fraunces italic for accents, and Fustat for arrows only. Use the existing role-based text styles and the Typography variable collection. Its size scale runs from size/100 through size/1300 (12–128 px in Desktop and 12–52 px in Mobile). The Abhay Reference styles are reference material and require Alina's approval before removal.

The Grid/Desktop 1440 style uses 12 columns, 24 px gutters, and 40 px margins (home frame 341:1518). Grid/Mobile 375 uses 4 columns, 16 px gutters, and 16 px margins (home frame 358:2397). Both use grid/* variables from Primitives. The parent AGENTS.md records the approved palette, type sizes, controls, radii, and CSS classes.

## Evidence and verification

Give only verified information as fact. Check version-specific features, settings, exact menu paths, and expected behavior against authoritative documentation or direct observation in the relevant version and environment. If you cannot verify a detail, say so plainly and do not present it as an instruction. Label hypotheses as such. Report exactly what you tested. A source-code or deployment check does not verify behavior on the user's device.

## UX guidance

For every UX question, and whenever the user asks about Nielsen Norman Group (NN/g), verify the answer against current UX best practices and consult relevant original NN/g publications. Cite the specific sources and explain how the findings apply to the portfolio and its users. Use the rigor expected of a senior UX/UI designer. Clearly distinguish published findings from your own design judgment, and say when NN/g does not directly address the question.
