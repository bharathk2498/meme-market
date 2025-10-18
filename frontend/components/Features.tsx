export default function Features() {
  const features = [
    {
      name: 'API-Based Data Collection',
      description: 'Our AI connects to official platform APIs and aggregates publicly available trend data from Reddit every 2 hours.',
      icon: '🎯',
    },
    {
      name: 'Predictive Intelligence',
      description: 'Machine learning models calculate virality scores based on engagement velocity, cross-platform presence, and sentiment analysis.',
      icon: '🧠',
    },
    {
      name: 'Instant Alerts',
      description: 'Get notifications the moment our AI detects a trend about to explode. Be first to market, every single time.',
      icon: '⚡',
    },
    {
      name: 'Historical Analysis',
      description: 'Track trends over time and learn from past viral content to improve your strategy.',
      icon: '📊',
    },
    {
      name: 'Subreddit Filtering',
      description: 'Focus on specific subreddits relevant to your niche or monitor everything at once.',
      icon: '🎛️',
    },
    {
      name: 'Export & Integration',
      description: 'Export predictions to CSV or integrate via our REST API into your existing workflow.',
      icon: '🔗',
    },
  ]

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to stay ahead of trends
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            Built for marketers, creators, and agencies who need a competitive edge
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <span className="text-4xl">{feature.icon}</span>
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}