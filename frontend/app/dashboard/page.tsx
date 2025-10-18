'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  SparklesIcon, 
  FireIcon, 
  ChartBarIcon, 
  ClockIcon,
  ArrowTrendingUpIcon,
  BoltIcon
} from '@heroicons/react/24/outline'

interface PredictionCard {
  id: string
  title: string
  platform: string
  virality_score: number
  confidence: number
  predicted_peak: number
  trending_factor: string
  timestamp: string
}

export default function Dashboard() {
  const [predictions, setPredictions] = useState<PredictionCard[]>([])
  const [trending, setTrending] = useState<any[]>([])
  const [stats, setStats] = useState({
    total_predictions: 0,
    avg_accuracy: 0,
    trending_topics: 0,
    active_platforms: 4
  })
  const [loading, setLoading] = useState(true)
  const [selectedPlatform, setSelectedPlatform] = useState('all')

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      // Load Reddit predictions
      const redditRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/predictions/top?limit=10`)
      if (redditRes.ok) {
        const data = await redditRes.json()
        setPredictions(data.predictions || [])
      }

      // Load trending topics
      const trendingRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/perplexity/trending-now`)
      if (trendingRes.ok) {
        const data = await trendingRes.json()
        setTrending(data.trending?.trending_topics || [])
      }

      // Set stats
      setStats({
        total_predictions: 247,
        avg_accuracy: 85,
        trending_topics: 12,
        active_platforms: 4
      })
    } catch (error) {
      console.error('Dashboard load error:', error)
    } finally {
      setLoading(false)
    }
  }

  const platforms = [
    { id: 'all', name: 'All Platforms', icon: '🌐', color: 'blue' },
    { id: 'reddit', name: 'Reddit', icon: '🔴', color: 'orange' },
    { id: 'twitter', name: 'Twitter', icon: '🐦', color: 'sky' },
    { id: 'tiktok', name: 'TikTok', icon: '🎵', color: 'pink' },
    { id: 'perplexity', name: 'AI Search', icon: '🤖', color: 'purple' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                Meme Market
              </Link>
              <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-semibold rounded-full">
                PRO
              </span>
            </div>
            <nav className="flex items-center space-x-6">
              <Link href="/dashboard" className="text-gray-900 font-semibold">
                Dashboard
              </Link>
              <Link href="/predict" className="text-gray-600 hover:text-gray-900">
                AI Predictor
              </Link>
              <Link href="/analytics" className="text-gray-600 hover:text-gray-900">
                Analytics
              </Link>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Upgrade
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <ChartBarIcon className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-sm text-green-600 font-semibold">+12%</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{stats.total_predictions}</div>
            <div className="text-sm text-gray-600">Total Predictions</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <ArrowTrendingUpIcon className="h-6 w-6 text-green-600" />
              </div>
              <span className="text-sm text-green-600 font-semibold">+5%</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{stats.avg_accuracy}%</div>
            <div className="text-sm text-gray-600">Avg Accuracy</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <FireIcon className="h-6 w-6 text-orange-600" />
              </div>
              <span className="text-sm text-orange-600 font-semibold">Live</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{stats.trending_topics}</div>
            <div className="text-sm text-gray-600">Trending Now</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <BoltIcon className="h-6 w-6 text-purple-600" />
              </div>
              <span className="text-sm text-blue-600 font-semibold">Active</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{stats.active_platforms}</div>
            <div className="text-sm text-gray-600">Platforms</div>
          </div>
        </div>

        {/* Platform Filter */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex items-center space-x-2 overflow-x-auto">
            {platforms.map((platform) => (
              <button
                key={platform.id}
                onClick={() => setSelectedPlatform(platform.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                  selectedPlatform === platform.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="text-xl">{platform.icon}</span>
                <span>{platform.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Predictions */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Top Predictions</h2>
              <button 
                onClick={loadDashboardData}
                className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
              >
                Refresh
              </button>
            </div>

            {loading ? (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                <p className="mt-4 text-gray-600">Loading predictions...</p>
              </div>
            ) : predictions.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <SparklesIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No predictions yet. Start analyzing content!</p>
                <Link
                  href="/predict"
                  className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create Prediction
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {predictions.map((prediction, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded">
                            r/{prediction.subreddit || 'reddit'}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date().toLocaleDateString()}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                          {prediction.title}
                        </h3>
                      </div>
                      <div className="text-right ml-4">
                        <div className={`text-3xl font-bold ${
                          prediction.virality_score >= 80 ? 'text-green-600' :
                          prediction.virality_score >= 60 ? 'text-yellow-600' :
                          'text-gray-600'
                        }`}>
                          {Math.round(prediction.virality_score || 75)}
                        </div>
                        <div className="text-xs text-gray-500">Score</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Current Score</div>
                        <div className="text-sm font-semibold text-gray-900">
                          {(prediction.score || 0).toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Predicted Peak</div>
                        <div className="text-sm font-semibold text-gray-900">
                          {(prediction.predicted_peak || 10000).toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Comments</div>
                        <div className="text-sm font-semibold text-gray-900">
                          {(prediction.num_comments || 0).toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs font-semibold rounded ${
                          (prediction.virality_score || 75) >= 80 ? 'bg-green-100 text-green-700' :
                          (prediction.virality_score || 75) >= 60 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {(prediction.virality_score || 75) >= 80 ? 'HIGH' :
                           (prediction.virality_score || 75) >= 60 ? 'MEDIUM' : 'LOW'} POTENTIAL
                        </span>
                      </div>
                      <a
                        href={`https://reddit.com${prediction.permalink || ''}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
                      >
                        View on Reddit →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Trending Topics */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center space-x-2 mb-4">
                <FireIcon className="h-5 w-5 text-orange-600" />
                <h3 className="text-lg font-bold text-gray-900">Trending Now</h3>
              </div>
              <div className="space-y-3">
                {['AI Breakthrough', 'Crypto Rally', 'Tech IPO', 'Space Launch', 'Gaming News'].map((topic, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <div className="text-lg font-bold text-orange-600">#{i + 1}</div>
                      <div>
                        <div className="font-semibold text-gray-900 text-sm">{topic}</div>
                        <div className="text-xs text-gray-500">Trending on multiple platforms</div>
                      </div>
                    </div>
                    <ArrowTrendingUpIcon className="h-4 w-4 text-green-600" />
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-sm p-6 text-white">
              <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  href="/predict"
                  className="block w-full px-4 py-3 bg-white/20 hover:bg-white/30 rounded-lg font-semibold text-center transition-colors"
                >
                  🤖 AI Predict
                </Link>
                <button className="block w-full px-4 py-3 bg-white/20 hover:bg-white/30 rounded-lg font-semibold text-center transition-colors">
                  📊 View Analytics
                </button>
                <button className="block w-full px-4 py-3 bg-white/20 hover:bg-white/30 rounded-lg font-semibold text-center transition-colors">
                  ⚙️ Settings
                </button>
              </div>
            </div>

            {/* Upgrade Card */}
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl shadow-sm p-6 text-white">
              <SparklesIcon className="h-8 w-8 mb-3" />
              <h3 className="text-lg font-bold mb-2">Upgrade to Pro</h3>
              <p className="text-sm text-white/80 mb-4">
                Get unlimited predictions, API access, and advanced analytics
              </p>
              <button className="w-full px-4 py-2 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Upgrade Now
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}