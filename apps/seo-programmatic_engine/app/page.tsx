import Link from 'next/link';
import { DOMAINS } from '@/lib/domains';

export default function HomePage() {
  const sortedDomains = Object.entries(DOMAINS).sort(
    ([, a], [, b]) => a.priority - b.priority
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-white mb-4">
            🚀 SEO Programmatic Engine
          </h1>
          <p className="text-2xl text-purple-300 mb-2">
            11-Domain Portfolio • $4.6M Annual Revenue
          </p>
          <p className="text-lg text-purple-400">
            Powered by 80/20 Pareto Principle
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <p className="text-purple-300 text-sm mb-1">Total Domains</p>
            <p className="text-white text-3xl font-bold">11</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <p className="text-purple-300 text-sm mb-1">Year 1 Revenue</p>
            <p className="text-white text-3xl font-bold">$4.6M</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <p className="text-purple-300 text-sm mb-1">Top 20% Domains</p>
            <p className="text-white text-3xl font-bold">5</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <p className="text-purple-300 text-sm mb-1">Pareto Revenue</p>
            <p className="text-green-400 text-3xl font-bold">$2.3M</p>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="mb-12 flex justify-center space-x-4">
          <Link
            href="/dashboard/pareto"
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all"
          >
            📊 Pareto Dashboard
          </Link>
          <Link
            href="/dashboard/pareto"
            className="bg-white/10 backdrop-blur-lg text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/20 border border-white/20 transition-all"
          >
            📈 Analytics
          </Link>
        </div>

        {/* Domain Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedDomains.map(([domain, config]) => {
            const isPareto = config.priority <= 5;
            
            return (
              <Link
                key={domain}
                href={`/sites/${config.key}`}
                className={`group relative overflow-hidden rounded-xl p-6 border-2 transition-all hover:scale-105 ${
                  isPareto
                    ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/50'
                    : 'bg-white/5 border-white/10'
                }`}
              >
                {isPareto && (
                  <div className="absolute top-3 right-3">
                    <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      TOP 20%
                    </span>
                  </div>
                )}

                <div className="mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      config.priority === 1 ? 'bg-red-500'
                      : config.priority === 2 ? 'bg-orange-500'
                      : config.priority === 3 ? 'bg-yellow-500'
                      : config.priority === 4 ? 'bg-green-500'
                      : config.priority === 5 ? 'bg-blue-500'
                      : 'bg-gray-500'
                    } text-white`}>
                      P{config.priority}
                    </span>
                    <span className="text-purple-300 text-xs">
                      ${(config.year1_revenue / 1000).toFixed(0)}k/year
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    {config.name}
                  </h3>
                  <p className="text-sm text-purple-300 mb-3">
                    {config.description}
                  </p>
                  <p className="text-xs text-white/60">{domain}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {config.categories.slice(0, 3).map((cat) => (
                    <span
                      key={cat}
                      className="bg-white/10 text-white px-2 py-1 rounded text-xs"
                    >
                      {cat}
                    </span>
                  ))}
                </div>

                <div className="absolute bottom-0 right-0 opacity-10 group-hover:opacity-20 transition-opacity">
                  <div
                    className="w-32 h-32 rounded-full blur-2xl"
                    style={{ backgroundColor: config.theme.primary }}
                  />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <p className="text-purple-400 text-sm">
            Generated {new Date().toLocaleDateString()} • Powered by Modal + GROQ + Supabase
          </p>
        </div>
      </div>
    </div>
  );
}
