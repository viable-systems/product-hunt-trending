# Product Hunt Trending

## What This Product Does
Product derived from radar signal: Product Hunt Trending Analysis. Source: agent.

## CRITICAL: Product Architecture — Input → Transform → Output

Every page of this product MUST follow this pattern:

1. **INPUT**: The user provides their own data through a form, file upload, text area, or URL input.
   - The app MUST have at least one primary input mechanism on the main page.
   - Examples: paste text to analyze, upload a file to process, enter a URL to scan, fill a form to generate output.

2. **TRANSFORM**: The app processes the user's input and produces something valuable.
   - Use a Next.js API route (`src/app/api/`) to handle the processing.
   - The transformation should be the core value — what makes this tool useful.
   - Examples: analyze text, generate a report, convert format, extract insights, score/rate input.

3. **OUTPUT**: The user receives a tangible result they can use immediately.
   - Results should be displayed clearly AND be exportable (copy button, download, etc.).
   - Examples: downloadable file, copyable analysis, shareable report, printable document.

## MANDATORY Anti-Patterns — DO NOT BUILD THESE

- **NO static dashboards** with hardcoded data arrays. If there's a data grid, the data MUST come from user input or an API call.
- **NO catalogs or directories** with pre-filled content. The user provides the content.
- **NO fake metrics dashboards** showing random numbers. Metrics must derive from user input.
- **NO technology timelines, comparison charts, or "explore X" pages** with hardcoded entries.
- **NO landing pages** without functional tools on the same page.
- **NO placeholder or "coming soon"** anything.

If you find yourself creating an array of 5+ hardcoded objects to display in a grid, STOP. You are building a catalog, not a tool. Rethink the approach.

## Build Requirements
- Next.js 15 with App Router (src/app/ directory)
- TypeScript strict mode
- Tailwind CSS for styling
- Clean, minimal design (light or dark theme, your choice based on the product's purpose)
- Responsive layout (mobile + desktop)
- Proper error handling and loading states
- At least one `src/app/api/` route that processes user input
- A form or input mechanism on the main page that the user interacts with
- A results display area that shows processed output
- A way to export/copy/download the output
- SEO metadata (title, description, Open Graph)
- `npm run build` must succeed with zero errors

## Technical Stack
- next: ^15.4.0
- react: ^19.1.0
- tailwindcss v4 (already configured — uses `@import "tailwindcss"` in globals.css, NOT `@tailwind` directives)
- TypeScript (already configured)
- You may add additional npm packages as needed (AI SDK, file parsers, etc.)
- For AI-powered features: use the Anthropic SDK with `process.env.ANTHROPIC_API_KEY` (it will be set in production)
- IMPORTANT: Do NOT create a tailwind.config.ts file — Tailwind v4 is configured via CSS, not a JS config file

## Commands
- `npm run dev` — Start dev server
- `npm run build` — Production build (MUST pass)

## Quality Check Before You're Done
Ask yourself:
1. Can a real person visit this site and DO something useful within 30 seconds?
2. Does the output change based on what the user provides?
3. Would someone bookmark this tool to use again?

If NO to any of these, you've built a brochure, not a tool. Fix it.
