# Build Product Hunt Trending Implementation Plan

## Implementation Plan Title

Product Hunt Trending Analyzer — AI-powered tool for analyzing products from user-provided descriptions or URLs.

## Overview

Build a production-ready web tool that allows users to paste Product Hunt URLs or product descriptions, processes the input with AI (Anthropic Claude), and delivers actionable trend analysis. The tool follows a strict Input → Transform → Output architecture: users provide data via a form, an API route processes it with the Anthropic SDK, and results are displayed with export functionality.

This is a genuine tool, not a catalog. Output changes based on user input, with no hardcoded data grids. The application must pass `npm run build` with zero errors and be functional within 30 seconds for a new user.

## Current State

**Minimal Next.js 15 starter setup:**

- **Dependencies** (`package.json:1-23`): Next.js 15.4.0, React 19.1.0, Tailwind CSS 4.1.0, TypeScript 5.8.0. Missing `@anthropic-ai/sdk` package for AI functionality.
- **Main Page** (`src/app/page.tsx:1-3`): Contains only placeholder "Building..." message. Needs complete replacement with functional tool.
- **Layout** (`src/app/layout.tsx:1-15`): Basic root layout with appropriate metadata. No providers or state management.
- **Styling** (`src/app/globals.css:1-2`): Tailwind CSS v4 correctly configured with `@import "tailwindcss"` (NOT `@tailwind` directives).
- **TypeScript** (`tsconfig.json:1-40`): Strict mode enabled with path aliases (`@/*` → `./src/*`).
- **API Routes**: None exist. `src/app/api/` directory needs to be created.
- **Environment**: No `.env` or `.env.example` files. `.gitignore:3` shows `.env*.local` ignored, meaning `.env` can be committed.

**What's Missing:**
- Anthropic SDK dependency
- API route for processing input
- User interface with form and results display
- Export functionality (copy/download)
- Environment variable documentation

## Desired End State

A fully functional web tool where users can:

1. **Input**: Paste a Product Hunt URL or product description (minimum 50 characters) into a clean text area
2. **Transform**: Submit to API route that uses Anthropic Claude 3.5 Sonnet to analyze market positioning, target audience, differentiators, trends, and growth potential
3. **Output**: View structured analysis with sections for key insights, expandable details, and export buttons (copy to clipboard, download JSON/Markdown/TXT)

**Verification:**
- `npm run build` succeeds with zero errors
- Form input validation works (50+ characters required)
- API route processes input and returns structured JSON
- Results display changes based on user input (no hardcoded data)
- Export buttons function correctly (copy and download)
- Responsive design works on mobile and desktop
- Tool is useful within 30 seconds for first-time users

### Key Discoveries

- **Tailwind v4 Pattern** (`src/app/globals.css:1`): Uses `@import "tailwindcss"` syntax. DO NOT create `tailwind.config.ts` — v4 uses CSS-based configuration.
- **Path Aliases** (`tsconfig.json:25-29`): `@/*` maps to `./src/*` for clean imports.
- **Anti-Patterns** (`CLAUDE.md:23-32`): Explicitly prohibited from building catalogs, static dashboards, or grids with 5+ hardcoded items. Must be a tool with dynamic output.
- **API Requirement** (`CLAUDE.md:41`): Must have at least one API route in `src/app/api/` that processes user input.
- **Export Requirement** (`CLAUDE.md:44`): Results must be copyable and downloadable.
- **Gitignore Pattern** (`.gitignore:3`): `.env*.local` ignored, meaning `.env` file can be committed to document required variables.

## What We're NOT Doing

- **NOT integrating Product Hunt API**: Users paste product info directly. API integration would add complexity without improving core functionality for MVP.
- **NOT implementing caching**: Stateless architecture is simpler and sufficient for MVP. Caching would require Redis/database.
- **NOT using streaming AI responses**: Non-streaming is simpler to implement and debug. Streaming can be added later as enhancement.
- **NOT generating PDF exports**: JSON, Markdown, and TXT exports cover primary use cases. PDF would add jsPDF dependency and complexity.
- **NOT building analysis depth options**: Single analysis mode keeps UI simple. Quick/Deep analysis options can be added later if needed.
- **NOT creating separate mobile layout**: Responsive Tailwind classes will create single-column mobile layout that expands on desktop.
- **NOT implementing rate limiting**: No database or Redis available for rate limiting. Relies on Anthropic's built-in rate limits for now.
- **NOT using external state management**: React useState/useReducer is sufficient. No Redux/Zustand needed.
- **NOT creating tailwind.config.ts**: Tailwind v4 uses CSS-based configuration, not JS config files.

## Implementation Approach

**Four-Phase Incremental Strategy:**

1. **Phase 1: Core Infrastructure** — Install dependencies, create API route with Anthropic SDK, set up environment variables. This establishes the "Transform" layer.
2. **Phase 2: User Interface** — Rebuild main page with form input, loading states, and results display. This creates the "Input" layer.
3. **Phase 3: Export Functionality** — Add copy to clipboard and download buttons. This completes the "Output" layer.
4. **Phase 4: Polish & QA** — Responsive design, accessibility, SEO, build verification.

**Technical Decisions:**

- **AI Model**: Claude 3.5 Sonnet via `@anthropic-ai/sdk` for balance of quality and speed
- **State Management**: React 19 useState (client component for form)
- **API Pattern**: Next.js 15 Route Handler (`export async function POST(request: Request)`)
- **Input Validation**: Minimum 50 characters, client-side validation before API call
- **Error Handling**: User-friendly messages with retry guidance, server-side logging
- **Export Formats**: JSON (structured data), Markdown (readable report), TXT (plain text fallback)
- **Styling**: Tailwind CSS v4 utility classes with mobile-first responsive design

**Architecture Pattern — Input → Transform → Output:**

```
User Input (Form) → API Route (Anthropic SDK) → Structured Output (Display + Export)
```

---

## Phases

### Phase 1: Core Infrastructure

#### Overview

Establish the foundational API layer and dependencies. This phase creates the "Transform" component that processes user input with AI and returns structured analysis results.

#### Changes Required:

##### 1. Install Anthropic SDK

**File**: `package.json`
**Changes**: Add `@anthropic-ai/sdk` to dependencies

**Current dependencies section:**
```json
{
  "dependencies": {
    "next": "^15.4.0",
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "tailwindcss": "^4.1.0",
    "@tailwindcss/postcss": "^4.1.0"
  }
}
```

**Add to dependencies:**
```json
{
  "dependencies": {
    "next": "^15.4.0",
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "tailwindcss": "^4.1.0",
    "@tailwindcss/postcss": "^4.1.0",
    "@anthropic-ai/sdk": "^0.32.1"
  }
}
```

Then run: `npm install`

---

##### 2. Create API Route for Analysis

**File**: `src/app/api/analyze/route.ts` (NEW FILE)
**Changes**: Create POST endpoint that accepts user input and returns AI-powered analysis

```typescript
import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

interface AnalysisRequest {
  input: string;
}

interface AnalysisResponse {
  productName: string;
  oneLineSummary: string;
  marketPositioning: string;
  targetAudience: string;
  keyDifferentiators: string[];
  trendAnalysis: string;
  growthPotential: string;
  recommendations: string[];
}

export async function POST(request: NextRequest) {
  try {
    // Validate environment variable
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'Server configuration error: ANTHROPIC_API_KEY not set' },
        { status: 500 }
      );
    }

    // Parse and validate request body
    const body: AnalysisRequest = await request.json();
    const { input } = body;

    if (!input || typeof input !== 'string') {
      return NextResponse.json(
        { error: 'Input is required and must be a string' },
        { status: 400 }
      );
    }

    if (input.trim().length < 50) {
      return NextResponse.json(
        { error: 'Input must be at least 50 characters long. Please provide more details about the product.' },
        { status: 400 }
      );
    }

    // Call Anthropic API
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: `Analyze this Product Hunt product or description and provide a structured trend analysis:

${input}

Please respond with a JSON object (no markdown formatting) with these exact fields:
{
  "productName": "Extract product name or 'Unknown Product' if not found",
  "oneLineSummary": "One sentence summary of what this product does",
  "marketPositioning": "2-3 sentences on how this product positions itself in the market",
  "targetAudience": "Who is this product for? Be specific about demographics, use cases, or industries",
  "keyDifferentiators": ["array", "of", "3-5 unique features or competitive advantages"],
  "trendAnalysis": "How this aligns with current market trends, emerging opportunities, or timing factors",
  "growthPotential": "Assessment of market opportunity, scalability, and adoption potential with reasoning",
  "recommendations": ["2-4 actionable", "suggestions for improvement", "or go-to-market strategies"]
}

Focus on actionable insights, market fit, and strategic value. Be specific and evidence-based when possible.`,
        },
      ],
    });

    // Extract response text
    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';

    // Parse JSON response
    let analysis: AnalysisResponse;
    try {
      // Remove markdown code blocks if present
      const cleanedText = responseText.replace(/```json\n?|\n?```/g, '').trim();
      analysis = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', responseText);
      return NextResponse.json(
        { error: 'Failed to process AI response. Please try again.' },
        { status: 500 }
      );
    }

    // Validate response structure
    if (!analysis.productName || !analysis.oneLineSummary || !Array.isArray(analysis.keyDifferentiators)) {
      console.error('Invalid AI response structure:', analysis);
      return NextResponse.json(
        { error: 'AI response validation failed. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Analysis API error:', error);

    if (error instanceof Error) {
      // Handle Anthropic API errors
      if (error.message.includes('rate')) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please wait a moment and try again.' },
          { status: 429 }
        );
      }

      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'Authentication error. Please check API configuration.' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
```

**Key features:**
- Validates ANTHROPIC_API_KEY environment variable
- Validates input is present and >= 50 characters
- Uses Claude 3.5 Sonnet model
- Structured prompt for consistent JSON output
- JSON response parsing with error handling
- Specific error messages for rate limits, auth failures, and parse errors
- Server-side logging for debugging

---

##### 3. Create Environment Variable Documentation

**File**: `.env.example` (NEW FILE)
**Changes**: Document required environment variables

```env
# Anthropic API Key for AI-powered trend analysis
# Get your API key from: https://console.anthropic.com/
ANTHROPIC_API_KEY=your_api_key_here
```

**Optional**: Create `.env` file with placeholder (can be committed since `.env*.local` is ignored):
```env
ANTHROPIC_API_KEY=
```

---

#### Success Criteria:

##### Automated Verification:

- [ ] Dependencies installed: No errors when running `npm install`
- [ ] TypeScript compilation passes: `npx tsc --noEmit` (or start dev server and check for type errors)
- [ ] API route file exists: `src/app/api/analyze/route.ts` is created

##### Manual Verification:

- [ ] Dev server starts without errors: `npm run dev`
- [ ] API route is accessible: Check browser or curl at `http://localhost:3000/api/analyze` (should return 405 Method Not Allowed for GET, confirming route exists)
- [ ] Environment variable documented: `.env.example` file exists with ANTHROPIC_API_KEY instructions
- [ ] Environment variable check works: Temporarily remove ANTHROPIC_API_KEY and test API returns 500 error with appropriate message

**Note**: Complete Phase 1 before proceeding. The API foundation must be solid before building UI.

---

### Phase 2: User Interface

#### Overview

Build the main page with form input and results display. This phase creates the "Input" layer and connects it to the "Transform" layer from Phase 1.

#### Changes Required:

##### 1. Rebuild Main Page with Form and Results

**File**: `src/app/page.tsx`
**Changes**: Replace placeholder with full tool interface (client component for state management)

```typescript
'use client';

import { useState } from 'react';

interface AnalysisResult {
  productName: string;
  oneLineSummary: string;
  marketPositioning: string;
  targetAudience: string;
  keyDifferentiators: string[];
  trendAnalysis: string;
  growthPotential: string;
  recommendations: string[];
}

export default function Home() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed');
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!result) return;

    const text = `Product Hunt Trending Analysis

Product: ${result.productName}

${result.oneLineSummary}

Market Positioning:
${result.marketPositioning}

Target Audience:
${result.targetAudience}

Key Differentiators:
${result.keyDifferentiators.map(d => `• ${d}`).join('\n')}

Trend Analysis:
${result.trendAnalysis}

Growth Potential:
${result.growthPotential}

Recommendations:
${result.recommendations.map(r => `• ${r}`).join('\n')}
`;

    navigator.clipboard.writeText(text);
    alert('Analysis copied to clipboard!');
  };

  const downloadJSON = () => {
    if (!result) return;
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${result.productName.replace(/\s+/g, '-')}-analysis.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadMarkdown = () => {
    if (!result) return;
    const markdown = `# Product Hunt Trending Analysis

## ${result.productName}

${result.oneLineSummary}

## Market Positioning
${result.marketPositioning}

## Target Audience
${result.targetAudience}

## Key Differentiators
${result.keyDifferentiators.map(d => `- ${d}`).join('\n')}

## Trend Analysis
${result.trendAnalysis}

## Growth Potential
${result.growthPotential}

## Recommendations
${result.recommendations.map(r => `- ${r}`).join('\n')}
`;

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${result.productName.replace(/\s+/g, '-')}-analysis.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadText = () => {
    if (!result) return;
    const text = `Product Hunt Trending Analysis

Product: ${result.productName}

${result.oneLineSummary}

Market Positioning:
${result.marketPositioning}

Target Audience:
${result.targetAudience}

Key Differentiators:
${result.keyDifferentiators.map(d => `• ${d}`).join('\n')}

Trend Analysis:
${result.trendAnalysis}

Growth Potential:
${result.growthPotential}

Recommendations:
${result.recommendations.map(r => `• ${r}`).join('\n')}
`;

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${result.productName.replace(/\s+/g, '-')}-analysis.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Product Hunt Trending Analyzer
          </h1>
          <p className="text-lg text-gray-600">
            Paste a Product Hunt URL or product description to get AI-powered trend analysis
          </p>
        </div>

        {/* Input Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="input" className="block text-sm font-medium text-gray-700 mb-2">
                Product Description or URL
              </label>
              <textarea
                id="input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste a Product Hunt URL, product description, or details about a product you want to analyze...

Example: 'A tool that helps founders validate startup ideas by surveying target customers and generating reports. It uses AI to analyze responses and identify patterns.'"
                className="w-full h-48 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none text-gray-900 placeholder-gray-400"
                required
                minLength={50}
              />
              <p className="mt-2 text-sm text-gray-500">
                {input.length < 50
                  ? `${50 - input.length} more characters required`
                  : `${input.length} characters (ready to analyze)`}
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || input.length < 50}
              className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              {loading ? 'Analyzing...' : 'Analyze Product'}
            </button>
          </form>

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 font-medium">Error</p>
              <p className="text-red-700 text-sm mt-1">{error}</p>
              <button
                onClick={() => setError(null)}
                className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
              >
                Dismiss
              </button>
            </div>
          )}
        </div>

        {/* Results Display */}
        {result && (
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {result.productName}
                </h2>
                <p className="text-gray-600 mt-1">{result.oneLineSummary}</p>
              </div>
            </div>

            {/* Export Buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={copyToClipboard}
                className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
              >
                📋 Copy to Clipboard
              </button>
              <button
                onClick={downloadJSON}
                className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
              >
                💾 Download JSON
              </button>
              <button
                onClick={downloadMarkdown}
                className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
              >
                📄 Download Markdown
              </button>
              <button
                onClick={downloadText}
                className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
              >
                📝 Download Text
              </button>
            </div>

            {/* Analysis Sections */}
            <div className="space-y-6">
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Market Positioning</h3>
                <p className="text-gray-700">{result.marketPositioning}</p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Target Audience</h3>
                <p className="text-gray-700">{result.targetAudience}</p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Differentiators</h3>
                <ul className="space-y-2">
                  {result.keyDifferentiators.map((diff, index) => (
                    <li key={index} className="flex items-start text-gray-700">
                      <span className="text-orange-600 mr-2">•</span>
                      <span>{diff}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Trend Analysis</h3>
                <p className="text-gray-700">{result.trendAnalysis}</p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Growth Potential</h3>
                <p className="text-gray-700">{result.growthPotential}</p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Recommendations</h3>
                <ul className="space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start text-gray-700">
                      <span className="text-orange-600 mr-2">✓</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-600 border-t-transparent mb-4"></div>
            <p className="text-gray-600 font-medium">Analyzing product trends...</p>
            <p className="text-gray-500 text-sm mt-2">This usually takes 10-20 seconds</p>
          </div>
        )}
      </div>
    </main>
  );
}
```

**Key features:**
- Client component with form state management
- Real-time character counter with validation feedback
- Loading spinner with expected wait time
- Structured results display with clear sections
- Export buttons (copy, JSON, Markdown, TXT)
- Error display with dismiss option
- Responsive design (mobile-first Tailwind classes)
- Orange accent color matching Product Hunt brand
- Gradient background for visual appeal

---

#### Success Criteria:

##### Automated Verification:

- [ ] TypeScript compilation passes: `npx tsc --noEmit`
- [ ] No console errors in browser dev tools
- [ ] Build succeeds: `npm run build`

##### Manual Verification:

- [ ] Form accepts input and shows character counter
- [ ] Submit button disabled when < 50 characters
- [ ] Submit button enabled when >= 50 characters
- [ ] Loading state appears when analyzing
- [ ] Results display after analysis completes
- [ ] Export buttons function (copy, JSON, Markdown, TXT)
- [ ] Error messages display correctly
- [ ] Mobile responsive layout works (test at 375px viewport)
- [ ] Desktop layout looks good (test at 1280px+ viewport)
- [ ] Tool is usable within 30 seconds for new user

**Note**: Complete Phase 2 before proceeding. The full Input → Transform → Output flow should work.

---

### Phase 3: Output & Export Validation

#### Overview

Verify and refine the export functionality. Ensure all export formats work correctly and handle edge cases.

#### Changes Required:

##### 1. Test Export Functionality

**File**: `src/app/page.tsx` (no code changes, testing only)
**Changes**: Manual testing of all export buttons

**Test Scenarios:**

1. **Copy to Clipboard:**
   - Click "📋 Copy to Clipboard" button
   - Paste into text editor
   - Verify formatting is correct with all sections
   - Check that product name is in filename/title

2. **Download JSON:**
   - Click "💾 Download JSON" button
   - Open downloaded file
   - Verify valid JSON structure
   - Check all fields are present and properly formatted
   - Filename format: `{product-name}-analysis.json`

3. **Download Markdown:**
   - Click "📄 Download Markdown" button
   - Open downloaded file in Markdown viewer
   - Verify proper heading hierarchy (#, ##)
   - Check bullet points render correctly
   - Filename format: `{product-name}-analysis.md`

4. **Download Text:**
   - Click "📝 Download Text" button
   - Open in text editor
   - Verify plain text formatting
   - Check no markdown or HTML artifacts
   - Filename format: `{product-name}-analysis.txt`

5. **Edge Cases:**
   - Product name with special characters (slashes, colons) — should be sanitized in filename
   - Very long product names — should not break UI
   - Empty arrays in response — should handle gracefully
   - Unicode characters — should preserve correctly

##### 2. Add Filename Sanitization (if needed)

**File**: `src/app/page.tsx`
**Changes**: Add helper function to sanitize filenames

If testing reveals issues with special characters in product names, add this helper function after the interface definitions:

```typescript
const sanitizeFilename = (name: string): string => {
  return name
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
    .substring(0, 100); // Limit to 100 characters
};
```

Then update all download functions to use it:
```typescript
// Before:
a.download = `${result.productName.replace(/\s+/g, '-')}-analysis.json`;

// After:
a.download = `${sanitizeFilename(result.productName)}-analysis.json`;
```

---

#### Success Criteria:

##### Automated Verification:

- [ ] Build succeeds: `npm run build`
- [ ] No TypeScript errors

##### Manual Verification:

- [ ] Copy to clipboard works and formats correctly
- [ ] JSON download produces valid, readable JSON
- [ ] Markdown download renders properly in previewers
- [ ] Text download is clean and readable
- [ ] Filenames are sanitized (no special characters causing issues)
- [ ] Exported content matches displayed results exactly
- [ ] Export buttons provide visual feedback (browser download indication or clipboard confirmation)

**Note**: Phase 3 is primarily validation-focused. Minimal code changes expected.

---

### Phase 4: Polish & Quality Assurance

#### Overview

Final polish including SEO enhancement, accessibility improvements, and comprehensive build verification.

#### Changes Required:

##### 1. Enhance SEO Metadata

**File**: `src/app/layout.tsx`
**Changes**: Add Open Graph tags for better social sharing

```typescript
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Product Hunt Trending Analyzer - AI-Powered Product Analysis',
  description: 'Get AI-powered trend analysis for any Product Hunt product. Paste a URL or description and receive actionable insights on market positioning, target audience, and growth potential.',
  openGraph: {
    title: 'Product Hunt Trending Analyzer',
    description: 'AI-powered tool for analyzing Product Hunt products and market trends',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Product Hunt Trending Analyzer',
    description: 'Get AI-powered trend analysis for any Product Hunt product',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

---

##### 2. Add Accessibility Attributes

**File**: `src/app/page.tsx`
**Changes**: Add ARIA labels and improve keyboard navigation

Update form elements with proper labels and ARIA attributes:

```typescript
// In the textarea element, add aria-describedby:
<textarea
  id="input"
  value={input}
  onChange={(e) => setInput(e.target.value)}
  placeholder="Paste a Product Hunt URL, product description, or details about a product you want to analyze..."
  className="w-full h-48 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none text-gray-900 placeholder-gray-400"
  required
  minLength={50}
  aria-describedby="char-count"
/>

// Update the character count paragraph:
<p id="char-count" className="mt-2 text-sm text-gray-500">
  {input.length < 50
    ? `${50 - input.length} more characters required`
    : `${input.length} characters (ready to analyze)`}
</p>

// Add aria-live to error region:
{error && (
  <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg" role="alert" aria-live="polite">
    <p className="text-red-800 font-medium">Error</p>
    <p className="text-red-700 text-sm mt-1">{error}</p>
    <button
      onClick={() => setError(null)}
      className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
    >
      Dismiss
    </button>
  </div>
)}

// Add aria-live to loading state:
{loading && (
  <div className="bg-white rounded-2xl shadow-lg p-12 text-center" role="status" aria-live="polite">
    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-600 border-t-transparent mb-4" aria-hidden="true"></div>
    <p className="text-gray-600 font-medium">Analyzing product trends...</p>
    <p className="text-gray-500 text-sm mt-2">This usually takes 10-20 seconds</p>
  </div>
)}
```

---

##### 3. Add Focus Management

**File**: `src/app/page.tsx`
**Changes**: Improve focus behavior for better UX

Add these state variables at the top:
```typescript
const [input, setInput] = useState('');
const [result, setResult] = useState<AnalysisResult | null>(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const resultRef = React.useRef<HTMLDivElement>(null);
```

Add focus to result after analysis completes (in handleSubmit success case):
```typescript
setResult(data);

// Scroll to results
setTimeout(() => {
  resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}, 100);
```

Add ref to results container:
```typescript
{result && (
  <div ref={resultRef} className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 space-y-6" tabIndex={-1}>
    {/* ... rest of results content ... */}
  </div>
)}
```

---

#### Success Criteria:

##### Automated Verification:

- [ ] **Build succeeds with zero errors**: `npm run build`
- [ ] **No TypeScript errors**: `npx tsc --noEmit`
- [ ] **No console warnings**: Check browser and terminal during build
- [ ] **No unused dependencies**: All packages in package.json are used

##### Manual Verification:

- [ ] **SEO metadata present**: View page source and verify meta tags
- [ ] **Open Graph tags work**: Test URL in social media preview tool or Slack/Discord link preview
- [ ] **Keyboard navigation works**: Tab through form, use Enter to submit, navigate results
- [ ] **Screen reader friendly**: Test with VoiceOver (Mac) or NVDA (Windows) — form is announced properly
- [ ] **Mobile responsive**: Test on actual mobile device or Chrome DevTools mobile emulation (375px, 414px)
- [ ] **Tablet responsive**: Test at 768px and 1024px viewports
- [ ] **Desktop responsive**: Test at 1280px+ viewport
- [ ] **Error states work**: Test with invalid input, network failure, API errors
- [ ] **Export functionality works**: Test all 4 export formats
- [ ] **Tool is usable within 30 seconds**: Time yourself from page load to first successful analysis
- [ ] **No hardcoded data grids**: Verify all results change based on user input

**Final Quality Checklist:**

- [ ] Page loads in < 2 seconds on fast connection
- [ ] No layout shift (CLS) when results appear
- [ ] Form maintains state during analysis
- [ ] Retry mechanism works (submit again after error)
- [ ] Clipboard permission handled gracefully
- [ ] File downloads work on Chrome, Firefox, Safari
- [ ] Product Hunt brand colors used appropriately (orange accent)
- [ ] Typography is readable (contrast, font size)
- [ ] Spacing is consistent (Tailwind spacing scale)
- [ ] No horizontal scroll on any viewport size

**Note**: Phase 4 is complete when `npm run build` passes with zero errors and all manual verification checks pass.

---

## Testing Strategy

### Unit Tests

*Not implementing for MVP.* Unit tests would require testing framework setup (Jest/Vitest), component mocking, and significant time investment. Given the simple form logic and API integration, manual testing is more efficient for this project size.

### Integration Tests

**Manual end-to-end scenarios:**

1. **Happy Path — Valid Product Description**
   - Input: Paste 200+ character product description
   - Action: Click "Analyze Product"
   - Expected: Loading spinner → Results display → All export buttons work

2. **Happy Path — Product Hunt URL**
   - Input: Paste Product Hunt URL (e.g., "https://www.producthunt.com/posts/...")
   - Action: Click "Analyze Product"
   - Expected: AI extracts product info from context and analyzes

3. **Validation Error — Short Input**
   - Input: Enter < 50 characters
   - Action: Try to submit
   - Expected: Submit button disabled, character counter shows how many more characters needed

4. **API Error — Invalid Input**
   - Input: Enter 50+ characters of gibberish
   - Action: Submit
   - Expected: Error message displayed, retry option available

5. **API Error — Rate Limit (if applicable)**
   - Input: Submit multiple requests rapidly
   - Action: Trigger rate limit
   - Expected: User-friendly rate limit error message with retry guidance

6. **Export Test — All Formats**
   - Action: After successful analysis, click each export button
   - Expected: Copy/JSON/Markdown/TXT all work and produce correctly formatted output

7. **Responsive Test — Mobile**
   - Action: Resize browser to 375px width or use mobile device
   - Expected: Single column layout, readable text, touch-friendly buttons

8. **Responsive Test — Desktop**
   - Action: View at 1920px width
   - Expected: Content centered with reasonable max-width, no excessive stretching

### Manual Testing Steps

**Before Starting:**
1. Install dependencies: `npm install`
2. Set ANTHROPIC_API_KEY in `.env` file
3. Start dev server: `npm run dev`
4. Open http://localhost:3000

**Core Functionality:**
1. Test form validation: Enter < 50 characters, verify button disabled
2. Test form validation: Enter >= 50 characters, verify button enabled
3. Test successful analysis: Paste product description, submit, verify results appear
4. Test error handling: Disconnect internet, submit, verify error message
5. Test copy to clipboard: Click copy button, paste into text editor, verify content
6. Test JSON download: Click JSON button, open file, verify valid JSON
7. Test Markdown download: Click Markdown button, open in Markdown viewer, verify formatting
8. Test text download: Click text button, open in text editor, verify plain text

**Responsive Design:**
1. Open Chrome DevTools (Cmd+Option+I / Ctrl+Shift+I)
2. Toggle device toolbar (Cmd+Shift+M / Ctrl+Shift+M)
3. Test at 375px (iPhone SE): Verify readable, touch-friendly
4. Test at 414px (iPhone Pro Max): Verify layout adjusts
5. Test at 768px (iPad): Verify reasonable spacing
6. Test at 1920px (Desktop): Verify centered layout, not stretched

**Accessibility (Mac):**
1. Enable VoiceOver (Cmd+F5)
2. Tab through form elements
3. Verify each element is announced properly
4. Verify error message is announced when it appears
5. Verify loading state is announced

**Accessibility (Windows):**
1. Enable NVDA screen reader
2. Tab through form elements
3. Verify each element is announced properly

**Build Verification:**
1. Stop dev server
2. Run production build: `npm run build`
3. Verify zero errors and zero warnings
4. Start production server: `npm run start`
5. Open http://localhost:3000
6. Verify all functionality works in production mode
7. Test form submission and API calls

**Cross-Browser Testing:**
1. Chrome/Edge (Chromium): Test all functionality
2. Firefox: Test all functionality
3. Safari (if on Mac): Test all functionality, especially clipboard and downloads

## Migration Notes

No migration needed. This is a new project built from scratch. The placeholder page (`src/app/page.tsx`) will be completely replaced.

## References

- Research: `/private/tmp/vaos-builds/product-hunt-trending/.wreckit/items/001-build-product/research.md`
- Item Definition: `/private/tmp/vaos-builds/product-hunt-trending/.wreckit/items/001-build-product/item.json`
- Project Guidelines: `/private/tmp/vaos-builds/product-hunt-trending/CLAUDE.md`
- Current Dependencies: `/private/tmp/vaos-builds/product-hunt-trending/package.json`
- TypeScript Config: `/private/tmp/vaos-builds/product-hunt-trending/tsconfig.json`
- Tailwind v4 Config: `/private/tmp/vaos-builds/product-hunt-trending/src/app/globals.css`
