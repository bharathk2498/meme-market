'use client'

import { useState, useEffect } from 'react'
import { Tab } from '@headlessui/react'
import { 
  SparklesIcon, 
  ChartBarIcon, 
  FireIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  GlobeAltIcon,
  BoltIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'

interface Post {
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

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Dashboard() {
  const [predictions, setPredictions] = useState<Post[]>([])
  const [trending, setTrending] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalPosts: 0,
    lastCollection: '',
    accuracy: 85,
    trending: 0
  })

  const [selectedTab, setSelectedTab] = useState(0)
  const [customAnalysis, setCustomAnalysis] = useState<PerplexityAnalysis | null>(null)
  const [customInput, setCustomInput] = useState('')
  const [analyzing, setAnalyzing] = useState(false)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      // Load predictions
      const predResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/predictions/top?limit=10`)
      if (predResponse.ok) {
        const predData = await predResponse.json()
        setPredictions(predData.predictions || [])
      }

      // Load trending
      const trendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/predictions/trending?hours=24`)
      if (trendResponse.ok) {
        const trendData = await trendResponse.json()
        setTrending(trendData.trending || [])
      }

      // Load stats
      const statusResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reddit/status`)
      if (statusResponse.ok) {
        const statusData = await statusResponse.json()
        setStats(prev => ({
          ...prev,
          totalPosts: statusData.status?.total_posts || 0,
          lastCollection: statusData.status?.last_collection || '',
          trending: (trendData.trending || []).length
        }))
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const analyzeWithAI = async () => {
    if (!customInput.trim()) return

    setAnalyzing(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/perplexity/analyze-meme`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: customInput,
          subreddit: 'memes',
          score: 0,
          num_comments: 0,
          age_hours: 0
        })
      })

      if (response.ok) {
        const data = await response.json()
        setCustomAnalysis(data.analysis)
      }
    } catch (error) {
      console.error('Analysis failed:', error)
    } finally {
      setAnalyzing(false)
    }
  }

  const triggerCollection = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reddit/collect`, {
        method: 'POST'
      })
      setTimeout(() => loadDashboardData(), 2000)
    } catch (error) {
      console.error('Collection failed:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center">
                <SparklesIcon className="h-8 w-8 mr-3" />
                Meme Market Dashboard
              </h1>
              <p className="text-blue-100 mt-1">AI-powered viral trend prediction platform</p>
            </div>
            <Link href="/" className="text-white hover:text-blue-100 flex items-center">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 rounded-lg p-3">
                <ChartBarIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Posts</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalPosts.toLocaleString()}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 rounded-lg p-3">
                <ArrowTrendingUpIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Accuracy</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.accuracy}%</p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="flex-shrink-0 bg-red-100 rounded-lg p-3">
                <FireIcon className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Trending Now</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.trending}</p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-100 rounded-lg p-3">
                <ClockIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Last Update</p>
                <p className="text-sm font-semibold text-gray-900">
                  {stats.lastCollection ? new Date(stats.lastCollection).toLocaleTimeString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex gap-3">
            <button
              onClick={triggerCollection}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <BoltIcon className="h-4 w-4 mr-2" />
              Collect New Data
            </button>
            <button
              onClick={loadDashboardData}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Refresh Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
          <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
            <Tab
              className={({ selected }) =>
                classNames(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                  'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-white text-blue-700 shadow'
                    : 'text-blue-600 hover:bg-white/[0.12] hover:text-blue-800'
                )
              }
            >
              🎯 Top Predictions
            </Tab>
            <Tab
              className={({ selected }) =>
                classNames(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                  'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-white text-blue-700 shadow'
                    : 'text-blue-600 hover:bg-white/[0.12] hover:text-blue-800'
                )
              }
            >
              🔥 Trending Now
            </Tab>
            <Tab
              className={({ selected }) =>
                classNames(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                  'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-white text-blue-700 shadow'
                    : 'text-blue-600 hover:bg-white/[0.12] hover:text-blue-800'
                )
              }
            >
              🤖 AI Analyzer
            </Tab>
            <Tab
              className={({ selected }) =>
                classNames(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                  'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-white text-blue-700 shadow'
                    : 'text-blue-600 hover:bg-white/[0.12] hover:text-blue-800'
                )
              }
            >
              📊 Analytics
            </Tab>
          </Tab.List>

          <Tab.Panels className="mt-6">
            {/* Top Predictions Tab */}
            <Tab.Panel className="rounded-xl bg-white p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Top Viral Predictions</h2>
              
              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                  <p className="mt-4 text-gray-600">Loading predictions...</p>
                </div>
              ) : predictions.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No predictions available. Try collecting data first.</p>
                  <button
                    onClick={triggerCollection}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Collect Data Now
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {predictions.map((post, index) => (
                    <div
                      key={post.reddit_id}
                      className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold text-sm">
                              #{index + 1}
                            </span>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              r/{post.subreddit}
                            </span>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {post.title}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>⬆️ {post.score.toLocaleString()} upvotes</span>
                            <span>💬 {post.num_comments} comments</span>
                            <span>📊 {(post.upvote_ratio * 100).toFixed(0)}% upvote ratio</span>
                          </div>
                        </div>
                        <div className="ml-6 text-center">
                          <div className={`text-3xl font-bold ${
                            post.virality_score >= 80 ? 'text-green-600' :
                            post.virality_score >= 60 ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>
                            {Math.round(post.virality_score)}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">Virality Score</div>
                        </div>
                      </div>
                      <div className="mt-4 flex gap-3">
                        <a
                          href={`https://reddit.com${post.permalink}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                          View on Reddit →
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Tab.Panel>

            {/* Trending Tab */}
            <Tab.Panel className="rounded-xl bg-white p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Trending Right Now 🔥</h2>
              
              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-red-600 border-r-transparent"></div>
                  <p className="mt-4 text-gray-600">Loading trending posts...</p>
                </div>
              ) : trending.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No trending posts found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {trending.slice(0, 8).map((post) => (
                    <div
                      key={post.reddit_id}
                      className="border border-red-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-gradient-to-br from-red-50 to-orange-50"
                    >
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 mb-2">
                        r/{post.subreddit}
                      </span>
                      <h3 className="text-md font-semibold text-gray-900 mb-2 line-clamp-2">
                        {post.title}
                      </h3>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <span>⬆️ {post.score.toLocaleString()}</span>
                          <span>💬 {post.num_comments}</span>
                        </div>
                        <div className="text-red-600 font-bold">
                          {Math.round(post.virality_score)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Tab.Panel>

            {/* AI Analyzer Tab */}
            <Tab.Panel className="rounded-xl bg-white p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">AI-Powered Meme Analyzer</h2>
              <p className="text-gray-600 mb-6">Enter any meme idea and get real-time AI analysis using Perplexity AI</p>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meme Title or Idea
                  </label>
                  <textarea
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    placeholder="Enter your meme idea...\n\nExamples:\n- Breaking: AI discovers cure for aging\n- When you finally understand recursion\n- Cat plays piano while doing backflip"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={5}
                  />
                </div>

                <button
                  onClick={analyzeWithAI}
                  disabled={analyzing || !customInput.trim()}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {analyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Analyzing with AI...
                    </>
                  ) : (
                    <>
                      <SparklesIcon className="h-5 w-5 mr-2" />
                      Analyze with Perplexity AI
                    </>
                  )}
                </button>

                {customAnalysis && (
                  <div className="border-t pt-6 space-y-6">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className={`text-4xl font-bold ${
                          customAnalysis.virality_score >= 80 ? 'text-green-600' :
                          customAnalysis.virality_score >= 60 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {customAnalysis.virality_score}%
                        </div>
                        <div className="text-sm text-gray-600 mt-1">Virality Score</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-4xl font-bold text-gray-900">
                          {customAnalysis.confidence}%
                        </div>
                        <div className="text-sm text-gray-600 mt-1">Confidence</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className={`text-sm font-bold px-3 py-1 rounded-full inline-block ${
                          customAnalysis.trending_factor === 'HIGH' ? 'bg-green-200 text-green-800' :
                          customAnalysis.trending_factor === 'MEDIUM' ? 'bg-yellow-200 text-yellow-800' :
                          'bg-red-200 text-red-800'
                        }`}>
                          {customAnalysis.trending_factor}
                        </div>
                        <div className="text-sm text-gray-600 mt-2">Trending Factor</div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                        <GlobeAltIcon className="h-5 w-5 mr-2 text-blue-600" />
                        AI Analysis
                      </h3>
                      <p className="text-gray-700">{customAnalysis.reasoning}</p>
                    </div>

                    {customAnalysis.key_trends && customAnalysis.key_trends.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Key Trends Detected</h3>
                        <div className="flex flex-wrap gap-2">
                          {customAnalysis.key_trends.map((trend, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                            >
                              {trend}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Tab.Panel>

            {/* Analytics Tab */}
            <Tab.Panel className="rounded-xl bg-white p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Platform Analytics</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Reddit</h3>
                    <div className="text-2xl">🤖</div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Posts Tracked</span>
                      <span className="font-semibold">{stats.totalPosts.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subreddits</span>
                      <span className="font-semibold">10+</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Status</span>
                      <span className="text-green-600 font-semibold">● Active</span>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Perplexity AI</h3>
                    <div className="text-2xl">✨</div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Accuracy Boost</span>
                      <span className="font-semibold">+15%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Real-time</span>
                      <span className="font-semibold">Enabled</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Status</span>
                      <span className="text-green-600 font-semibold">● Connected</span>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Multi-Platform</h3>
                    <div className="text-2xl">🌐</div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Twitter</span>
                      <span className="text-gray-400 font-semibold">Coming Soon</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">TikTok</span>
                      <span className="text-gray-400 font-semibold">Coming Soon</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Instagram</span>
                      <span className="text-gray-400 font-semibold">Coming Soon</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-3">🚀 Coming Soon</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Cross-platform trend detection (Twitter, TikTok, Instagram)</li>
                  <li>• Historical accuracy tracking and validation</li>
                  <li>• Custom subreddit selection</li>
                  <li>• Export predictions to CSV/JSON</li>
                  <li>• API access for developers</li>
                  <li>• Real-time webhooks for alerts</li>
                </ul>
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  )
}