'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('7d')

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8">
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Dashboard
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Analytics</h1>
          <p className="text-gray-600">Track your prediction performance and trends</p>
        </div>

        {/* Time Range Selector */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex space-x-2">
            {['24h', '7d', '30d', '90d', 'All'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  timeRange === range
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Accuracy Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Prediction Accuracy</h3>
            <div className="h-64 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
              <div className="text-center">
                <div className="text-6xl font-bold text-blue-600 mb-2">85%</div>
                <div className="text-gray-600">Average Accuracy</div>
              </div>
            </div>
          </div>

          {/* Platform Distribution */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Platform Distribution</h3>
            <div className="space-y-4">
              {[
                { platform: 'Reddit', percentage: 45, color: 'orange' },
                { platform: 'Twitter', percentage: 25, color: 'blue' },
                { platform: 'TikTok', percentage: 20, color: 'pink' },
                { platform: 'Other', percentage: 10, color: 'gray' }
              ].map((item) => (
                <div key={item.platform}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{item.platform}</span>
                    <span className="text-gray-600">{item.percentage}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-${item.color}-600`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Performance Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: 'Total Predictions', value: '1,247', trend: '+12%' },
              { label: 'Successful Calls', value: '1,061', trend: '+8%' },
              { label: 'Avg Response Time', value: '2.3s', trend: '-5%' },
              { label: 'API Usage', value: '87%', trend: '+3%' }
            ].map((metric, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-1">{metric.value}</div>
                <div className="text-sm text-gray-600 mb-1">{metric.label}</div>
                <div className="text-sm text-green-600 font-semibold">{metric.trend}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}