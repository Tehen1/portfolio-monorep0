'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@portfolio/ui'
import { Button } from '@portfolio/ui'
import { Badge } from '@portfolio/ui'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@portfolio/ui'
import { Brain, TrendingUp, Globe, BarChart3, Zap, AlertTriangle } from 'lucide-react'

interface Domain {
  domain_name: string
  domain_type: string
  is_active: boolean
  revenue_target: number
  traffic_goal: number
  subscriber_goal: number
  current_metrics: {
    traffic: number
    revenue: number
    subscribers: number
    growth_rate: number
  }
}

interface AIMetrics {
  score: number
  recommendations: string[]
  opportunities: string[]
  risks: string[]
}

export default function DomainManager() {
  const [domains, setDomains] = useState<Domain[]>([])
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null)
  const [aiAnalysis, setAiAnalysis] = useState<AIMetrics | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadDomains()
  }, [])

  const loadDomains = async () => {
    try {
      const response = await fetch('/api/domains')
      const data = await response.json()
      setDomains(data.domains)
    } catch (error) {
      console.error('Error loading domains:', error)
    }
  }

  const analyzeDomainWithAI = async (domain: Domain) => {
    setLoading(true)
    try {
      const response = await fetch('/api/ai/domain-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain })
      })
      const analysis = await response.json()
      setAiAnalysis(analysis)
      setSelectedDomain(domain)
    } catch (error) {
      console.error('Error analyzing domain:', error)
    } finally {
      setLoading(false)
    }
  }

  const getDomainTypeColor = (type: string) => {
    const colors = {
      fitness: 'bg-green-100 text-green-800',
      ecommerce: 'bg-blue-100 text-blue-800',
      web3: 'bg-purple-100 text-purple-800',
      saas: 'bg-orange-100 text-orange-800',
      dating: 'bg-pink-100 text-pink-800',
      content: 'bg-indigo-100 text-indigo-800',
      blog: 'bg-gray-100 text-gray-800',
      portfolio: 'bg-teal-100 text-teal-800',
      ai: 'bg-cyan-100 text-cyan-800'
    }
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getAIScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Globe className="h-8 w-8 text-blue-600" />
            AI Domain Manager
          </h1>
          <p className="text-gray-600 mt-2">
            Gestion intelligente de vos 11 domaines avec analyse IA avancée
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Domain List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Vos Domaines (11)
                </CardTitle>
                <CardDescription>
                  Sélectionnez un domaine pour analyse IA
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {domains.map((domain) => (
                  <div
                    key={domain.domain_name}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedDomain?.domain_name === domain.domain_name
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedDomain(domain)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-sm">{domain.domain_name}</h3>
                      <Badge className={getDomainTypeColor(domain.domain_type)}>
                        {domain.domain_type}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-600 space-y-1">
                      <div>🎯 Traffic: {domain.current_metrics.traffic.toLocaleString()}/{domain.traffic_goal.toLocaleString()}</div>
                      <div>💰 Revenue: €{domain.current_metrics.revenue.toLocaleString()}/{domain.revenue_target.toLocaleString()}</div>
                      <div>📈 Growth: {domain.current_metrics.growth_rate}%</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* AI Analysis Panel */}
          <div className="lg:col-span-2">
            {selectedDomain ? (
              <Tabs defaultValue="analysis" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="analysis">Analyse IA</TabsTrigger>
                  <TabsTrigger value="metrics">Métriques</TabsTrigger>
                  <TabsTrigger value="optimization">Optimisation</TabsTrigger>
                </TabsList>

                <TabsContent value="analysis" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Brain className="h-5 w-5 text-purple-600" />
                        Analyse IA: {selectedDomain.domain_name}
                      </CardTitle>
                      <CardDescription>
                        Insights intelligents basés sur vos données de performance
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button
                        onClick={() => analyzeDomainWithAI(selectedDomain)}
                        disabled={loading}
                        className="w-full mb-6"
                      >
                        {loading ? (
                          <>
                            <Zap className="h-4 w-4 mr-2 animate-spin" />
                            Analyse en cours...
                          </>
                        ) : (
                          <>
                            <Brain className="h-4 w-4 mr-2" />
                            Lancer l'analyse IA
                          </>
                        )}
                      </Button>

                      {aiAnalysis && (
                        <div className="space-y-6">
                          {/* AI Score */}
                          <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                            <div className={`text-4xl font-bold ${getAIScoreColor(aiAnalysis.score)}`}>
                              {aiAnalysis.score}/100
                            </div>
                            <p className="text-gray-600 mt-2">Score de Performance IA</p>
                          </div>

                          {/* Recommendations */}
                          <div>
                            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                              <TrendingUp className="h-5 w-5 text-green-600" />
                              Recommandations IA
                            </h3>
                            <ul className="space-y-2">
                              {aiAnalysis.recommendations.map((rec, index) => (
                                <li key={index} className="flex items-start gap-2 p-3 bg-green-50 rounded-lg">
                                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                                  <span className="text-sm">{rec}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Opportunities */}
                          <div>
                            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                              <Zap className="h-5 w-5 text-blue-600" />
                              Opportunités
                            </h3>
                            <ul className="space-y-2">
                              {aiAnalysis.opportunities.map((opp, index) => (
                                <li key={index} className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                  <span className="text-sm">{opp}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Risks */}
                          <div>
                            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                              <AlertTriangle className="h-5 w-5 text-red-600" />
                              Risques Identifiés
                            </h3>
                            <ul className="space-y-2">
                              {aiAnalysis.risks.map((risk, index) => (
                                <li key={index} className="flex items-start gap-2 p-3 bg-red-50 rounded-lg">
                                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                                  <span className="text-sm">{risk}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="metrics">
                  <Card>
                    <CardHeader>
                      <CardTitle>Métriques Détaillées</CardTitle>
                      <CardDescription>
                        Performance en temps réel pour {selectedDomain.domain_name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">
                            {selectedDomain.current_metrics.traffic.toLocaleString()}
                          </div>
                          <p className="text-sm text-gray-600">Visiteurs/Mois</p>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">
                            €{selectedDomain.current_metrics.revenue.toLocaleString()}
                          </div>
                          <p className="text-sm text-gray-600">Revenus/Mois</p>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">
                            {selectedDomain.current_metrics.subscribers.toLocaleString()}
                          </div>
                          <p className="text-sm text-gray-600">Subscribers</p>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className={`text-2xl font-bold ${
                            selectedDomain.current_metrics.growth_rate > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {selectedDomain.current_metrics.growth_rate > 0 ? '+' : ''}
                            {selectedDomain.current_metrics.growth_rate}%
                          </div>
                          <p className="text-sm text-gray-600">Croissance</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="optimization">
                  <Card>
                    <CardHeader>
                      <CardTitle>Actions d'Optimisation</CardTitle>
                      <CardDescription>
                        Suggestions concrètes pour améliorer {selectedDomain.domain_name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Button className="w-full">
                        🚀 Générer Contenu SEO Automatique
                      </Button>
                      <Button variant="outline" className="w-full">
                        📊 Optimiser Campagne Publicitaire
                      </Button>
                      <Button variant="outline" className="w-full">
                        💰 Analyser Opportunités Monétisation
                      </Button>
                      <Button variant="outline" className="w-full">
                        🎯 Personnaliser Expérience Utilisateur
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            ) : (
              <Card className="h-96 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <Globe className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">Sélectionnez un domaine</h3>
                  <p>Cliquez sur un domaine dans la liste pour voir l'analyse IA</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
