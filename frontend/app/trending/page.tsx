'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeftIcon, FireIcon, SparklesIcon } from '@heroicons/react/24/outline'

interface TrendingPost {
  reddit_id: string
  title: string
  subreddit: string
  score: number
  virality_score: number
  num_comments: number
  permalink: string
}

interface PerplexityTrend {
  topic: string
  trend_score: number
  platforms: string[]
  description: string
}

export default function TrendingPage() {
  const [redditTrending, setRedditTrending] = useState<TrendingPost[]>([])
  const [webTrending, setWebTrending] = useState<PerplexityTrend[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'reddit' | 'web'>('reddit')

  useEffect(() => {
    loadTrending()
  }, [])

  const loadTrending = async () => {
    setLoading(true)
    try {
      // Load Reddit trending
      const redditResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/predictions/trending?hours=24`)
      if (redditResponse.ok) {
        const redditData = await redditResponse.json()
        setRedditTrending(redditData.trending || [])
      }

      // Load Web trending (Perplexity)
      try {
        const webResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/perplexity/trending-now`)
        if (webResponse.ok) {
          const webData = await webResponse.json()
          if (webData.success && webData.trending?.trending_topics) {
            setWebTrending(webData.trending.trending_topics)
          }
        }
      } catch (error) {
        console.log('Perplexity trending not available')
      }
    } catch (error) {
      console.error('Error loading trending:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/dashboard" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8">
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Dashboard
        </Link>

        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-red-100 rounded-full mb-4">
            <FireIcon className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Trending Now</h1>
          <p className="text-lg text-gray-600">What's going viral across platforms</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1">
            <button
              onClick={() => setActiveTab('reddit')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'reddit'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Reddit Trending
            </button>
            <button
              onClick={() => setActiveTab('web')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'web'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <SparklesIcon className="h-4 w-4 inline mr-1" />
              AI Web Trends
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-4 text-gray-600">Loading trending topics...</p>
          </div>
        ) : activeTab === 'reddit' ? (
          <div className="grid gap-6">
            {redditTrending.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-lg shadow">
                <p className="text-gray-500">No trending posts available</p>
              </div>
            ) : (
              redditTrending.map((post) => (
                <div
                  key={post.reddit_id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          r/{post.subreddit}
                        </span>
                        <span className="inline-flex px-3 py-1 text-xs font-bold rounded-full bg-red-100 text-red-800">
                          🔥 {Math.round(post.virality_score)}% viral
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{post.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{post.score.toLocaleString()} upvotes</span>
                        <span>{post.num_comments.toLocaleString()} comments</span>
                      </div>
                    </div>
                    <a
                      href={`https://reddit.com${post.permalink}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      View on Reddit
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="grid gap-6">
            {webTrending.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-lg shadow">
                <SparklesIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">Perplexity AI trends not available</p>
                <p className="text-sm text-gray-400">Configure PERPLEXITY_API_KEY to enable</p>
              </div>
            ) : (
              webTrending.map((trend, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="inline-flex px-3 py-1 text-xs font-bold rounded-full bg-purple-100 text-purple-800">
                          Score: {trend.trend_score}/100
                        </span>
                        {trend.platforms?.map((platform) => (
                          <span
                            key={platform}
                            className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700"
                          >
                            {platform}
                          </span>
                        ))}
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{trend.topic}</h3>
                      <p className="text-gray-600">{trend.description}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}