'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  ChartBarIcon, 
  SparklesIcon, 
  FireIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  MagnifyingGlassIcon
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

interface TrendingTopic {
  topic: string
  trend_score: number
  platforms: string[]
  description: string
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('predictions')
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [trending, setTrending] = useState<Prediction[]>([])
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalPosts: 0,
    avgViralityScore: 0,
    topSubreddit: '',
    lastUpdate: ''
  })

  useEffect(() => {
    loadData()
    const interval = setInterval(loadData, 300000) // Refresh every 5 minutes
    return () => clearInterval(interval)
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      await Promise.all([
        loadPredictions(),
        loadTrending(),
        loadTrendingTopics(),
        loadStats()
      ])
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadPredictions = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/predictions/top?limit=20`)
      if (response.ok) {
        const data = await response.json()
        setPredictions(data.predictions || [])
      }
    } catch (error) {
      console.error('Error loading predictions:', error)
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
      console.error('Error loading trending:', error)
    }
  }

  const loadTrendingTopics = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/perplexity/trending-now`)
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.trending?.trending_topics) {
          setTrendingTopics(data.trending.trending_topics.slice(0, 5))
        }
      }
    } catch (error) {
      console.error('Error loading trending topics:', error)
    }
  }

  const loadStats = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reddit/status`)
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setStats({
            totalPosts: data.status.total_posts || 0,
            avgViralityScore: 75,
            topSubreddit: 'technology',
            lastUpdate: data.status.last_collection || new Date().toISOString()
          })
        }
      }
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50'
    if (score >= 60) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString)
      const now = new Date()
      const diff = now.getTime() - date.getTime()
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      
      if (hours > 24) return `${Math.floor(hours / 24)}d ago`
      if (hours > 0) return `${hours}h ago`
      return `${minutes}m ago`
    } catch {
      return 'recently'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-primary-600">
                Meme Market
              </Link>
              <span className="ml-4 inline-flex items-center rounded-full bg-primary-50 px-3 py-1 text-sm font-medium text-primary-700">
                Dashboard
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/predict"
                className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
              >
                <SparklesIcon className="h-5 w-5" />
                AI Predictor
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="bg-white border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">{stats.totalPosts.toLocaleString()}</div>
              <div className="text-sm text-gray-500 mt-1">Total Posts Tracked</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600">{stats.avgViralityScore}%</div>
              <div className="text-sm text-gray-500 mt-1">Avg Virality Score</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">r/{stats.topSubreddit}</div>
              <div className="text-sm text-gray-500 mt-1">Top Subreddit</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">{formatTime(stats.lastUpdate)}</div>
              <div className="text-sm text-gray-500 mt-1">Last Update</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Tab Navigation */}
            <div className="bg-white rounded-lg shadow-sm p-2 flex gap-2">
              <button
                onClick={() => setActiveTab('predictions')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === 'predictions'
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <ChartBarIcon className="h-5 w-5" />
                Top Predictions
              </button>
              <button
                onClick={() => setActiveTab('trending')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === 'trending'
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <FireIcon className="h-5 w-5" />
                Trending Now
              </button>
            </div>

            {/* Content Area */}
            {loading ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent"></div>
                <p className="mt-4 text-gray-600">Loading predictions...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {(activeTab === 'predictions' ? predictions : trending).map((prediction) => (
                  <div
                    key={prediction.reddit_id}
                    className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="inline-flex items-center rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-700">
                            r/{prediction.subreddit}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatTime(prediction.created_utc)}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {prediction.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>↑ {prediction.score.toLocaleString()}</span>
                          <span>💬 {prediction.num_comments}</span>
                          <span>👍 {Math.round(prediction.upvote_ratio * 100)}%</span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full font-bold text-lg ${getScoreColor(prediction.virality_score)}`}>
                          {Math.round(prediction.virality_score)}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <a
                        href={`https://reddit.com${prediction.permalink}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
                      >
                        View on Reddit
                      </a>
                      <Link
                        href={`/predict?title=${encodeURIComponent(prediction.title)}&subreddit=${prediction.subreddit}`}
                        className="inline-flex items-center gap-2 rounded-lg bg-primary-50 px-4 py-2 text-sm font-medium text-primary-700 hover:bg-primary-100 transition-colors"
                      >
                        <SparklesIcon className="h-4 w-4" />
                        AI Analysis
                      </Link>
                    </div>
                  </div>
                ))}

                {(activeTab === 'predictions' ? predictions : trending).length === 0 && (
                  <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                    <MagnifyingGlassIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No predictions available yet.</p>
                    <p className="text-sm text-gray-500 mt-2">Data collection is in progress.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            
            {/* Trending Topics from Perplexity */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <ArrowTrendingUpIcon className="h-5 w-5 text-primary-600" />
                Trending Worldwide
              </h3>
              <div className="space-y-3">
                {trendingTopics.length > 0 ? (
                  trendingTopics.map((topic, index) => (
                    <div key={index} className="border-l-4 border-primary-600 pl-3 py-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{topic.topic}</h4>
                          <p className="text-sm text-gray-500 mt-1">{topic.description}</p>
                          <div className="flex gap-2 mt-2">
                            {topic.platforms.map((platform) => (
                              <span
                                key={platform}
                                className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600"
                              >
                                {platform}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="ml-2">
                          <div className="text-2xl font-bold text-primary-600">
                            {topic.trend_score}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <ClockIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Loading trending topics...</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg shadow-sm p-6 text-white">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  href="/predict"
                  className="block w-full text-center bg-white text-primary-600 px-4 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
                >
                  🤖 AI Meme Predictor
                </Link>
                <button
                  onClick={loadData}
                  className="block w-full text-center bg-primary-800 px-4 py-3 rounded-lg font-semibold hover:bg-primary-900 transition-colors"
                >
                  🔄 Refresh Data
                </button>
              </div>
            </div>

            {/* Info Card */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">💡 Pro Tip</h4>
              <p className="text-sm text-blue-700">
                Use the AI Predictor to analyze any meme idea with Perplexity AI's real-time web search for maximum accuracy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}