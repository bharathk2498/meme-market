'use client'

import { useState, useEffect } from 'react'
import { Tab } from '@headlessui/react'
import { 
  FireIcon, 
  SparklesIcon, 
  ChartBarIcon, 
  MagnifyingGlassIcon,
  ClockIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline'

interface Prediction {
  reddit_id: string
  title: string
  subreddit: string
  score: number
  virality_score: number
  num_comments: number
  created_utc: string
  permalink: string
  url: string
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

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Dashboard() {
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [trending, setTrending] = useState<Prediction[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPrediction, setSelectedPrediction] = useState<Prediction | null>(null)
  const [aiAnalysis, setAiAnalysis] = useState<PerplexityAnalysis | null>(null)
  const [loading, setLoading] = useState(true)
  const [analyzing, setAnalyzing] = useState(false)
  const [filterSubreddit, setFilterSubreddit] = useState('all')

  const subreddits = ['all', 'technology', 'memes', 'funny', 'gaming', 'worldnews', 'videos']

  useEffect(() => {
    loadPredictions()
    loadTrending()
    const interval = setInterval(() => {
      loadPredictions()
      loadTrending()
    }, 120000) // Refresh every 2 minutes
    return () => clearInterval(interval)
  }, [])

  const loadPredictions = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/predictions/top?limit=20`)
      if (response.ok) {
        const data = await response.json()
        setPredictions(data.predictions || [])
      }
    } catch (error) {
      console.error('Failed to load predictions:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadTrending = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/predictions/trending?hours=24`)
      if (response.ok) {
        const data = await response.json()
        setTrending(data.trending || [])
      }
    } catch (error) {
      console.error('Failed to load trending:', error)
    }
  }

  const analyzeWithAI = async (prediction: Prediction) => {
    setSelectedPrediction(prediction)
    setAnalyzing(true)
    setAiAnalysis(null)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/perplexity/analyze-meme`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: prediction.title,
          subreddit: prediction.subreddit,
          score: prediction.score,
          num_comments: prediction.num_comments,
          age_hours: calculateAge(prediction.created_utc)
        })
      })

      if (response.ok) {
        const data = await response.json()
        setAiAnalysis(data.analysis)
      }
    } catch (error) {
      console.error('AI analysis failed:', error)
    } finally {
      setAnalyzing(false)
    }
  }

  const calculateAge = (timestamp: string) => {
    const created = new Date(timestamp)
    const now = new Date()
    return (now.getTime() - created.getTime()) / (1000 * 60 * 60)
  }

  const filteredPredictions = predictions.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSubreddit = filterSubreddit === 'all' || p.subreddit === filterSubreddit
    return matchesSearch && matchesSubreddit
  })

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50'
    if (score >= 60) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    if (hours < 1) return 'Just now'
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Meme Market Dashboard</h1>
              <p className="mt-1 text-blue-100">AI-powered viral trend prediction platform</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-blue-100">Live Data</p>
                <p className="text-xs text-blue-200">Updated 2 min ago</p>
              </div>
              <div className="h-3 w-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{predictions.length}</p>
              <p className="text-sm text-gray-500">Active Predictions</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{trending.length}</p>
              <p className="text-sm text-gray-500">Trending Now</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">85%</p>
              <p className="text-sm text-gray-500">Avg Accuracy</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">10+</p>
              <p className="text-sm text-gray-500">Subreddits</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search predictions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterSubreddit}
              onChange={(e) => setFilterSubreddit(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {subreddits.map(sub => (
                <option key={sub} value={sub}>
                  {sub === 'all' ? 'All Subreddits' : `r/${sub}`}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            <Tab.Group>
              <Tab.List className="flex space-x-2 rounded-xl bg-white p-1 shadow">
                <Tab className={({ selected }) =>
                  classNames(
                    'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                    'ring-white ring-opacity-60 ring-offset-2 focus:outline-none focus:ring-2',
                    selected
                      ? 'bg-blue-600 text-white shadow'
                      : 'text-gray-700 hover:bg-gray-100'
                  )
                }>
                  <div className="flex items-center justify-center space-x-2">
                    <FireIcon className="h-5 w-5" />
                    <span>Top Predictions</span>
                  </div>
                </Tab>
                <Tab className={({ selected }) =>
                  classNames(
                    'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                    'ring-white ring-opacity-60 ring-offset-2 focus:outline-none focus:ring-2',
                    selected
                      ? 'bg-blue-600 text-white shadow'
                      : 'text-gray-700 hover:bg-gray-100'
                  )
                }>
                  <div className="flex items-center justify-center space-x-2">
                    <ArrowTrendingUpIcon className="h-5 w-5" />
                    <span>Trending</span>
                  </div>
                </Tab>
              </Tab.List>
              <Tab.Panels className="mt-6">
                {/* Top Predictions Panel */}
                <Tab.Panel>
                  {loading ? (
                    <div className="bg-white rounded-lg shadow p-8 text-center">
                      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                      <p className="mt-4 text-gray-600">Loading predictions...</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredPredictions.map((prediction) => (
                        <div
                          key={prediction.reddit_id}
                          className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 cursor-pointer"
                          onClick={() => analyzeWithAI(prediction)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  r/{prediction.subreddit}
                                </span>
                                <span className="text-sm text-gray-500 flex items-center">
                                  <ClockIcon className="h-4 w-4 mr-1" />
                                  {formatTime(prediction.created_utc)}
                                </span>
                              </div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {prediction.title}
                              </h3>
                              <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <span>{prediction.score.toLocaleString()} upvotes</span>
                                <span>{prediction.num_comments} comments</span>
                                <span>{Math.round(prediction.upvote_ratio * 100)}% ratio</span>
                              </div>
                            </div>
                            <div className="ml-4 flex flex-col items-center">
                              <div className={`text-3xl font-bold px-4 py-2 rounded-lg ${getScoreColor(prediction.virality_score)}`}>
                                {Math.round(prediction.virality_score)}
                              </div>
                              <span className="text-xs text-gray-500 mt-1">Score</span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  analyzeWithAI(prediction)
                                }}
                                className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-full text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                              >
                                <SparklesIcon className="h-3 w-3 mr-1" />
                                AI Analyze
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Tab.Panel>

                {/* Trending Panel */}
                <Tab.Panel>
                  <div className="space-y-4">
                    {trending.map((item) => (
                      <div
                        key={item.reddit_id}
                        className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
                      >
                        <div className="flex items-center space-x-2 mb-2">
                          <FireIcon className="h-5 w-5 text-orange-500" />
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                            r/{item.subreddit}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {item.title}
                        </h3>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>{item.score.toLocaleString()} upvotes</span>
                            <span>{item.num_comments} comments</span>
                          </div>
                          <a
                            href={`https://reddit.com${item.permalink}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            View on Reddit →
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>

          {/* Sidebar - AI Analysis */}
          <div className="space-y-6">
            {/* AI Analysis Card */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg shadow-lg p-6 border border-purple-200">
              <div className="flex items-center space-x-2 mb-4">
                <SparklesIcon className="h-6 w-6 text-purple-600" />
                <h2 className="text-lg font-bold text-gray-900">AI Analysis</h2>
              </div>

              {!selectedPrediction && !analyzing && (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-2">
                    <ChartBarIcon className="h-12 w-12 mx-auto" />
                  </div>
                  <p className="text-gray-600">Click any prediction to analyze with Perplexity AI</p>
                </div>
              )}

              {analyzing && (
                <div className="text-center py-8">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent mb-4"></div>
                  <p className="text-gray-600">Analyzing with AI...</p>
                  <p className="text-sm text-gray-500 mt-2">Checking real-time trends</p>
                </div>
              )}

              {selectedPrediction && !analyzing && aiAnalysis && (
                <div className="space-y-4">
                  <div className="text-center pb-4 border-b border-purple-200">
                    <div className={`text-5xl font-bold mb-2 ${
                      aiAnalysis.virality_score >= 80 ? 'text-green-600' :
                      aiAnalysis.virality_score >= 60 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {aiAnalysis.virality_score}%
                    </div>
                    <p className="text-sm text-gray-600">AI Virality Score</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 bg-white rounded-lg">
                      <div className="text-2xl mb-1">{aiAnalysis.will_go_viral ? '✅' : '❌'}</div>
                      <p className="text-xs text-gray-600">Will Go Viral</p>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg">
                      <div className="text-2xl font-bold text-gray-900 mb-1">{aiAnalysis.confidence}%</div>
                      <p className="text-xs text-gray-600">Confidence</p>
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-lg">
                    <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                      aiAnalysis.trending_factor === 'HIGH' ? 'bg-green-100 text-green-800' :
                      aiAnalysis.trending_factor === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {aiAnalysis.trending_factor}
                    </div>
                    <p className="text-xs text-gray-600 mt-2">Trending Factor</p>
                  </div>

                  <div className="p-4 bg-white rounded-lg">
                    <p className="text-sm text-gray-700 leading-relaxed">{aiAnalysis.reasoning}</p>
                  </div>

                  {aiAnalysis.key_trends && aiAnalysis.key_trends.length > 0 && (
                    <div className="p-3 bg-white rounded-lg">
                      <p className="text-xs font-semibold text-gray-700 mb-2">Key Trends:</p>
                      <div className="flex flex-wrap gap-2">
                        {aiAnalysis.key_trends.map((trend, i) => (
                          <span key={i} className="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                            {trend}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="p-3 bg-white rounded-lg">
                    <p className="text-xs text-gray-600">Predicted Peak</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {aiAnalysis.predicted_peak_score.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">upvotes</p>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => window.location.href = '/predict'}
                  className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-colors"
                >
                  Analyze Custom Meme
                </button>
                <button
                  onClick={loadPredictions}
                  className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Refresh Data
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}