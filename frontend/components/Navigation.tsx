import Link from 'next/link'

export default function Navigation() {
  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center px-2 text-gray-900 font-bold text-xl">
              Meme Market
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/dashboard"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-blue-600"
              >
                Dashboard
              </Link>
              <Link
                href="/predict"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-blue-600"
              >
                AI Predictor
              </Link>
              <a
                href="#predictions"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-blue-600"
              >
                Live Predictions
              </a>
              <a
                href="#pricing"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-blue-600"
              >
                Pricing
              </a>
            </div>
          </div>
          <div className="flex items-center">
            <Link
              href="/dashboard"
              className="ml-8 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}