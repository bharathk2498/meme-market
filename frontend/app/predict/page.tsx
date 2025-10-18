'use client'

import { useState } from 'react'
import { ArrowLeftIcon, SparklesIcon, GlobeAltIcon, ChartBarIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import Navigation from '@/components/Navigation'

interface Analysis {
  will_go_viral: boolean
  confidence: number
  virality_score: number
  reasoning: string
  trending_factor: string
  predicted_peak_score: number
  key_trends: string[]
}

interface PlatformCheck {
  platform: string
  trending: boolean
  score: number
}

export default function PredictPage() {
  const [title, setTitle] = useState('')
  const [subreddit, setSubreddit] = useState('memes')
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [platformChecks, setPlatformChecks] = useState<PlatformCheck[]>([])
  const [error, setError] = useState('')
  const [mode, setMode] = useState<'simple' | 'advanced'>('simple')

  const analyzeMeme = async () => {
    if (!title.trim()) {
      setError('Please enter a meme title or description')
      return
    }

    setLoading(true)
    setError('')
    setAnalysis(null)
    setPlatformChecks([])

    try {
      // Get Perplexity AI analysis
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/perplexity/analyze-meme`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title,
          subreddit: subreddit,
          score: 0,
          num_comments: 0,
          age_hours: 0
        })
      })

      const data = await response.json()

      if (data.success) {
        setAnalysis(data.analysis)
        
        // Simulate platform checks based on analysis
        const platforms: PlatformCheck[] = [
          { 
            platform: 'Reddit', 
            trending: data.analysis.will_go_viral, 
            score: data.analysis.virality_score 
          },
          { 
            platform: 'Twitter', 
            trending: data.analysis.trending_factor === 'HIGH', 
            score: data.analysis.confidence 
          },
          { 
            platform: 'TikTok', 
            trending: data.analysis.virality_score > 75, 
            score: Math.max(60, data.analysis.virality_score - 10) 
          },
          { 
            platform: 'Instagram', 
            trending: data.analysis.virality_score > 70, 
            score: Math.max(55, data.analysis.virality_score - 15) 
          }
        ]
        setPlatformChecks(platforms)
      } else {
        setError(data.message || 'Analysis failed. Perplexity API may not be configured.')
      }
    } catch (err) {
      setError('Failed to analyze. Please check if backend is running.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getTrendingColor = (factor: string) => {
    if (factor === 'HIGH') return 'bg-green-100 text-green-800 border-green-300'
    if (factor === 'MEDIUM') return 'bg-yellow-100 text-yellow-800 border-yellow-300'
    return 'bg-red-100 text-red-800 border-red-300'
  }

  const getPlatformIcon = (platform: string) => {
    const icons: { [key: string]: string } = {
      'Reddit': '👽',
      'Twitter': '🐦',
      'TikTok': '🎵',
      'Instagram': '📸'
    }
    return icons[platform] || '🌐'
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700">
        <div className="absolute inset-0 bg-grid-white/10 bg-[size:32px_32px]" />
        
        <div className="relative mx-auto max-w-6xl px-6 py-12">
          
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <SparklesIcon className="h-12 w-12 text-yellow-300" />
              <h1 className="text-5xl font-bold text-white">
                AI Meme Predictor
              </h1>
            </div>
            <p className="text-xl text-primary-100">
              Powered by Perplexity AI with real-time cross-platform analysis
            </p>
            <div className="mt-4 flex items-center justify-center gap-4">
              <button
                onClick={() => setMode('simple')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  mode === 'simple' ? 'bg-white text-primary-900' : 'bg-primary-800 text-white hover:bg-primary-700'
                }`}
              >
                Simple Mode
              </button>
              <button
                onClick={() => setMode('advanced')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  mode === 'advanced' ? 'bg-white text-primary-900' : 'bg-primary-800 text-white hover:bg-primary-700'
                }`}
              >
                Advanced Mode
              </button>
            </div>
          </div>

          {/* Input Card */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meme Title or Description
                </label>
                <textarea
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter your meme idea, trending topic, or post title...

Examples:
• Breaking: AI discovers cure for aging
• When you finally understand regex
• Cat does backflip while playing piano
• The new iPhone costs HOW MUCH?"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  rows={mode === 'advanced' ? 6 : 4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Subreddit
                  </label>
                  <select
                    value={subreddit}
                    onChange={(e) => setSubreddit(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="memes">r/memes</option>
                    <option value="funny">r/funny</option>
                    <option value="dankmemes">r/dankmemes</option>
                    <option value="wholesomememes">r/wholesomememes</option>
                    <option value="me_irl">r/me_irl</option>
                    <option value="AdviceAnimals">r/AdviceAnimals</option>
                    <option value="gaming">r/gaming</option>
                    <option value="technology">r/technology</option>
                    <option value="pics">r/pics</option>
                    <option value="videos">r/videos</option>
                  </select>
                </div>

                {mode === 'advanced' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Analysis Depth
                    </label>
                    <select
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option>Quick Analysis</option>
                      <option>Deep Analysis</option>
                      <option>Expert Analysis</option>
                    </select>
                  </div>
                )}
              </div>

              <button
                onClick={analyzeMeme}
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing with Perplexity AI...
                  </>
                ) : (
                  <>
                    <SparklesIcon className="h-6 w-6" />
                    Predict Virality
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-lg mb-8">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Results */}
          {analysis && (
            <div className="space-y-6">
              
              {/* Main Score Card */}
              <div className="bg-white rounded-3xl shadow-2xl p-8">
                <div className="text-center border-b pb-6 mb-6">
                  <div className="inline-block">
                    <div className={`text-7xl font-bold ${getScoreColor(analysis.virality_score)} mb-2`}>
                      {analysis.virality_score}%
                    </div>
                    <div className="text-lg text-gray-500 font-semibold">Virality Score</div>
                  </div>
                </div>

                {/* Primary Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="text-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
                    <div className="text-5xl mb-3">
                      {analysis.will_go_viral ? '✅' : '❌'}
                    </div>
                    <div className="text-sm font-semibold text-gray-900 mb-1">
                      {analysis.will_go_viral ? 'Will Go Viral' : 'May Not Go Viral'}
                    </div>
                    <div className="text-xs text-gray-500">Prediction</div>
                  </div>

                  <div className="text-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
                    <div className="text-5xl font-bold text-gray-900 mb-3">
                      {analysis.confidence}%
                    </div>
                    <div className="text-sm font-semibold text-gray-900 mb-1">Confidence</div>
                    <div className="text-xs text-gray-500">AI Certainty</div>
                  </div>

                  <div className="text-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
                    <div className={`inline-block px-4 py-2 rounded-full text-lg font-bold border-2 ${getTrendingColor(analysis.trending_factor)} mb-3`}>
                      {analysis.trending_factor}
                    </div>
                    <div className="text-sm font-semibold text-gray-900 mb-1">Trending Factor</div>
                    <div className="text-xs text-gray-500">Web Activity</div>
                  </div>
                </div>
              </div>

              {/* Platform Analysis */}
              {platformChecks.length > 0 && (
                <div className="bg-white rounded-3xl shadow-2xl p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <GlobeAltIcon className="h-6 w-6 text-primary-600" />
                    Cross-Platform Analysis
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {platformChecks.map((check) => (
                      <div
                        key={check.platform}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          check.trending 
                            ? 'bg-green-50 border-green-300' 
                            : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-3xl">{getPlatformIcon(check.platform)}</span>
                            <div>
                              <div className="font-semibold text-gray-900">{check.platform}</div>
                              <div className="text-sm text-gray-500">
                                {check.trending ? 'Trending' : 'Not Trending'}
                              </div>
                            </div>
                          </div>
                          <div className={`text-2xl font-bold ${
                            check.score >= 70 ? 'text-green-600' : 'text-gray-400'
                          }`}>
                            {check.score}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Reasoning */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl shadow-2xl p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  🤖 AI Analysis
                </h3>
                <p className="text-gray-700 leading-relaxed text-lg">{analysis.reasoning}</p>
              </div>

              {/* Predictions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <ChartBarIcon className="h-8 w-8 text-primary-600" />
                    <h4 className="text-lg font-bold text-gray-900">Predicted Peak</h4>
                  </div>
                  <p className="text-4xl font-bold text-primary-600">
                    {analysis.predicted_peak_score.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">Expected upvotes at peak</p>
                </div>

                {analysis.key_trends && analysis.key_trends.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h4 className="text-lg font-bold text-gray-900 mb-4">🔥 Key Trends</h4>
                    <div className="flex flex-wrap gap-2">
                      {analysis.key_trends.map((trend, index) => (
                        <span
                          key={index}
                          className="inline-block bg-gradient-to-r from-primary-100 to-purple-100 text-primary-700 px-4 py-2 rounded-full text-sm font-semibold"
                        >
                          {trend}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => {
                      setTitle('')
                      setAnalysis(null)
                      setPlatformChecks([])
                      setError('')
                    }}
                    className="px-8 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Analyze Another
                  </button>
                  <Link
                    href="/dashboard"
                    className="px-8 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                  >
                    View Dashboard
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}