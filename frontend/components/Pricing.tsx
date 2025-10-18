export default function Pricing() {
  const tiers = [
    {
      name: 'Free',
      price: '$0',
      description: 'Perfect for trying out Meme Market',
      features: [
        'Top 3 daily predictions',
        'Email alerts',
        'Basic analytics',
        'Community access',
      ],
      cta: 'Start Free',
      featured: false,
    },
    {
      name: 'Pro',
      price: '$19',
      description: 'For serious creators and marketers',
      features: [
        'Unlimited predictions',
        'API access',
        'Real-time alerts',
        'Advanced analytics',
        'Priority support',
        'Historical data',
      ],
      cta: 'Start Free Trial',
      featured: true,
    },
    {
      name: 'Agency',
      price: '$79',
      description: 'For teams and agencies',
      features: [
        'Everything in Pro',
        'White-label access',
        'Team seats (5+)',
        'Custom tracking',
        'Dedicated manager',
        'Custom integrations',
      ],
      cta: 'Contact Sales',
      featured: false,
    },
  ]

  return (
    <div id="pricing" className="bg-gray-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            Start free, upgrade when you are ready
          </p>
        </div>
        <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={
                tier.featured
                  ? 'ring-2 ring-primary-600 rounded-3xl p-8 bg-white shadow-2xl scale-105'
                  : 'ring-1 ring-gray-200 rounded-3xl p-8 bg-white'
              }
            >
              {tier.featured && (
                <p className="text-center text-sm font-semibold text-primary-600 mb-4">
                  MOST POPULAR
                </p>
              )}
              <h3 className="text-2xl font-bold tracking-tight text-gray-900">
                {tier.name}
              </h3>
              <p className="mt-4 text-sm leading-6 text-gray-600">
                {tier.description}
              </p>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span className="text-5xl font-bold tracking-tight text-gray-900">
                  {tier.price}
                </span>
                <span className="text-sm font-semibold leading-6 text-gray-600">
                  /month
                </span>
              </p>
              <a
                href="#"
                className={
                  tier.featured
                    ? 'mt-6 block rounded-lg bg-primary-600 px-3 py-2 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary-700'
                    : 'mt-6 block rounded-lg bg-gray-900 px-3 py-2 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-800'
                }
              >
                {tier.cta}
              </a>
              <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <svg
                      className="h-6 w-5 flex-none text-primary-600"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}