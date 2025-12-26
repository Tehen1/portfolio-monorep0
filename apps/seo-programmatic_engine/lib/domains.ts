export interface DomainConfig {
  key: string;
  name: string;
  description: string;
  priority: number;
  year1_revenue: number;
  categories: string[];
  theme: {
    primary: string;
  };
}

export const DOMAINS: Record<string, DomainConfig> = {
  'fixie-run': {
    key: 'fixie-run',
    name: 'Fixie Run',
    description: 'Application de course connectée avec récompenses blockchain',
    priority: 1,
    year1_revenue: 1200000,
    categories: ['Fitness', 'Web3', 'Mobile', 'Blockchain'],
    theme: { primary: '#00f3ff' }
  },
  'seo-programmatic-engine': {
    key: 'seo-programmatic-engine',
    name: 'SEO Programmatic Engine',
    description: 'Moteur SEO automatisé pour optimisation de contenu',
    priority: 2,
    year1_revenue: 800000,
    categories: ['SEO', 'AI', 'Content', 'Automation'],
    theme: { primary: '#ff6b35' }
  },
  'fixie-dashboard': {
    key: 'fixie-dashboard',
    name: 'Fixie Dashboard',
    description: 'Tableau de bord analytics pour métriques blockchain',
    priority: 3,
    year1_revenue: 600000,
    categories: ['Analytics', 'Dashboard', 'Blockchain', 'Web3'],
    theme: { primary: '#4ecdc4' }
  },
  'seo-blockchain-ai-reports': {
    key: 'seo-blockchain-ai-reports',
    name: 'SEO Blockchain AI Reports',
    description: 'Rapports IA pour analyse SEO blockchain',
    priority: 4,
    year1_revenue: 400000,
    categories: ['AI', 'Reports', 'Blockchain', 'SEO'],
    theme: { primary: '#45b7d1' }
  },
  'seo-sea-vision-pro': {
    key: 'seo-sea-vision-pro',
    name: 'SEO Sea Vision Pro',
    description: 'Vision Pro pour analyse SEO maritime',
    priority: 5,
    year1_revenue: 300000,
    categories: ['Vision Pro', 'SEO', 'Maritime', 'AR'],
    theme: { primary: '#96ceb4' }
  },
  'seobiz': {
    key: 'seobiz',
    name: 'SEO Biz SaaS',
    description: 'Plateforme SaaS pour gestion SEO entreprise',
    priority: 6,
    year1_revenue: 250000,
    categories: ['SaaS', 'SEO', 'Business', 'Enterprise'],
    theme: { primary: '#feca57' }
  },
  'fixie-run-mobile': {
    key: 'fixie-run-mobile',
    name: 'Fixie Run Mobile',
    description: 'Application mobile native pour course connectée',
    priority: 7,
    year1_revenue: 200000,
    categories: ['Mobile', 'Fitness', 'Native', 'iOS/Android'],
    theme: { primary: '#ff9ff3' }
  },
  'fixie-pwa': {
    key: 'fixie-pwa',
    name: 'Fixie PWA',
    description: 'Progressive Web App pour expérience cross-platform',
    priority: 8,
    year1_revenue: 150000,
    categories: ['PWA', 'Cross-platform', 'Web', 'Mobile'],
    theme: { primary: '#54a0ff' }
  },
  'fixierun': {
    key: 'fixierun',
    name: 'Fixie Run Dashboard',
    description: 'Dashboard utilisateur pour suivi des courses',
    priority: 9,
    year1_revenue: 100000,
    categories: ['Dashboard', 'User', 'Tracking', 'Fitness'],
    theme: { primary: '#5f27cd' }
  },
  'my-portfolio': {
    key: 'my-portfolio',
    name: 'Portfolio Personnel',
    description: 'Portfolio développeur avec showcase de projets',
    priority: 10,
    year1_revenue: 50000,
    categories: ['Portfolio', 'Personal', 'Showcase', 'Web'],
    theme: { primary: '#00d2d3' }
  },
  'ai-agents': {
    key: 'ai-agents',
    name: 'AI Agents Package',
    description: 'Package partagé pour agents IA stratégiques',
    priority: 11,
    year1_revenue: 25000,
    categories: ['AI', 'Agents', 'Package', 'Shared'],
    theme: { primary: '#ff9f43' }
  }
};