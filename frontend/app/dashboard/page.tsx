'use client'

import { useState, useEffect } from 'react'
import { ArrowLeftIcon, ChartBarIcon, FireIcon, SparklesIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

interface Prediction {
  title: string
  subreddit: string
  score: number
  virality_score: number
  reddit_id: string
}

interface Analysis {
  will_go_viral: boolean
  confidence: number
  virality_score: number
  reasoning: string
  trending_factor: string
  predicted_peak_score: number
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [loading, setLoading] = useState(false)
  const [analyzeInput, setAnalyzeInput] = useState('')
  const [analysis, setAnalysis] = useState<Analysis | null>(null)

  useEffect(() => {
    loadPredictions()
  }, [])

  const loadPredictions = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/predictions/top?limit=5`)
      if (response.ok) {
        const data = await response.json()
        setPredictions(data.predictions)
      }
    } catch (error) {
      console.error('Failed to load predictions:', error)
    }
    setLoading(false)
  }

  const runAnalysis = async () => {
    if (!analyzeInput.trim()) return
    
    setLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/perplexity/analyze-meme`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: analyzeInput,
          subreddit: 'memes',
          score: 0,
          num_comments: 0,
          age_hours: 0
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        setAnalysis(data.analysis)
      }
    } catch (error) {
      console.error('Analysis failed:', error)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Navigation */}
      <nav className="bg-white border-b sticky top-0 z-50 backdrop-blur-lg bg-opacity-90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Meme Market</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-3 py-1 bg-green-100 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-green-700">Live</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard icon="📊" title="Predictions Today" value="247" change="+12%" />
          <StatCard icon="🎯" title="Accuracy Rate" value="87%" change="Last 7 days" />
          <StatCard icon="🔥" title="Viral Hits" value="34" change="Over 10K upvotes" />
          <StatCard icon="🌐" title="Platforms" value="4" change="Multi-platform" />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* AI Analyzer */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <SparklesIcon className="w-6 h-6 mr-2 text-blue-600" />
              AI Prediction Analyzer
            </h2>
            <p className="text-gray-600 mb-4">Powered by Perplexity AI</p>
            
            <textarea
              value={analyzeInput}
              onChange={(e) => setAnalyzeInput(e.target.value)}
              placeholder="Enter your meme idea or trending topic..."
              className="w-full p-4 border-2 border-gray-200 rounded-xl mb-4 focus:border-blue-500 focus:outline-none resize-none"
              rows={4}
            />
            
            <button
              onClick={runAnalysis}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50"
            >
              {loading ? 'Analyzing...' : 'Analyze with AI'}
            </button>

            {analysis && (
              <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl">
                <p className="text-3xl font-bold text-green-600 mb-2">{analysis.virality_score}%</p>
                <p className="text-sm text-gray-600">{analysis.reasoning}</p>
              </div>
            )}
          </div>

          {/* Live Predictions */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <FireIcon className="w-6 h-6 mr-2 text-orange-600" />
                Top Predictions
              </h2>
              <button onClick={loadPredictions} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowPathIcon className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            
            <div className="space-y-3">
              {predictions.map((pred, index) => (
                <div key={pred.reddit_id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                    #{index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{pred.title}</p>
                    <p className="text-xs text-gray-500">r/{pred.subreddit}</p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <p className="text-lg font-bold text-green-600">{pred.virality_score}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon, title, value, change }: { icon: string; title: string; value: string; change: string }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-blue-600 mt-2">{change}</p>
    </div>
  )
}