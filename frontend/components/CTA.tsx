'use client'

import { useState } from 'react'

export default function CTA() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="bg-primary-900">
      <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to predict the next viral trend?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-primary-200">
            Join 500+ marketers and creators who are already staying ahead of trends
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="w-full max-w-md">
                <div className="flex gap-x-4">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="min-w-0 flex-auto rounded-lg border-0 bg-white/5 px-4 py-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-white placeholder:text-gray-400 sm:text-sm sm:leading-6"
                  />
                  <button
                    type="submit"
                    className="flex-none rounded-lg bg-white px-6 py-3 text-sm font-semibold text-primary-900 shadow-sm hover:bg-primary-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    Get Started
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center">
                <p className="text-lg font-semibold text-white">🎉 Thanks for joining!</p>
                <p className="mt-2 text-sm text-primary-200">Check your email for next steps</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}