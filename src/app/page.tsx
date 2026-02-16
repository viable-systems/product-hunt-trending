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
              <p id="char-count" className="mt-2 text-sm text-gray-500">
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
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center" role="status" aria-live="polite">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-600 border-t-transparent mb-4" aria-hidden="true"></div>
            <p className="text-gray-600 font-medium">Analyzing product trends...</p>
            <p className="text-gray-500 text-sm mt-2">This usually takes 10-20 seconds</p>
          </div>
        )}

        {/* Results Display */}
        {result && (
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 space-y-6" tabIndex={-1}>
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
      </div>
    </main>
  );
}
