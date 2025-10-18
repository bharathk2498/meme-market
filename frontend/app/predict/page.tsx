'use client'

import { useState } from 'react'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

interface Analysis {
  will_go_viral: boolean
  confidence: number
  virality_score: number
  reasoning: string
  trending_factor: string
  predicted_peak_score: number
  key_trends: string[]
}

export default function PredictPage() {
  const [title, setTitle] = useState('')
  const [subreddit, setSubreddit] = useState('memes')
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [error, setError] = useState('')

  const analyzeMeme = async () => {
    if (!title.trim()) {
      setError('Please enter a meme title or description')
      return
    }

    setLoading(true)
    setError('')
    setAnalysis(null)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/perplexity/analyze-meme`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
    if (factor === 'HIGH') return 'bg-green-100 text-green-800'
    if (factor === 'MEDIUM') return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700">
      <div className="absolute inset-0 bg-grid-white/10 bg-[size:32px_32px]" />
      
      <div className="relative mx-auto max-w-4xl px-6 py-12">
        <Link href="/" className="inline-flex items-center text-white hover:text-primary-200 mb-8">
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Home
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            AI Meme Predictor
          </h1>
          <p className="text-xl text-primary-100">
            Powered by Perplexity AI with real-time web search
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meme Title or Description
              </label>
              <textarea
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter your meme idea, trending topic, or post title..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Subreddit
              </label>
              <select
                value={subreddit}
                onChange={(e) => setSubreddit(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="memes">r/memes</option>
                <option value="funny">r/funny</option>
                <option value="dankmemes">r/dankmemes</option>
                <option value="wholesomememes">r/wholesomememes</option>
                <option value="me_irl">r/me_irl</option>
                <option value="AdviceAnimals">r/AdviceAnimals</option>
                <option value="gaming">r/gaming</option>
                <option value="technology">r/technology</option>
              </select>
            </div>

            <button
              onClick={analyzeMeme}
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing with Perplexity AI...
                </span>
              ) : (
                'Predict Virality'
              )}
            </button>
          </div>
        </div>

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

        {analysis && (
          <div className="bg-white rounded-3xl shadow-2xl p-8 space-y-6">
            <div className="text-center border-b pb-6">
              <div className="inline-block">
                <div className={`text-6xl font-bold ${getScoreColor(analysis.virality_score)} mb-2`}>
                  {analysis.virality_score}%
                </div>
                <div className="text-sm text-gray-500">Virality Score</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {analysis.will_go_viral ? '✅' : '❌'}
                </div>
                <div className="text-sm text-gray-600">
                  {analysis.will_go_viral ? 'Will Go Viral' : 'May Not Go Viral'}
                </div>
              </div>

              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {analysis.confidence}%
                </div>
                <div className="text-sm text-gray-600">Confidence</div>
              </div>

              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getTrendingColor(analysis.trending_factor)}`}>
                  {analysis.trending_factor}
                </div>
                <div className="text-sm text-gray-600 mt-2">Trending Factor</div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-primary-50 to-primary-100 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">AI Analysis</h3>
              <p className="text-gray-700 leading-relaxed">{analysis.reasoning}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Predicted Peak Score</h4>
                <p className="text-2xl font-bold text-primary-600">
                  {analysis.predicted_peak_score.toLocaleString()} upvotes
                </p>
              </div>

              {analysis.key_trends && analysis.key_trends.length > 0 && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Key Trends Detected</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.key_trends.map((trend, index) => (
                      <span
                        key={index}
                        className="inline-block bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {trend}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-6 border-t text-center">
              <button
                onClick={() => {
                  setTitle('')
                  setAnalysis(null)
                  setError('')
                }}
                className="text-primary-600 hover:text-primary-700 font-semibold"
              >
                Analyze Another Meme
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}