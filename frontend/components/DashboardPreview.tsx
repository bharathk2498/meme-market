import Link from 'next/link'
import { 
  SparklesIcon, 
  ChartBarIcon, 
  FireIcon,
  BoltIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'

export default function DashboardPreview() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Powerful Dashboard for Every Platform
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            Track predictions across Reddit, Twitter, TikTok, and more - all in one place
          </p>
        </div>

        {/* Dashboard Preview */}
        <div className="relative rounded-2xl bg-gray-900 p-2 shadow-2xl ring-1 ring-gray-900/10 sm:p-4">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-30"></div>
          <div className="relative bg-gray-900 rounded-xl overflow-hidden">
            {/* Mock Dashboard Header */}
            <div className="bg-gray-800 px-6 py-4 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl font-bold text-white">Meme Market</div>
                  <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-semibold rounded-full">
                    PRO
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-400">Dashboard</div>
                  <div className="text-sm text-gray-400">Analytics</div>
                  <div className="text-sm text-gray-400">Settings</div>
                </div>
              </div>
            </div>

            {/* Mock Stats */}
            <div className="px-6 py-8 bg-gradient-to-br from-gray-800 to-gray-900">
              <div className="grid grid-cols-4 gap-4">
                {[
                  { icon: ChartBarIcon, label: 'Predictions', value: '247', color: 'blue' },
                  { icon: FireIcon, label: 'Trending', value: '12', color: 'orange' },
                  { icon: SparklesIcon, label: 'Accuracy', value: '85%', color: 'green' },
                  { icon: BoltIcon, label: 'Active', value: '4', color: 'purple' }
                ].map((stat, i) => {
                  const Icon = stat.icon
                  return (
                    <div key={i} className="bg-gray-700/50 rounded-lg p-4 backdrop-blur-sm">
                      <Icon className="h-6 w-6 text-gray-400 mb-2" />
                      <div className="text-2xl font-bold text-white">{stat.value}</div>
                      <div className="text-xs text-gray-400">{stat.label}</div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Mock Content */}
            <div className="px-6 py-8 bg-gray-800">
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-gray-700/50 rounded-lg p-4 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-2">
                      <div className="h-4 bg-gray-600 rounded w-1/3"></div>
                      <div className="h-6 w-12 bg-green-500/20 rounded-full flex items-center justify-center">
                        <span className="text-xs text-green-400 font-bold">{90 - i * 5}%</span>
                      </div>
                    </div>
                    <div className="h-3 bg-gray-600 rounded w-full mb-1"></div>
                    <div className="h-3 bg-gray-600 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100 mb-4">
              <ChartBarIcon className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-Time Analytics</h3>
            <p className="text-gray-600">Track performance across all platforms in real-time</p>
          </div>

          <div className="text-center">
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-purple-100 mb-4">
              <SparklesIcon className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">AI-Powered Predictions</h3>
            <p className="text-gray-600">Leverage Perplexity AI for accurate trend forecasting</p>
          </div>

          <div className="text-center">
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-green-100 mb-4">
              <FireIcon className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Multi-Platform Support</h3>
            <p className="text-gray-600">Reddit, Twitter, TikTok, and more all in one place</p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Explore Dashboard
            <ArrowRightIcon className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  )
}