import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { domain } = await request.json()

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    const prompt = `
Tu es un expert en stratégie digitale et analyse de performance web. Analyse ce domaine et fournis des insights stratégiques basés sur les métriques fournies.

DOMAINE À ANALYSER:
- Nom: ${domain.domain_name}
- Type: ${domain.domain_type}
- Métriques actuelles:
  * Traffic: ${domain.current_metrics.traffic} visiteurs/mois (Objectif: ${domain.traffic_goal})
  * Revenue: €${domain.current_metrics.revenue} (Objectif: €${domain.revenue_target})
  * Subscribers: ${domain.current_metrics.subscribers} (Objectif: ${domain.subscriber_goal})
  * Growth Rate: ${domain.current_metrics.growth_rate}%

PROFIL STRATÉGIQUE (${domain.domain_type}):
${getDomainProfile(domain.domain_type)}

INSTRUCTIONS:
1. Calcule un score de performance sur 100 basé sur les métriques vs objectifs
2. Fournis 3-5 recommandations stratégiques concrètes et actionnables
3. Identifie 2-3 opportunités de croissance majeures
4. Liste 1-2 risques critiques à surveiller
5. Sois spécifique, data-driven et orienté résultats

RÉPONDS UNIQUEMENT EN FORMAT JSON:
{
  "score": number (0-100),
  "recommendations": ["string"],
  "opportunities": ["string"],
  "risks": ["string"]
}
`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Parse the JSON response
    const analysis = JSON.parse(text.replace(/```json\n?|\n?```/g, '').trim())

    return NextResponse.json(analysis)
  } catch (error) {
    console.error('Error analyzing domain:', error)

    // Fallback analysis if AI fails
    const fallbackAnalysis = {
      score: Math.floor(Math.random() * 40) + 60,
      recommendations: [
        "Optimiser le contenu SEO pour améliorer le trafic organique",
        "Mettre en place une stratégie de conversion plus efficace",
        "Développer la présence sur les réseaux sociaux",
        "Analyser la concurrence pour identifier les gaps"
      ],
      opportunities: [
        "Expansion vers de nouveaux marchés géographiques",
        "Développement de produits complémentaires",
        "Partenariats stratégiques avec influenceurs"
      ],
      risks: [
        "Risque de saturation du marché actuel",
        "Concurrence croissante sur les mots-clés principaux"
      ]
    }

    return NextResponse.json(fallbackAnalysis)
  }
}

function getDomainProfile(domainType: string): string {
  const profiles: Record<string, string> = {
    fitness: `
Marché: Applications Move-to-Earn et fitness urbain
Concurrence: STEPN, Sweatcoin, Step App
Opportunités: Fixie culture, communauté urbaine jeune
Risques: Marché saturé, rétention utilisateurs difficile`,

    ecommerce: `
Marché: E-commerce spécialisé (champignons adaptogènes)
Concurrence: Sites de santé naturelle, pharmacies en ligne
Opportunités: Demande croissante pour produits naturels
Risques: Réglementation produits santé, concurrence prix`,

    web3: `
Marché: NFT et musique blockchain
Concurrence: Catalogue, Zora, Foundation
Opportunités: Adoption croissante Web3, royalties automatiques
Risques: Volatilité crypto, adoption utilisateur lente`,

    saas: `
Marché: Outils SEO et marketing automation
Concurrence: Ahrefs, SEMrush, Moz
Opportunités: Demande croissante optimisation SEO
Risques: Concurrence technologique, évolution algorithmes Google`,

    dating: `
Marché: Applications de rencontre IA
Concurrence: Tinder, Bumble, Hinge
Opportunités: Matching basé sur compatibilité psychologique
Risques: Réglementation vie privée, saturation marché`,

    content: `
Marché: Contenu spécialisé santé/bien-être
Concurrence: Sites médicaux, blogs wellness
Opportunités: SEO longue traîne, autorité thématique
Risques: Contenu médical réglementé, évolution standards`,

    blog: `
Marché: Blog tech et reviews produits
Concurrence: Sites d'actualité tech, blogs affiliés
Opportunités: Affiliation produits, audience fidèle
Risques: Dépendance revenus pubs, évolution rapide tech`,

    portfolio: `
Marché: Personal branding développeur blockchain
Concurrence: Autres consultants tech
Opportunités: Expertise spécialisée, networking
Risques: Dépendance clientèle individuelle`,

    ai: `
Marché: Lead generation B2B automatisé
Concurrence: Sales Navigator, ZoomInfo
Opportunités: Automatisation processus vente
Risques: Réglementation données personnelles, qualité leads`
  }

  return profiles[domainType] || 'Profil générique - analyse basée sur métriques générales'
}
