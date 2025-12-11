const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Configuration sécurisée pour les clés API
const CONFIG = {
  PPLX_BASE_URL: process.env.PPLX_BASE_URL || 'https://api.perplexity.ai',
  SECRETS_FILE_PATH: process.env.PPLX_SECRETS_FILE || path.join(__dirname, '..', 'config', 'api-keys.secure.json'),
  CACHE_KEYS: process.env.PPLX_CACHE_KEYS !== 'false' // Cache activé par défaut
};

class PplxApiService {
  constructor() {
    this.baseURL = CONFIG.PPLX_BASE_URL;
    this.keysCache = new Map(); // Cache sécurisé pour les clés
    this.loadSecretsConfig();
  }

  /**
   * Charge la configuration des secrets de manière sécurisée
   * @private
   */
  loadSecretsConfig() {
    try {
      // Vérifier les permissions du fichier secrets
      if (fs.existsSync(CONFIG.SECRETS_FILE_PATH)) {
        const stats = fs.statSync(CONFIG.SECRETS_FILE_PATH);
        // Vérifier que le fichier n'est accessible qu'au propriétaire
        const perms = (stats.mode & parseInt('777', 8)).toString(8);
        if (perms !== '600') {
          console.warn(`⚠️ Permissions du fichier secrets incorrectes: ${perms}. Utilisez chmod 600.`);
        }
      } else {
        console.info('ℹ️ Fichier secrets non trouvé. Utilisation des variables d\'environnement uniquement.');
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la config secrets:', error instanceof Error ? error.message : 'Erreur inconnue');
    }
  }

  /**
   * Récupère la clé API pour un domaine de manière sécurisée
   * @param {string} domain - Le nom de domaine
   * @returns {string} La clé API
   * @private
   */
  getApiKey(domain) {
    // Validation d'entrée
    if (!domain || typeof domain !== 'string') {
      throw new Error('Domaine invalide fourni');
    }

    // Normaliser le domaine pour la variable d'environnement
    const envKey = `PPLX_API_KEY_${domain.toUpperCase().replace(/[^a-zA-Z0-9]/g, '_')}`;

    // 1. Vérifier le cache sécurisé
    if (CONFIG.CACHE_KEYS && this.keysCache.has(domain)) {
      return this.keysCache.get(domain);
    }

    // 2. Essayer variable d'environnement (priorité haute sécurité)
    if (process.env[envKey]) {
      const key = process.env[envKey];
      this.keysCache.set(domain, key); // Cache si activé
      return key;
    }

    // 3. Fallback vers fichier sécurisé (si configuré)
    try {
      if (fs.existsSync(CONFIG.SECRETS_FILE_PATH)) {
        const secrets = JSON.parse(fs.readFileSync(CONFIG.SECRETS_FILE_PATH, 'utf8'));
        if (secrets.PPLX_API_KEYS && secrets.PPLX_API_KEYS[domain]) {
          const key = secrets.PPLX_API_KEYS[domain];
          this.keysCache.set(domain, key); // Cache si activé
          return key;
        }
      }
    } catch (error) {
      console.error(`Erreur lors de la lecture du fichier secrets pour ${domain}:`, error.message);
    }

    // 4. Erreur critique si clé non trouvée
    throw new Error(`Clé API non trouvée pour le domaine: ${domain}. Configurez ${envKey} ou un fichier sécurisé.`);
  }

  /**
   * Recherche du contenu adapté pour un nom de domaine
   * @param {string} domain - Le nom de domaine
   * @param {string} query - La requête de recherche
   * @param {Object} options - Options supplémentaires
   */
  async searchContent(domain, query, options = {}) {
    const apiKey = this.getApiKey(domain);

    try {
      const response = await axios.post(`${this.baseURL}/chat/completions`, {
        model: "sonar",
        messages: [
          {
            role: "system",
            content: `Tu es un expert SEO, blockchain et IA. Tu dois fournir une analyse complète et structurée pour le domaine ${domain}. 
                     Réponds en français avec des conseils professionnels et des stratégies concrètes.`
          },
          {
            role: "user",
            content: query
          }
        ],
        max_tokens: 4000,
        temperature: 0.7,
        top_p: 0.9,
        search_domain_filter: [domain],
        return_images: false,
        return_related_questions: true,
        search_recency_filter: "month",
        top_k: 0,
        stream: false,
        presence_penalty: 0,
        frequency_penalty: 1,
        response_format: null
      }, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data;
    } catch (error) {
      console.error(`Erreur API pour ${domain}:`, error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Génère un rapport SEO complet pour un domaine
   */
  async generateSEOReport(domain, config) {
    const query = `
Analyse SEO complète pour ${domain} dans la niche "${config.niche}".
Fournis:
1. Analyse de marché et opportunités 2025
2. Stratégie SEO avec mots-clés prioritaires (volume élevé + longue traîne)
3. Optimisation on-page (titres H1, meta descriptions, URLs, schema markup)
4. Stratégie de contenu (articles, blog posts, structure pilier/cluster)
5. Backlinks et autorité de domaine
6. SEO technique (Core Web Vitals, mobile-first, HTTPS)
7. KPI et objectifs mesurables

Mots-clés cibles: ${config.targetKeywords.join(', ')}
    `;

    return await this.searchContent(domain, query);
  }

  /**
   * Génère un rapport blockchain pour un domaine
   */
  async generateBlockchainReport(domain, config) {
    const query = `
Stratégies blockchain adaptées pour ${domain} dans la niche "${config.niche}".
Fournis:
1. Cas d'usage blockchain spécifiques à la niche
2. Architecture technique recommandée (Ethereum, Polygon, Solana, etc.)
3. Smart contracts et fonctionnalités
4. Intégration NFT si applicable
5. Tokenisation et modèles économiques
6. Sécurité et conformité (GDPR, KYC)
7. Roadmap d'implémentation technique
8. Exemples de projets similaires réussis

Stratégies: ${config.strategies.join(', ')}
    `;

    return await this.searchContent(domain, query);
  }

  /**
   * Génère un rapport IA pour un domaine
   */
  async generateAIReport(domain, config) {
    const query = `
Stratégies IA avancées pour ${domain} dans la niche "${config.niche}".
Fournis:
1. Applications IA spécifiques à la niche
2. Modèles et algorithmes recommandés
3. Automatisation des processus métier
4. Personnalisation et recommandations
5. Analyse prédictive et insights
6. Chatbots et assistants IA
7. Machine Learning pour l'optimisation
8. Intégration API et outils IA
9. Considérations éthiques et privacy
10. ROI et métriques de succès

Stratégies: ${config.strategies.join(', ')}
    `;

    return await this.searchContent(domain, query);
  }

  /**
   * Génère un rapport complet combinant SEO, Blockchain et IA
   */
  async generateCompleteReport(domain) {
    const config = require('../config/api-keys').DOMAINS_CONFIG[domain];
    if (!config) {
      throw new Error(`Configuration non trouvée pour le domaine: ${domain}`);
    }

    console.log(`🔍 Génération du rapport complet pour ${domain}...`);

    try {
      // Génération des rapports en parallèle
      const [seoResponse, blockchainResponse, aiResponse] = await Promise.all([
        this.generateSEOReport(domain, config),
        this.generateBlockchainReport(domain, config),
        this.generateAIReport(domain, config)
      ]);

      return {
        domain,
        niche: config.niche,
        category: config.category,
        strategies: config.strategies,
        seo: {
          content: seoResponse.choices[0]?.message?.content || 'Non disponible',
          citations: seoResponse.citations || [],
          related_questions: seoResponse.related_questions || []
        },
        blockchain: {
          content: blockchainResponse.choices[0]?.message?.content || 'Non disponible',
          citations: blockchainResponse.citations || [],
          related_questions: blockchainResponse.related_questions || []
        },
        ai: {
          content: aiResponse.choices[0]?.message?.content || 'Non disponible',
          citations: aiResponse.citations || [],
          related_questions: aiResponse.related_questions || []
        },
        generated_at: new Date().toISOString(),
        api_usage: {
          seo_tokens: seoResponse.usage?.total_tokens || 0,
          blockchain_tokens: blockchainResponse.usage?.total_tokens || 0,
          ai_tokens: aiResponse.usage?.total_tokens || 0
        }
      };
    } catch (error) {
      console.error(`Erreur lors de la génération du rapport pour ${domain}:`, error.message);
      throw error;
    }
  }

  /**
   * Test de connectivité API
   */
  async testConnection(domain) {
    try {
      const response = await this.searchContent(domain, 'Test de connexion API');
      return { success: true, message: 'Connexion API réussie' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

module.exports = PplxApiService;
