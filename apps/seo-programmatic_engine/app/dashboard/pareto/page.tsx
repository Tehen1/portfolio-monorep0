'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface ParetoMetrics {
  total_revenue: number;
  top_20_revenue: number;
  pareto_efficiency: number;
  domains: Array<{
    name: string;
    revenue: number;
    priority: number;
    articles: number;
  }>;
}

export default function ParetoDashboard() {
  const [metrics, setMetrics] = useState<ParetoMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMetrics();
  }, []);

  async function loadMetrics() {
    try {
      const { data: links } = await supabase
        .from('affiliate_links')
        .select('domain, commission_value, status')
        .eq('status', 'active');

      if (!links) return;

      // Calculate Pareto metrics
      const domainRevenue = links.reduce((acc: Record<string, number>, link) => {
        acc[link.domain] = (acc[link.domain] || 0) + link.commission_value;
        return acc;
      }, {} as Record<string, number>);

      const sortedDomains = Object.entries(domainRevenue)
        .map(([name, revenue]) => ({
          name,
          revenue: revenue as number,
          priority: getPriority(name),
          articles: getArticleCount(name)
        }))
        .sort((a, b) => b.revenue - a.revenue);

      const totalRevenue = sortedDomains.reduce((sum, d) => sum + d.revenue, 0);
      const top20Count = Math.ceil(sortedDomains.length * 0.2);
      const top20Revenue = sortedDomains.slice(0, top20Count).reduce((sum, d) => sum + d.revenue, 0);

      setMetrics({
        total_revenue: totalRevenue,
        top_20_revenue: top20Revenue,
        pareto_efficiency: (top20Revenue / totalRevenue) * 100,
        domains: sortedDomains
      });
    } catch (error) {
      console.error('Error loading metrics:', error);
    } finally {
      setLoading(false);
    }
  }

  function getPriority(domain: string): number {
    const priorities: Record<string, number> = {
      'tech-review-blog.com': 1,
      'adaptogenic-mushrooms.com': 2,
      'seobiz.be': 3,
      'fixie.run': 4,
      'antonylambi.be': 5
    };
    return priorities[domain] || 99;
  }

  function getArticleCount(domain: string): number {
    // This would be fetched from a content_performance table in production
    return Math.floor(Math.random() * 50) + 10;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-2xl animate-pulse">Loading Pareto Metrics...</div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">No data available</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-white mb-2">
            📊 Pareto Dashboard
          </h1>
          <p className="text-purple-300 text-lg">
            80/20 Principle Applied to 11-Domain Portfolio
          </p>
        </div>

        {/* Pareto Efficiency Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-purple-300 text-sm mb-1">Total Revenue Potential</p>
              <p className="text-white text-4xl font-bold">
                ${metrics.total_revenue.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-purple-300 text-sm mb-1">Top 20% Revenue</p>
              <p className="text-white text-4xl font-bold">
                ${metrics.top_20_revenue.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-purple-300 text-sm mb-1">Pareto Efficiency</p>
              <p className="text-green-400 text-4xl font-bold">
                {metrics.pareto_efficiency.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        {/* Pareto Bar Chart */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6">
            Revenue Distribution (Pareto 80/20)
          </h2>
          <div className="space-y-4">
            {metrics.domains.map((domain, index) => {
              const percentage = (domain.revenue / metrics.total_revenue) * 100;
              const isTop20 = index < Math.ceil(metrics.domains.length * 0.2);
              
              return (
                <div key={domain.name} className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        domain.priority === 1 ? 'bg-red-500'
                        : domain.priority === 2 ? 'bg-orange-500'
                        : domain.priority === 3 ? 'bg-yellow-500'
                        : 'bg-gray-500'
                      } text-white`}>
                        P{domain.priority}
                      </span>
                      <span className="text-white font-medium">{domain.name}</span>
                      {isTop20 && (
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">
                          Top 20%
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold">${domain.revenue.toLocaleString()}</p>
                      <p className="text-purple-300 text-sm">{domain.articles} articles</p>
                    </div>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-4 overflow-hidden">
                    <div 
                      className={`h-full ${
                        isTop20 
                          ? 'bg-gradient-to-r from-green-500 to-emerald-400'
                          : 'bg-gradient-to-r from-purple-500 to-purple-300'
                      } transition-all duration-1000`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <p className="text-purple-300 text-xs mt-1">{percentage.toFixed(1)}% of total</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pareto Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4">🎯 Focus Recommendations</h3>
            <ul className="space-y-3">
              {metrics.domains.slice(0, 3).map((domain, i) => (
                <li key={domain.name} className="flex items-start space-x-3">
                  <span className="text-2xl">{i === 0 ? '🔴' : i === 1 ? '🟡' : '🟢'}</span>
                  <div>
                    <p className="text-white font-medium">{domain.name}</p>
                    <p className="text-purple-300 text-sm">
                      Priority {domain.priority} • ${domain.revenue} potential
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4">📈 Q1 2025 Targets</h3>
            <div className="space-y-4">
              <div>
                <p className="text-purple-300 text-sm">Month 1 (Conservative)</p>
                <p className="text-white text-2xl font-bold">$3,119</p>
              </div>
              <div>
                <p className="text-purple-300 text-sm">Month 3 (Target)</p>
                <p className="text-white text-2xl font-bold">$5,000</p>
              </div>
              <div>
                <p className="text-purple-300 text-sm">Month 6 (Aggressive)</p>
                <p className="text-green-400 text-2xl font-bold">$25,000</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
