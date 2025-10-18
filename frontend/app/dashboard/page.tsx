'use client'

import { useState, useEffect } from 'react'
import { 
  SparklesIcon, 
  FireIcon, 
  ChartBarIcon,
  MagnifyingGlassIcon,
  BoltIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('trending')
  const [loading, setLoading] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                MEME MARKET
              </Link>
              <span className="hidden sm:block text-sm text-gray-500 border-l pl-4">AI-Powered Viral Predictor</span>
            </div>
            <nav className="flex items-center space-x-4">
              <Link href="/" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                Home
              </Link>
              <Link href="/predict" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                AI Predictor
              </Link>
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:shadow-lg transition-all">
                Upgrade to Pro
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            <TabButton 
              active={activeTab === 'trending'} 
              onClick={() => setActiveTab('trending')}
              icon={<FireIcon className="h-5 w-5" />}
              label="Trending Now"
            />
            <TabButton 
              active={activeTab === 'predictions'} 
              onClick={() => setActiveTab('predictions')}
              icon={<SparklesIcon className="h-5 w-5" />}
              label="Top Predictions"
            />
            <TabButton 
              active={activeTab === 'analyze'} 
              onClick={() => setActiveTab('analyze')}
              icon={<MagnifyingGlassIcon className="h-5 w-5" />}
              label="AI Analyzer"
            />
            <TabButton 
              active={activeTab === 'analytics'} 
              onClick={() => setActiveTab('analytics')}
              icon={<ChartBarIcon className="h-5 w-5" />}
              label="Analytics"
            />
            <TabButton 
              active={activeTab === 'realtime'} 
              onClick={() => setActiveTab('realtime')}
              icon={<BoltIcon className="h-5 w-5" />}
              label="Real-Time Feed"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'trending' && <TrendingSection />}
        {activeTab === 'predictions' && <PredictionsSection />}
        {activeTab === 'analyze' && <AnalyzeSection />}
        {activeTab === 'analytics' && <AnalyticsSection />}
        {activeTab === 'realtime' && <RealTimeSection />}
      </main>
    </div>
  )
}

function TabButton({ active, onClick, icon, label }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
        active 
          ? 'border-blue-600 text-blue-600' 
          : 'border-transparent text-gray-500 hover:text-gray-700'
      }`}
    >
      {icon}
      <span className="font-medium whitespace-nowrap">{label}</span>
    </button>
  )
}

function TrendingSection() {
  const [trending, setTrending] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTrending()
  }, [])

  const fetchTrending = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/predictions/trending?hours=24`)
      if (response.ok) {
        const data = await response.json()
        setTrending(data.trending || [])
      }
    } catch (error) {
      console.error('Error fetching trending:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingState message="Loading trending posts..." />
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">🔥 Trending Right Now</h2>
          <p className="text-gray-600 mt-1">Posts going viral in the last 24 hours</p>
        </div>
        <button 
          onClick={fetchTrending}
          className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <ClockIcon className="h-4 w-4" />
          <span className="text-sm font-medium">Refresh</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {trending.length === 0 ? (
          <EmptyState message="No trending posts found. Run data collection first." />
        ) : (
          trending.map((post, index) => (
            <PostCard key={post.reddit_id} post={post} rank={index + 1} showBadge="trending" />
          ))
        )}
      </div>
    </div>
  )
}

function PredictionsSection() {
  const [predictions, setPredictions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPredictions()
  }, [])

  const fetchPredictions = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/predictions/top?limit=20`)
      if (response.ok) {
        const data = await response.json()
        setPredictions(data.predictions || [])
      }
    } catch (error) {
      console.error('Error fetching predictions:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingState message="Calculating virality predictions..." />
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">✨ Top Predictions</h2>
          <p className="text-gray-600 mt-1">Posts predicted to go viral in next 24 hours</p>
        </div>
        <button 
          onClick={fetchPredictions}
          className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <ClockIcon className="h-4 w-4" />
          <span className="text-sm font-medium">Refresh</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {predictions.length === 0 ? (
          <EmptyState message="No predictions available. Collecting data..." />
        ) : (
          predictions.map((post, index) => (
            <PostCard key={post.reddit_id} post={post} rank={index + 1} showBadge="prediction" />
          ))
        )}
      </div>
    </div>
  )
}

function AnalyzeSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">🔍 AI-Powered Analyzer</h2>
        <p className="text-gray-600 mt-1">Analyze any meme or trending topic with Perplexity AI</p>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100">
        <div className="text-center space-y-4">
          <div className="text-6xl">🤖</div>
          <h3 className="text-xl font-bold text-gray-900">Perplexity AI Integration</h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Get instant AI-powered analysis with real-time web search across Twitter, TikTok, Reddit, and news sources.
          </p>
          <Link 
            href="/predict"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl transition-all transform hover:scale-105"
          >
            <SparklesIcon className="h-5 w-5" />
            <span>Open AI Predictor</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <FeatureCard 
          icon="🌐"
          title="Real-Time Web Search"
          description="Searches across multiple platforms in real-time"
        />
        <FeatureCard 
          icon="🎯"
          title="Cross-Platform Analysis"
          description="Analyzes trends on Twitter, TikTok, Reddit, and news"
        />
        <FeatureCard 
          icon="📊"
          title="Confidence Scoring"
          description="Provides detailed confidence levels and reasoning"
        />
      </div>
    </div>
  )
}

function AnalyticsSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">📊 Analytics Dashboard</h2>
        <p className="text-gray-600 mt-1">Track accuracy, performance, and trends over time</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Predictions" value="1,247" change="+12%" trend="up" />
        <StatCard title="Accuracy Rate" value="87%" change="+5%" trend="up" />
        <StatCard title="Posts Tracked" value="5,420" change="+234" trend="up" />
        <StatCard title="Viral Hits" value="342" change="+18" trend="up" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Prediction Accuracy Over Time</h3>
          <div className="h-64 flex items-center justify-center text-gray-400">
            <ChartBarIcon className="h-16 w-16" />
          </div>
          <p className="text-sm text-gray-500 text-center mt-4">Chart visualization coming soon</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Subreddits</h3>
          <div className="space-y-3">
            <SubredditBar name="r/memes" count={342} percentage={85} />
            <SubredditBar name="r/funny" count={298} percentage={72} />
            <SubredditBar name="r/dankmemes" count={256} percentage={68} />
            <SubredditBar name="r/technology" count="234" percentage={65} />
            <SubredditBar name="r/gaming" count={198} percentage={58} />
          </div>
        </div>
      </div>
    </div>
  )
}

function RealTimeSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">⚡ Real-Time Feed</h2>
        <p className="text-gray-600 mt-1">Live updates from multiple platforms</p>
      </div>

      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-8 border border-yellow-100">
        <div className="text-center space-y-4">
          <div className="text-6xl">🚀</div>
          <h3 className="text-xl font-bold text-gray-900">Coming Soon</h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Real-time streaming feed from Reddit, Twitter, and TikTok. Watch trends emerge in real-time and get instant notifications.
          </p>
          <div className="flex justify-center space-x-4 mt-6">
            <span className="px-4 py-2 bg-white rounded-lg text-sm font-medium text-gray-700 border border-gray-200">
              Reddit WebSocket
            </span>
            <span className="px-4 py-2 bg-white rounded-lg text-sm font-medium text-gray-700 border border-gray-200">
              Twitter Streaming
            </span>
            <span className="px-4 py-2 bg-white rounded-lg text-sm font-medium text-gray-700 border border-gray-200">
              TikTok API
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function PostCard({ post, rank, showBadge }: any) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50'
    if (score >= 60) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all hover:border-blue-300">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 text-center">
          <div className="text-2xl font-bold text-gray-400">#{rank}</div>
          {post.virality_score && (
            <div className={`mt-2 px-3 py-1 rounded-full text-sm font-bold ${getScoreColor(post.virality_score)}`}>
              {Math.round(post.virality_score)}%
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              r/{post.subreddit}
            </span>
            {showBadge === 'trending' && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                🔥 Trending
              </span>
            )}
            {showBadge === 'prediction' && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                ✨ Predicted
              </span>
            )}
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {post.title}
          </h3>
          
          <div className="flex items-center space-x-6 text-sm text-gray-500">
            <span className="flex items-center space-x-1">
              <span>👍</span>
              <span className="font-medium">{post.score?.toLocaleString() || 0}</span>
            </span>
            <span className="flex items-center space-x-1">
              <span>💬</span>
              <span className="font-medium">{post.num_comments?.toLocaleString() || 0}</span>
            </span>
            <span>{new Date(post.created_utc).toLocaleDateString()}</span>
          </div>
        </div>
        
        <div className="flex-shrink-0">
          <a
            href={`https://reddit.com${post.permalink}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            View on Reddit
          </a>
        </div>
      </div>
    </div>
  )
}

function LoadingState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
      <p className="text-gray-600">{message}</p>
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="bg-white rounded-xl p-12 border border-gray-200 text-center">
      <div className="text-gray-400 text-6xl mb-4">📭</div>
      <p className="text-gray-600">{message}</p>
    </div>
  )
}

function FeatureCard({ icon, title, description }: any) {
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  )
}

function StatCard({ title, value, change, trend }: any) {
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <p className="text-sm text-gray-600 mb-1">{title}</p>
      <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
      <p className={`text-sm font-medium ${
        trend === 'up' ? 'text-green-600' : 'text-red-600'
      }`}>
        {trend === 'up' ? '↑' : '↓'} {change}
      </p>
    </div>
  )
}

function SubredditBar({ name, count, percentage }: any) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium text-gray-700">{name}</span>
        <span className="text-gray-500">{count}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  )
}