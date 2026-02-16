# Research: Build Product Hunt Trending

**Date**: 2025-01-19
**Item**: 001-build-product

## Research Question

Build a production-ready web TOOL called "Product Hunt Trending".

Product derived from radar signal: Product Hunt Trending Analysis. Source: agent.

## Product Spec (FOLLOW THIS EXACTLY)
Problem: Users need a focused tool for: Product Hunt Trending Analysis
Core Loop: User provides input related to Product Hunt Trending Analysis → App processes it with AI → User gets actionable output
User Input: A form or text area where the user provides their specific data or question
Transformation: Analyze the input using AI and produce structured, actionable results
Output: A results panel with the analysis, plus copy and download buttons for the output


## Architecture Requirements
1. MUST have a form/input on the main page where the user provides data
2. MUST have at least one API route (src/app/api/) that processes the input
3. MUST display results that change based on user input
4. MUST have a way to copy/download/export the output
5. MUST NOT have hardcoded data arrays with 5+ items displayed in grids — if you're tempted to create a catalog, STOP and build a tool instead

## What NOT to Build
- Static dashboards with fake metrics
- Technology catalogs with hardcoded entries
- Comparison grids with pre-filled data
- Landing pages without working tools

## Tech Stack (already configured)
Next.js 15, React 19, TypeScript, Tailwind CSS. Add npm packages as needed.
For AI features: use Anthropic SDK with process.env.ANTHROPIC_API_KEY

After implementation, `npm run build` must succeed with zero errors.

## Summary

This project requires building a complete, functional web tool for Product Hunt Trending Analysis from scratch. The current codebase is a minimal Next.js 15 starter with only a basic placeholder page. The application needs to be built following a strict Input → Transform → Output architecture pattern where users provide their own data (not browse a catalog), the system processes it via an API route using AI (Anthropic SDK), and returns actionable, exportable results.

The key challenge is designing a genuinely useful tool that analyzes Product Hunt trends based on user input rather than displaying static data. The tool must include: (1) a primary input mechanism (form/text area), (2) at least one Next.js API route for processing, (3) dynamic results display, and (4) export functionality (copy/download). The application must use TypeScript strict mode, Tailwind CSS v4 (already configured via CSS import, not config file), and the Anthropic SDK for AI features with `process.env.ANTHROPIC_API_KEY`.

## Current State Analysis

### Existing Implementation

The project is in its initial state with minimal setup:

- **Package Configuration** (`package.json:1-23`): Next.js 15.4.0, React 19.1.0, Tailwind CSS 4.1.0 with TypeScript 5.8.0. No additional dependencies installed yet. No AI SDK (Anthropic) present — will need to add `@anthropic-ai/sdk` package.

- **Main Page** (`src/app/page.tsx:1-3`): Contains only a placeholder "Building..." message. This file needs to be completely replaced with the functional tool interface including form input and results display.

- **Layout** (`src/app/layout.tsx:1-15`): Basic Next.js root layout with metadata already configured appropriately. Title: "Product Hunt Trending", Description mentions the radar signal origin. No additional wrappers or providers present — will need to add if required for state management.

- **Styling** (`src/app/globals.css:1-2`): Tailwind CSS v4 is configured using the new `@import "tailwindcss"` syntax (not `@tailwind` directives). This is critical — do NOT create a `tailwind.config.ts` file as v4 uses CSS-based configuration.

- **TypeScript Configuration** (`tsconfig.json:1-40`): Strict mode enabled with path aliases configured (`@/*` maps to `./src/*`). ES2017 target with bundler module resolution suitable for Next.js 15.

- **No API Routes**: Currently there are no files in `src/app/api/` directory. The entire API layer needs to be created from scratch to handle input processing with the Anthropic SDK.

- **No Environment Variables**: `.gitignore:3` shows `.env*.local` is ignored, meaning environment variables should be committed. No `.env` or `.env.example` file exists yet — will need to document `ANTHROPIC_API_KEY` requirement.

### Current Patterns and Conventions

Based on CLAUDE.md documentation:
- **Mandatory Architecture**: Every page must follow Input → Transform → Output pattern
- **Anti-Patterns Prohibited**: No static dashboards, catalogs, fake metrics, or landing pages without functional tools
- **Export Requirements**: Results must be copyable and downloadable
- **API Routes**: All processing must happen in `src/app/api/` routes, not client-side
- **Error Handling**: Proper loading states and error handling required
- **SEO**: Metadata already set, may need Open Graph tags added

### Integration Points

- **AI Processing**: Will integrate Anthropic SDK using `process.env.ANTHROPIC_API_KEY` for trend analysis
- **Client-Server Communication**: Next.js 15 App Router with fetch API or server actions
- **State Management**: React 19 state (useState/useReducer) or consider server actions for form handling
- **Export Functionality**: Will need clipboard API for copy and blob/download API for file export

## Key Files

- `package.json:1-23` - Current dependencies, needs Anthropic SDK added
- `src/app/page.tsx:1-3` - Placeholder page, needs complete rebuild with form + results UI
- `src/app/layout.tsx:1-15` - Root layout with basic metadata, may need providers
- `src/app/globals.css:1-2` - Tailwind v4 import pattern (critical: use @import, not @tailwind)
- `tsconfig.json:25-29` - Path alias configuration (`@/*` → `./src/*`)
- `CLAUDE.md:1-68` - Complete architectural requirements and anti-patterns to avoid
- `.gitignore:1-5` - Shows .env.local is ignored, .env can be committed
- `.wreckit/items/001-build-product/item.json:16-22` - Success criteria: form input, API route, dynamic output, export functionality, zero build errors

### Files That Need to Be Created

- `src/app/api/analyze/route.ts` - API route for processing Product Hunt trend analysis with Anthropic SDK
- `src/components/` - UI components for form input, results display, and export buttons
- `.env` or `.env.example` - Document ANTHROPIC_API_KEY requirement
- Additional types/interfaces for TypeScript type safety

## Technical Considerations

### Dependencies

**Required New Packages:**
- `@anthropic-ai/sdk` - For AI-powered trend analysis (not currently installed)
- Consider: `react-markdown` or similar for formatted AI response display
- Consider: `lucide-react` or `react-icons` for export/copy icon buttons

**Existing Dependencies to Leverage:**
- Next.js 15.4.0 - App Router, API routes, server actions, streaming responses
- React 19.1.0 - Latest features including improved Server Components
- Tailwind CSS 4.1.0 - Utility-first styling (configured via CSS import)
- TypeScript 5.8.0 - Type safety and developer experience

### Patterns to Follow

**Input → Transform → Output Architecture:**
1. **Input Phase**: Create a clean form interface where users can:
   - Paste Product Hunt post URLs or product descriptions
   - Provide context/questions about the product
   - Specify analysis depth (quick vs. comprehensive)

2. **Transform Phase**: API route (`src/app/api/analyze/route.ts`) should:
   - Accept POST requests with user input
   - Use Anthropic SDK to analyze trends, market fit, uniqueness
   - Return structured JSON with analysis results
   - Handle errors gracefully with proper HTTP status codes

3. **Output Phase**: Display results with:
   - Clear visual hierarchy for key insights
   - Expandable sections for detailed analysis
   - Copy to clipboard button (using navigator.clipboard API)
   - Download as JSON/MD/TXT buttons (using Blob and URL.createObjectURL)

**Next.js 15 App Router Patterns:**
- Use Route Handlers for API (`export async function POST(request: Request)`)
- Consider React Server Components for the main page
- Use `fetch` with proper error handling for API communication
- Implement loading states with Suspense or traditional loading state

**Tailwind CSS v4 Specifics:**
- CRITICAL: Use `@import "tailwindcss"` in globals.css (already correct)
- DO NOT create `tailwind.config.ts` — v4 uses CSS-based configuration
- Use Tailwind's utility classes for responsive design (mobile-first approach)
- Consider dark mode support using class strategy if desired

**AI Integration Patterns:**
- Use Anthropic SDK with `process.env.ANTHROPIC_API_KEY`
- Implement proper prompt engineering for trend analysis
- Structure AI responses as JSON for easier parsing and display
- Consider streaming responses for better UX on longer analyses
- Handle API errors (rate limits, invalid keys) gracefully

## Risks and Mitigations

| Risk | Impact | Mitigation |
| ---- | ------ | ---------- |
| **Anthropic API key not configured in environment** | High - App will fail to process requests | Document requirement in README/.env.example, add startup check in API route, provide clear error message to users |
| **Building a catalog instead of a tool** | High - Violates core product requirement | Continuously verify: Does output change based on user input? Are there <5 hardcoded items? If YES to both, it's a tool |
| **AI response quality inconsistency** | Medium - Poor user experience | Implement structured prompts with clear output format, add validation for AI responses, provide example inputs to guide users |
| **Build failures due to TypeScript errors** | Medium - Blocks deployment | Use strict TypeScript, build incrementally, run `npm run build` after major changes, use proper type definitions |
| **Export functionality browser compatibility** | Low - Some users can't export | Feature detection for Clipboard API, fallback to textarea+select for copy, use standard Blob API for downloads |
| **Rate limiting on Anthropic API** | Medium - Tool becomes unreliable | Implement client-side rate limiting, cache results if appropriate, show clear error messages with retry guidance |
| **Poor mobile UX on complex form** | Medium - Reduced accessibility | Use responsive Tailwind classes, test on mobile viewport sizes, consider progressive disclosure for complex inputs |
| **State management complexity** | Low - Unnecessary complexity | Keep it simple with React useState/useReducer, avoid external state management unless absolutely needed |

## Recommended Approach

Based on research findings, here's the high-level implementation strategy:

### Phase 1: Core Infrastructure (Foundation)
1. **Install Dependencies**: Add `@anthropic-ai/sdk` package to package.json
2. **Create API Route**: Build `src/app/api/analyze/route.ts` with:
   - POST endpoint accepting user input
   - Anthropic SDK integration using environment variable
   - Structured prompt engineering for Product Hunt trend analysis
   - Error handling and validation
   - Return JSON with analysis results
3. **Environment Setup**: Create `.env.example` documenting ANTHROPIC_API_KEY requirement

### Phase 2: User Interface (Input Layer)
4. **Rebuild Main Page** (`src/app/page.tsx`):
   - Clean, centered form layout with Tailwind
   - Text area for product URL or description input
   - Optional context/analysis depth fields
   - Submit button with loading state
   - Client-side form validation
5. **Results Display Component**:
   - Initially hidden, shows after analysis completes
   - Clear sections for key insights, market analysis, trends
   - Expandable/collapsible detailed sections
   - Loading skeleton or spinner during processing

### Phase 3: Output & Export (Output Layer)
6. **Export Functionality**:
   - Copy to clipboard button using navigator.clipboard API
   - Download as JSON (structured data)
   - Download as Markdown (formatted report)
   - Download as plain text (simple format)
7. **Error States**:
   - Display API errors clearly to users
   - Retry mechanism for failed requests
   - Input validation feedback

### Phase 4: Polish & Quality Assurance
8. **Responsive Design**: Test and refine for mobile and desktop
9. **Accessibility**: Add proper labels, ARIA attributes, keyboard navigation
10. **SEO Enhancement**: Add Open Graph tags to layout
11. **Build Verification**: Ensure `npm run build` passes with zero errors
12. **User Testing**: Verify the tool is genuinely useful in under 30 seconds

### Key Design Decisions

**Tool Concept**: "Product Hunt Trending Analyzer" - Users paste a Product Hunt URL or product description, and the AI analyzes:
- Market trends and category positioning
- Unique value proposition
- Target audience insights
- Competitive landscape
- Growth potential indicators
- Key differentiators

**Input Format**: Flexible text area accepting:
- Product Hunt URLs (extract and analyze content)
- Product descriptions directly pasted
- Specific questions about the product

**Output Structure** (from AI):
```json
{
  "productName": "Extracted name",
  "oneLineSummary": "Quick overview",
  "marketPositioning": "Analysis of market fit",
  "targetAudience": "Who this is for",
  "keyDifferentiators": ["array", "of", "features"],
  "trendAnalysis": "Current market trends relevance",
  "growthPotential": "Assessment with reasoning",
  "recommendations": ["actionable", "insights"]
}
```

**Export Formats**:
- **Copy**: Plain text summary to clipboard
- **JSON**: Full structured data for developers
- **Markdown**: Formatted report for documentation
- **PDF** (optional): If time permits, using jsPDF or similar

## Open Questions

1. **Product Hunt API Integration**: Should we integrate the official Product Hunt API to fetch product data, or rely on users pasting product information? The spec says "AI processes input" which suggests user-pasted content, but API integration could provide richer data. *Decision*: Start with user-pasted content to stay focused on tool functionality, consider API integration as enhancement.

2. **Analysis Depth Options**: Should users be able to choose between "Quick Analysis" (faster, less tokens) and "Deep Analysis" (more comprehensive, slower)? This affects AI prompt design and token usage/costs. *Decision*: Implement as optional form field with sensible default.

3. **Response Caching**: Should we cache analysis results to avoid re-analyzing the same product? This would require storage (Redis, database) and adds complexity. *Decision*: Skip caching for MVP — keep it simple and stateless.

4. **Streaming vs. Non-Streaming AI Responses**: Should we use Anthropic's streaming API for progressive result display, or wait for complete response? Streaming improves perceived performance but adds complexity. *Decision*: Use non-streaming for MVP simplicity, streaming can be enhancement.

5. **Export Format Priority**: Which export formats are most important? JSON, Markdown, TXT, PDF? *Decision*: Implement JSON (developers) and Markdown (readers) as primary, TXT as fallback, skip PDF for MVP.

6. **Error Message Detail**: How much technical detail should we show users when API calls fail? *Decision*: Show user-friendly messages with retry guidance, log technical details server-side.

7. **Form Input Validation**: What constitutes valid input? Minimum length, required patterns, URL validation? *Decision*: Require minimum 50 characters, accept URLs or free text, validate before API call.

8. **Mobile UI Compromises**: Complex forms are challenging on mobile. Should we create mobile-specific layout? *Decision*: Use responsive Tailwind classes to create single-column layout on mobile that expands to multi-column on desktop.

9. **Anthropic Model Selection**: Which Anthropic model to use? Claude 3 Haiku (fast, cheap), Sonnet (balanced), Opus (best quality)? *Decision*: Use Claude 3.5 Sonnet (current default) for balance of quality and speed, allow model override via env var for flexibility.

10. **Token Usage & Cost Monitoring**: Should we implement any safeguards against excessive API usage? *Decision*: Add rate limiting (e.g., 10 requests per minute per IP) to prevent abuse and control costs.
