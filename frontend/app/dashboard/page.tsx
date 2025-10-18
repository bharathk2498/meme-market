'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  ArrowLeftIcon, 
  ChartBarIcon, 
  SparklesIcon,
  FireIcon,
  ClockIcon,
  RocketLaunchIcon,
  MagnifyingGlassIcon,
  ArrowTrendingUpIcon,
  BeakerIcon
} from '@heroicons/react/24/outline'

interface Prediction {
  reddit_id: string
  title: string
  subreddit: string
  score: number
  virality_score: number
  created_utc: string
  permalink: string
  num_comments: number
  upvote_ratio: number
}

interface PerplexityAnalysis {
  will_go_viral: boolean
  confidence: number
  virality_score: number
  reasoning: string
  trending_factor: string
  predicted_peak_score: number
  key_trends: string[]
}

type TabType = 'predictions' | 'ai-analyzer' | 'trending' | 'analytics'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('predictions')
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [loading, setLoading] = useState(false)
  const [aiAnalysis, setAiAnalysis] = useState<PerplexityAnalysis | null>(null)
  const [memeInput, setMemeInput] = useState('')
  const [selectedSubreddit, setSelectedSubreddit] = useState('memes')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (activeTab === 'predictions') {
      loadPredictions()
    }
  }, [activeTab])

  const loadPredictions = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/predictions/top?limit=10`)
      if (response.ok) {
        const data = await response.json()
        setPredictions(data.predictions)
      }
    } catch (err) {
      console.error('Failed to load predictions:', err)
    } finally {
      setLoading(false)
    }
  }

  const analyzeWithAI = async () => {
    if (!memeInput.trim()) return
    
    setLoading(true)
    setAiAnalysis(null)
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/perplexity/analyze-meme`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: memeInput,
          subreddit: selectedSubreddit,
          score: 0,
          num_comments: 0,
          age_hours: 0
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        setAiAnalysis(data.analysis)
      }
    } catch (err) {
      console.error('AI analysis failed:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredPredictions = predictions.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.subreddit.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900">
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Home
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Meme Market Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                ● Live
              </span>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                Upgrade to Pro
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('predictions')}
              className={`${
                activeTab === 'predictions'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
            >
              <ChartBarIcon className="h-5 w-5" />
              <span>Live Predictions</span>
            </button>
            
            <button
              onClick={() => setActiveTab('ai-analyzer')}
              className={`${
                activeTab === 'ai-analyzer'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
            >
              <SparklesIcon className="h-5 w-5" />
              <span>AI Analyzer</span>
            </button>
            
            <button
              onClick={() => setActiveTab('trending')}
              className={`${
                activeTab === 'trending'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
            >
              <FireIcon className="h-5 w-5" />
              <span>Trending Now</span>
            </button>
            
            <button
              onClick={() => setActiveTab('analytics')}
              className={`${
                activeTab === 'analytics'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
            >
              <ArrowTrendingUpIcon className="h-5 w-5" />
              <span>Analytics</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Live Predictions Tab */}
        {activeTab === 'predictions' && (
          <div className="space-y-6">
            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center space-x-4">
                <div className="flex-1 relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search predictions by title or subreddit..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={loadPredictions}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center space-x-2"
                >
                  <ArrowTrendingUpIcon className="h-5 w-5" />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Predictions</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{predictions.length}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <ChartBarIcon className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">High Confidence</p>
                    <p className="text-3xl font-bold text-green-600 mt-2">
                      {predictions.filter(p => p.virality_score > 80).length}
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <RocketLaunchIcon className="h-8 w-8 text-green-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Score</p>
                    <p className="text-3xl font-bold text-purple-600 mt-2">
                      {predictions.length > 0 
                        ? Math.round(predictions.reduce((a, b) => a + b.virality_score, 0) / predictions.length)
                        : 0}
                    </p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <ArrowTrendingUpIcon className="h-8 w-8 text-purple-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Last Updated</p>
                    <p className="text-lg font-bold text-gray-900 mt-2">Just now</p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <ClockIcon className="h-8 w-8 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Predictions List */}
            <div className="space-y-4">
              {loading ? (
                <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                  <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                  <p className="mt-4 text-gray-600">Loading predictions...</p>
                </div>
              ) : filteredPredictions.length > 0 ? (
                filteredPredictions.map((prediction, index) => (
                  <div key={prediction.reddit_id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <span className="text-2xl font-bold text-gray-400">#{index + 1}</span>
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                            r/{prediction.subreddit}
                          </span>
                          {prediction.virality_score >= 80 && (
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center">
                              <FireIcon className="h-4 w-4 mr-1" />
                              Hot
                            </span>
                          )}
                        </div>
                        
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">
                          {prediction.title}
                        </h3>
                        
                        <div className="flex items-center space-x-6 text-sm text-gray-600">
                          <div className="flex items-center">
                            <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                            {prediction.score.toLocaleString()} upvotes
                          </div>
                          <div className="flex items-center">
                            <span className="mr-1">💬</span>
                            {prediction.num_comments} comments
                          </div>
                          <div className="flex items-center">
                            <span className="mr-1">📊</span>
                            {Math.round(prediction.upvote_ratio * 100)}% ratio
                          </div>
                        </div>
                      </div>
                      
                      <div className="ml-6 text-center">
                        <div className={`text-4xl font-bold ${
                          prediction.virality_score >= 80 ? 'text-green-600' :
                          prediction.virality_score >= 60 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {Math.round(prediction.virality_score)}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">Virality Score</div>
                        <a
                          href={`https://reddit.com${prediction.permalink}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                        >
                          View on Reddit
                        </a>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                  <p className="text-gray-600">No predictions found. Try refreshing or adjusting your search.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* AI Analyzer Tab */}
        {activeTab === 'ai-analyzer' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg shadow-lg p-8 text-white">
              <div className="flex items-center space-x-3 mb-4">
                <BeakerIcon className="h-8 w-8" />
                <h2 className="text-2xl font-bold">AI-Powered Meme Analyzer</h2>
              </div>
              <p className="text-purple-100">
                Enter your meme idea and let Perplexity AI analyze its viral potential using real-time web search across Twitter, Reddit, TikTok, and news sources.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meme Title or Description
                </label>
                <textarea
                  value={memeInput}
                  onChange={(e) => setMemeInput(e.target.value)}
                  placeholder="Enter your meme idea...\n\nExamples:\n- Breaking: AI discovers cure for aging\n- When you finally understand regex\n- Cat does backflip while playing piano"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={6}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Platform
                </label>
                <select
                  value={selectedSubreddit}
                  onChange={(e) => setSelectedSubreddit(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="memes">r/memes</option>
                  <option value="funny">r/funny</option>
                  <option value="dankmemes">r/dankmemes</option>
                  <option value="wholesomememes">r/wholesomememes</option>
                  <option value="me_irl">r/me_irl</option>
                  <option value="technology">r/technology</option>
                  <option value="gaming">r/gaming</option>
                </select>
              </div>

              <button
                onClick={analyzeWithAI}
                disabled={loading || !memeInput.trim()}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Analyzing with Perplexity AI...</span>
                  </>
                ) : (
                  <>
                    <SparklesIcon className="h-6 w-6" />
                    <span>Analyze with AI</span>
                  </>
                )}
              </button>
            </div>

            {aiAnalysis && (
              <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
                <div className="text-center border-b pb-6">
                  <div className={`text-6xl font-bold mb-2 ${
                    aiAnalysis.virality_score >= 80 ? 'text-green-600' :
                    aiAnalysis.virality_score >= 60 ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {aiAnalysis.virality_score}%
                  </div>
                  <div className="text-sm text-gray-500">Virality Score</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-3xl font-bold mb-1">
                      {aiAnalysis.will_go_viral ? '✅' : '❌'}
                    </div>
                    <div className="text-sm text-gray-600">
                      {aiAnalysis.will_go_viral ? 'Will Go Viral' : 'May Not Go Viral'}
                    </div>
                  </div>

                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-3xl font-bold text-gray-900 mb-1">
                      {aiAnalysis.confidence}%
                    </div>
                    <div className="text-sm text-gray-600">Confidence</div>
                  </div>

                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                      aiAnalysis.trending_factor === 'HIGH' ? 'bg-green-100 text-green-800' :
                      aiAnalysis.trending_factor === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {aiAnalysis.trending_factor}
                    </div>
                    <div className="text-sm text-gray-600 mt-2">Trending Factor</div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <SparklesIcon className="h-5 w-5 mr-2 text-purple-600" />
                    AI Analysis
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{aiAnalysis.reasoning}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Predicted Peak Score</h4>
                    <p className="text-2xl font-bold text-blue-600">
                      {aiAnalysis.predicted_peak_score.toLocaleString()} upvotes
                    </p>
                  </div>

                  {aiAnalysis.key_trends && aiAnalysis.key_trends.length > 0 && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Key Trends Detected</h4>
                      <div className="flex flex-wrap gap-2">
                        {aiAnalysis.key_trends.map((trend, index) => (
                          <span
                            key={index}
                            className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                          >
                            {trend}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Trending Now Tab */}
        {activeTab === 'trending' && (
          <div className="text-center py-20">
            <FireIcon className="h-16 w-16 text-orange-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Trending Topics</h3>
            <p className="text-gray-600 mb-6">Real-time trending content across all platforms</p>
            <button className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium">
              Coming Soon
            </button>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="text-center py-20">
            <ChartBarIcon className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Analytics Dashboard</h3>
            <p className="text-gray-600 mb-6">Track your prediction accuracy and performance metrics</p>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
              Coming Soon
            </button>
          </div>
        )}
      </div>
    </div>
  )
}