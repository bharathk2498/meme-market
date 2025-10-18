'use client'

import { useEffect, useState } from 'react'
import { formatDistanceToNow } from 'date-fns'

interface Prediction {
  reddit_id: string
  title: string
  subreddit: string
  score: number
  virality_score: number
  created_utc: string
  permalink: string
}

export default function LivePredictions() {
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchPredictions()
  }, [])

  const fetchPredictions = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/predictions/top?limit=5`)
      if (!response.ok) throw new Error('Failed to fetch')
      const data = await response.json()
      setPredictions(data.predictions)
    } catch (err) {
      setError('Unable to load predictions')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div id="predictions" className="bg-gray-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Live Predictions
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            These posts are predicted to go viral in the next 24 hours
          </p>
        </div>

        {loading && (
          <div className="mt-16 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent"></div>
          </div>
        )}

        {error && (
          <div className="mt-16 text-center text-red-600">
            {error}
          </div>
        )}

        {!loading && !error && predictions.length > 0 && (
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-1">
            {predictions.map((prediction) => (
              <div
                key={prediction.reddit_id}
                className="flex flex-col gap-4 rounded-2xl bg-white p-8 shadow-lg ring-1 ring-gray-200 hover:shadow-xl transition-shadow duration-200"
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center rounded-full bg-primary-50 px-3 py-1 text-sm font-medium text-primary-700">
                    r/{prediction.subreddit}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-primary-600">
                      {Math.round(prediction.virality_score)}
                    </span>
                    <span className="text-sm text-gray-500">virality score</span>
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900">
                  {prediction.title}
                </h3>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{prediction.score} upvotes</span>
                  <span>{formatDistanceToNow(new Date(prediction.created_utc), { addSuffix: true })}</span>
                </div>
                
                <a
                  href={`https://reddit.com${prediction.permalink}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 transition-colors"
                >
                  View on Reddit
                  <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <a
            href="#pricing"
            className="text-primary-600 font-semibold hover:text-primary-700"
          >
            Get unlimited predictions →
          </a>
        </div>
      </div>
    </div>
  )
}