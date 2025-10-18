'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  ChartBarIcon, 
  SparklesIcon, 
  FireIcon,
  ClockIcon,
  TrendingUpIcon,
  ArrowPathIcon
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

interface Stats {
  total_posts: number
  predictions_today: number
  avg_accuracy: number
  trending_topics: number
}

export default function Dashboard() {
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [stats, setStats] = useState<Stats>({
    total_posts: 0,
    predictions_today: 0,
    avg_accuracy: 85,
    trending_topics: 0
  })
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/predictions/top?limit=10`)
      if (response.ok) {
        const data = await response.json()
        setPredictions(data.predictions || [])
        setStats(prev => ({
          ...prev,
          total_posts: data.count || 0,
          predictions_today: data.count || 0,
          trending_topics: data.predictions?.filter((p: Prediction) => p.virality_score > 70).length || 0
        }))
      }
    } catch (error) {
      console.error('Error loading dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const refreshData = async () => {
    setRefreshing(true)
    await loadDashboard()
    setRefreshing(false)
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50'
    if (score >= 60) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800'
    if (score >= 60) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    
    if (diffHours < 1) return 'Just now'
    if (diffHours < 24) return `${diffHours}h ago`
    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays}d ago`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1">AI-powered viral trend predictions</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={refreshData}
                disabled={refreshing}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                <ArrowPathIcon className={`h-5 w-5 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <Link
                href="/predict"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <SparklesIcon className="h-5 w-5 mr-2" />
                AI Predictor
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ChartBarIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Posts</dt>
                    <dd className="text-2xl font-bold text-gray-900">{stats.total_posts}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUpIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Predictions Today</dt>
                    <dd className="text-2xl font-bold text-gray-900">{stats.predictions_today}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <SparklesIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Avg Accuracy</dt>
                    <dd className="text-2xl font-bold text-gray-900">{stats.avg_accuracy}%</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FireIcon className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Trending Now</dt>
                    <dd className="text-2xl font-bold text-gray-900">{stats.trending_topics}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/predict"
              className="flex items-center p-4 border-2 border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <SparklesIcon className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <div className="font-semibold text-gray-900">AI Predictor</div>
                <div className="text-sm text-gray-500">Analyze any meme</div>
              </div>
            </Link>

            <Link
              href="/trending"
              className="flex items-center p-4 border-2 border-green-200 rounded-lg hover:bg-green-50 transition-colors"
            >
              <FireIcon className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <div className="font-semibold text-gray-900">Trending Now</div>
                <div className="text-sm text-gray-500">Hot topics today</div>
              </div>
            </Link>

            <Link
              href="/compare"
              className="flex items-center p-4 border-2 border-purple-200 rounded-lg hover:bg-purple-50 transition-colors"
            >
              <ChartBarIcon className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <div className="font-semibold text-gray-900">Compare</div>
                <div className="text-sm text-gray-500">Multi-platform</div>
              </div>
            </Link>
          </div>
        </div>

        {/* Predictions Table */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Top Predictions</h2>
          </div>
          
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
              <p className="mt-4 text-gray-500">Loading predictions...</p>
            </div>
          ) : predictions.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-500">No predictions available. Run data collection first.</p>
            </div>
          ) : (
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Post</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subreddit</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Virality</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {predictions.map((prediction) => (
                    <tr key={prediction.reddit_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 line-clamp-2">{prediction.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          r/{prediction.subreddit}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {prediction.score.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-3 py-1 text-sm font-bold rounded-full ${getScoreBadgeColor(prediction.virality_score)}`}>
                          {Math.round(prediction.virality_score)}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <ClockIcon className="h-4 w-4 mr-1" />
                          {formatTimeAgo(prediction.created_utc)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <a
                          href={`https://reddit.com${prediction.permalink}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-900 font-medium"
                        >
                          View
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}