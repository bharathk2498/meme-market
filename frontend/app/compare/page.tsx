'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeftIcon, BeakerIcon } from '@heroicons/react/24/outline'

interface PlatformResult {
  platform: string
  virality_score: number
  confidence: number
  predicted_reach: string
  best_time: string
  key_factors: string[]
}

export default function ComparePage() {
  const [content, setContent] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [results, setResults] = useState<PlatformResult[]>([])

  const platforms = [
    { id: 'reddit', name: 'Reddit', icon: '🤖', color: 'bg-orange-100 text-orange-800' },
    { id: 'twitter', name: 'Twitter/X', icon: '🐦', color: 'bg-blue-100 text-blue-800' },
    { id: 'tiktok', name: 'TikTok', icon: '🎵', color: 'bg-pink-100 text-pink-800' },
    { id: 'instagram', name: 'Instagram', icon: '📸', color: 'bg-purple-100 text-purple-800' },
  ]

  const analyzeContent = async () => {
    if (!content.trim()) return

    setAnalyzing(true)
    setResults([])

    // Simulate analysis for each platform
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Generate demo results
    const demoResults: PlatformResult[] = platforms.map(platform => {
      const baseScore = Math.floor(Math.random() * 30) + 60
      return {
        platform: platform.name,
        virality_score: baseScore,
        confidence: Math.floor(Math.random() * 20) + 70,
        predicted_reach: `${Math.floor(Math.random() * 500 + 100)}K`,
        best_time: ['Morning (8-10 AM)', 'Afternoon (12-2 PM)', 'Evening (6-9 PM)', 'Night (10 PM-12 AM)'][Math.floor(Math.random() * 4)],
        key_factors: [
          platform.id === 'reddit' ? 'Strong community engagement' : 'High visual appeal',
          platform.id === 'tiktok' ? 'Trending audio' : 'Relevant hashtags',
          'Timing is optimal'
        ]
      }
    })

    setResults(demoResults.sort((a, b) => b.virality_score - a.virality_score))
    setAnalyzing(false)
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-50 border-green-200'
    if (score >= 60) return 'bg-yellow-50 border-yellow-200'
    return 'bg-red-50 border-red-200'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/dashboard" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8">
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Dashboard
        </Link>

        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-purple-100 rounded-full mb-4">
            <BeakerIcon className="h-8 w-8 text-purple-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Multi-Platform Comparison</h1>
          <p className="text-lg text-gray-600">Analyze your content across Reddit, Twitter, TikTok, and Instagram</p>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Content
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter your meme, video idea, or post content here...&#10;&#10;Example: 'Funny cat doing backflip while playing piano'&#10;&#10;The AI will analyze how it would perform on each platform."
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            rows={6}
          />

          <button
            onClick={analyzeContent}
            disabled={analyzing || !content.trim()}
            className="mt-4 w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {analyzing ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing across platforms...
              </span>
            ) : (
              'Compare Across Platforms'
            )}
          </button>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Platform Analysis Results</h2>
            
            {/* Best Platform Highlight */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-green-600 mb-1">🏆 BEST PLATFORM</div>
                  <div className="text-2xl font-bold text-gray-900">{results[0].platform}</div>
                  <div className="text-sm text-gray-600 mt-1">Highest predicted virality for this content</div>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-green-600">{results[0].virality_score}%</div>
                  <div className="text-sm text-gray-600">Virality Score</div>
                </div>
              </div>
            </div>

            {/* All Platform Cards */}
            <div className="grid gap-6 md:grid-cols-2">
              {results.map((result, index) => {
                const platformInfo = platforms.find(p => p.name === result.platform)
                return (
                  <div
                    key={result.platform}
                    className={`bg-white rounded-xl shadow-md border-2 p-6 ${getScoreBg(result.virality_score)}`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <span className="text-3xl mr-3">{platformInfo?.icon}</span>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{result.platform}</h3>
                          {index === 0 && <span className="text-xs font-semibold text-green-600">Best Match</span>}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-3xl font-bold ${getScoreColor(result.virality_score)}`}>
                          {result.virality_score}%
                        </div>
                        <div className="text-xs text-gray-500">Virality</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="text-sm font-medium text-gray-600">Confidence</span>
                        <span className="text-sm font-bold text-gray-900">{result.confidence}%</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="text-sm font-medium text-gray-600">Predicted Reach</span>
                        <span className="text-sm font-bold text-gray-900">{result.predicted_reach}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="text-sm font-medium text-gray-600">Best Time</span>
                        <span className="text-sm font-bold text-gray-900">{result.best_time}</span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="text-xs font-medium text-gray-600 mb-2">KEY FACTORS</div>
                      <div className="space-y-1">
                        {result.key_factors.map((factor, i) => (
                          <div key={i} className="flex items-center text-sm text-gray-700">
                            <span className="text-green-500 mr-2">✓</span>
                            {factor}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Recommendations */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">📊 Recommendations</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Post on <strong>{results[0].platform}</strong> first for maximum impact</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Cross-post to {results[1]?.platform} within 2 hours for extended reach</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Optimize timing: {results[0].best_time} is ideal for {results[0].platform}</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Info Card */}
        {results.length === 0 && !analyzing && (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <BeakerIcon className="h-16 w-16 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">How It Works</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Enter your content above, and our AI will analyze how it would perform across Reddit, Twitter, TikTok, and Instagram. 
              Get virality scores, predicted reach, optimal posting times, and personalized recommendations for each platform.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}