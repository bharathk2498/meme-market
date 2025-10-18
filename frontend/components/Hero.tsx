import Link from 'next/link'

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700">
      <div className="absolute inset-0 bg-grid-white/10 bg-[size:32px_32px]" />
      
      <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-5xl font-bold tracking-tight text-white sm:text-7xl">
            Predict Viral Trends
            <span className="block text-primary-200">24 Hours Before They Explode</span>
          </h1>
          
          <p className="mt-6 text-lg leading-8 text-primary-100">
            AI-powered platform that tells you what content will go viral next. Stop guessing. Start winning.
          </p>
          
          <div className="mt-10 flex items-center justify-center gap-6">
            <Link
              href="/predict"
              className="rounded-full bg-white px-8 py-4 text-base font-semibold text-primary-900 shadow-lg hover:bg-primary-50 transition-all duration-200 hover:scale-105"
            >
              Try AI Predictor
            </Link>
            <a
              href="#predictions"
              className="rounded-full border-2 border-white px-8 py-4 text-base font-semibold text-white hover:bg-white/10 transition-all duration-200"
            >
              See Live Predictions
            </a>
          </div>
          
          <div className="mt-16 grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white">85%</div>
              <div className="mt-2 text-sm text-primary-200">Prediction Accuracy</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white">24h</div>
              <div className="mt-2 text-sm text-primary-200">Lead Time</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white">10+</div>
              <div className="mt-2 text-sm text-primary-200">Subreddits Tracked</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute inset-x-0 -bottom-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-bottom-80">
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary-200 to-primary-400 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>
    </div>
  )
}