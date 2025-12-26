import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(request: NextRequest) {
  try {
    // Fetch domains from database
    const { data: domains, error } = await supabase
      .from('portfolio.domains')
      .select('*')
      .eq('is_active', true)

    if (error) throw error

    // Get current metrics for each domain
    const domainsWithMetrics = await Promise.all(
      domains.map(async (domain) => {
        // Get traffic metrics (mock data for now - would connect to GA/GA4)
        const traffic = Math.floor(Math.random() * 10000) + 1000

        // Get revenue metrics from database
        const { data: revenueData } = await supabase
          .from('portfolio.revenue_tracking')
          .select('amount_eur')
          .eq('domain', domain.domain_name)
          .gte('processed_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())

        const revenue = revenueData?.reduce((sum, item) => sum + item.amount_eur, 0) || 0

        // Get subscriber count (mock data)
        const subscribers = Math.floor(Math.random() * 5000) + 500

        // Calculate growth rate (mock data)
        const growthRate = Math.floor(Math.random() * 40) - 10

        return {
          domain_name: domain.domain_name,
          domain_type: domain.domain_type,
          is_active: domain.is_active,
          revenue_target: getRevenueTarget(domain.domain_name),
          traffic_goal: getTrafficGoal(domain.domain_name),
          subscriber_goal: getSubscriberGoal(domain.domain_name),
          current_metrics: {
            traffic,
            revenue,
            subscribers,
            growth_rate: growthRate
          }
        }
      })
    )

    return NextResponse.json({ domains: domainsWithMetrics })
  } catch (error) {
    console.error('Error fetching domains:', error)
    return NextResponse.json({ error: 'Failed to fetch domains' }, { status: 500 })
  }
}

// Helper functions to get targets (based on your strategy document)
function getRevenueTarget(domainName: string): number {
  const targets: Record<string, number> = {
    'adaptogenic-mushrooms.com': 8000,
    'fixie.run': 2000,
    'rhymechain.win': 5000,
    'seobiz.be': 7500,
    'affinitylove.eu': 20000,
    'healthfulmushrooms.com': 50000,
    'brainhealthmushrooms.com': 40000,
    'tech-review-blog.com': 1800,
    'puffs-store.com': 50000,
    'antonylambi.be': 8000,
    'aiftw.be': 30000
  }
  return targets[domainName] || 5000
}

function getTrafficGoal(domainName: string): number {
  const targets: Record<string, number> = {
    'adaptogenic-mushrooms.com': 8000,
    'fixie.run': 10000,
    'rhymechain.win': 500,
    'seobiz.be': 2000,
    'affinitylove.eu': 2000,
    'healthfulmushrooms.com': 8000,
    'brainhealthmushrooms.com': 6000,
    'tech-review-blog.com': 12000,
    'puffs-store.com': 10000,
    'antonylambi.be': 2000,
    'aiftw.be': 1000
  }
  return targets[domainName] || 1000
}

function getSubscriberGoal(domainName: string): number {
  const targets: Record<string, number> = {
    'adaptogenic-mushrooms.com': 5000,
    'fixie.run': 1000,
    'rhymechain.win': 10000,
    'seobiz.be': 150,
    'affinitylove.eu': 5000,
    'healthfulmushrooms.com': 15000,
    'brainhealthmushrooms.com': 8000,
    'tech-review-blog.com': 1200,
    'puffs-store.com': 10000,
    'antonylambi.be': 2000,
    'aiftw.be': 1000
  }
  return targets[domainName] || 1000
}
