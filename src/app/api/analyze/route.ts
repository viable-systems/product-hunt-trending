import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const anthropic = new Anthropic({
    baseURL: process.env.ANTHROPIC_BASE_URL || undefined,
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
      model: 'claude-sonnet-4-5-20250929',
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