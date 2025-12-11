const fs = require('fs-extra');
const path = require('path');
const PplxApiService = require('./pplx-api');
const { DOMAINS_CONFIG } = require('../config/api-keys');

class ReportGenerator {
  constructor() {
    this.apiService = new PplxApiService();
    this.reportsDir = path.join(__dirname, '../reports');
    this.templatesDir = path.join(__dirname, '../templates');
    this.dataDir = path.join(__dirname, '../data');

    // Créer les dossiers s'ils n'existent pas
    fs.ensureDirSync(this.reportsDir);
    fs.ensureDirSync(this.templatesDir);
    fs.ensureDirSync(this.dataDir);
  }

  /**
   * Génère un rapport complet pour un domaine
   */
  async generateDomainReport(domain) {
    console.log(`🚀 Début de la génération du rapport pour ${domain}`);

    try {
      // Vérifier que le domaine est configuré
      if (!DOMAINS_CONFIG[domain]) {
        throw new Error(`Domaine ${domain} non configuré`);
      }

      // Générer le rapport via l'API
      const reportData = await this.apiService.generateCompleteReport(domain);

      // Sauvegarder le rapport JSON brut
      await this.saveRawReport(domain, reportData);

      // Générer le rapport formaté
      const formattedReport = await this.formatReport(reportData);

      // Sauvegarder le rapport formaté
      await this.saveFormattedReport(domain, formattedReport);

      // Mettre à jour l'index des rapports
      await this.updateReportsIndex(domain, reportData);

      console.log(`✅ Rapport généré avec succès pour ${domain}`);
      return reportData;

    } catch (error) {
      console.error(`❌ Erreur lors de la génération du rapport pour ${domain}:`, error.message);
      throw error;
    }
  }

  /**
   * Génère des rapports pour tous les domaines
   */
  async generateAllReports() {
    const domains = Object.keys(DOMAINS_CONFIG);
    const results = [];

    console.log(`📊 Génération de rapports pour ${domains.length} domaines...`);

    for (const domain of domains) {
      try {
        const report = await this.generateDomainReport(domain);
        results.push({ domain, success: true, report });
      } catch (error) {
        console.error(`❌ Échec pour ${domain}:`, error.message);
        results.push({ domain, success: false, error: error.message });
      }

      // Pause entre les requêtes pour éviter la limite de taux
      await this.sleep(2000);
    }

    return results;
  }

  /**
   * Formate le rapport pour une présentation lisible
   */
  async formatReport(reportData) {
    const template = await this.getReportTemplate();

    return template
      .replace(/{{domain}}/g, reportData.domain)
      .replace(/{{niche}}/g, reportData.niche)
      .replace(/{{category}}/g, reportData.category)
      .replace(/{{strategies}}/g, reportData.strategies.join(', '))
      .replace(/{{generated_at}}/g, new Date(reportData.generated_at).toLocaleString('fr-FR'))
      .replace(/{{seo_content}}/g, this.formatSection(reportData.seo))
      .replace(/{{blockchain_content}}/g, this.formatSection(reportData.blockchain))
      .replace(/{{ai_content}}/g, this.formatSection(reportData.ai))
      .replace(/{{citations}}/g, this.formatCitations(reportData))
      .replace(/{{api_usage}}/g, this.formatApiUsage(reportData.api_usage));
  }

  /**
   * Formate une section du rapport
   */
  formatSection(section) {
    if (!section || !section.content) {
      return 'Contenu non disponible';
    }

    let formatted = section.content;

    // Ajouter les citations si disponibles
    if (section.citations && section.citations.length > 0) {
      formatted += '\n\n### Sources:\n';
      section.citations.forEach((citation, index) => {
        formatted += `${index + 1}. ${citation}\n`;
      });
    }

    // Ajouter les questions liées si disponibles
    if (section.related_questions && section.related_questions.length > 0) {
      formatted += '\n\n### Questions liées:\n';
      section.related_questions.forEach((question, index) => {
        formatted += `${index + 1}. ${question}\n`;
      });
    }

    return formatted;
  }

  /**
   * Formate les citations du rapport
   */
  formatCitations(reportData) {
    const allCitations = [
      ...(reportData.seo.citations || []),
      ...(reportData.blockchain.citations || []),
      ...(reportData.ai.citations || [])
    ];

    if (allCitations.length === 0) {
      return 'Aucune citation disponible';
    }

    return allCitations.map((citation, index) =>
      `${index + 1}. ${citation}`
    ).join('\n');
  }

  /**
   * Formate l'utilisation de l'API
   */
  formatApiUsage(usage) {
    const totalTokens = usage.seo_tokens + usage.blockchain_tokens + usage.ai_tokens;
    return `
- SEO: ${usage.seo_tokens.toLocaleString()} tokens
- Blockchain: ${usage.blockchain_tokens.toLocaleString()} tokens
- IA: ${usage.ai_tokens.toLocaleString()} tokens
- **Total: ${totalTokens.toLocaleString()} tokens**
    `;
  }

  /**
   * Sauvegarde le rapport JSON brut
   */
  async saveRawReport(domain, reportData) {
    const filename = `${domain.replace(/\./g, '-')}-${Date.now()}.json`;
    const filepath = path.join(this.reportsDir, 'raw', filename);

    await fs.ensureDir(path.dirname(filepath));
    await fs.writeJson(filepath, reportData, { spaces: 2 });
  }

  /**
   * Sauvegarde le rapport formaté
   */
  async saveFormattedReport(domain, formattedReport) {
    const filename = `${domain.replace(/\./g, '-')}-report.md`;
    const filepath = path.join(this.reportsDir, filename);

    await fs.writeFile(filepath, formattedReport, 'utf8');
  }

  /**
   * Met à jour l'index des rapports
   */
  async updateReportsIndex(domain, reportData) {
    const indexPath = path.join(this.reportsDir, 'index.json');

    let index = {};
    if (await fs.pathExists(indexPath)) {
      index = await fs.readJson(indexPath);
    }

    index[domain] = {
      lastGenerated: reportData.generated_at,
      niche: reportData.niche,
      category: reportData.category,
      strategies: reportData.strategies,
      apiUsage: reportData.api_usage
    };

    await fs.writeJson(indexPath, index, { spaces: 2 });
  }

  /**
   * Récupère le template de rapport
   */
  async getReportTemplate() {
    const templatePath = path.join(this.templatesDir, 'report-template.md');

    if (await fs.pathExists(templatePath)) {
      return await fs.readFile(templatePath, 'utf8');
    }

    // Template par défaut
    return this.getDefaultTemplate();
  }

  /**
   * Template par défaut pour les rapports
   */
  getDefaultTemplate() {
    return `# Rapport SEO, Blockchain & IA - {{domain}}

**Domaine:** {{domain}}
**Niche:** {{niche}}
**Catégorie:** {{category}}
**Stratégies:** {{strategies}}
**Généré le:** {{generated_at}}

---

## 📈 Analyse SEO

{{seo_content}}

---

## ⛓️ Stratégies Blockchain

{{blockchain_content}}

---

## 🤖 Applications IA

{{ai_content}}

---

## 📚 Sources et Références

{{citations}}

---

## 📊 Utilisation API

{{api_usage}}

---

*Rapport généré automatiquement par le système SEO-Blockchain-IA Reports*
*Généré le: {{generated_at}}*
`;
  }

  /**
   * Génère un résumé de tous les rapports
   */
  async generateSummaryReport() {
    const indexPath = path.join(this.reportsDir, 'index.json');

    if (!await fs.pathExists(indexPath)) {
      throw new Error('Aucun rapport généré pour créer un résumé');
    }

    const index = await fs.readJson(indexPath);
    const domains = Object.keys(index);

    let summary = `# Résumé des Rapports - ${domains.length} Domaines Analysés\n\n`;
    summary += `**Généré le:** ${new Date().toLocaleString('fr-FR')}\n\n`;

    for (const domain of domains) {
      const data = index[domain];
      summary += `## ${domain}\n`;
      summary += `- **Niche:** ${data.niche}\n`;
      summary += `- **Catégorie:** ${data.category}\n`;
      summary += `- **Stratégies:** ${data.strategies.join(', ')}\n`;
      summary += `- **Dernière génération:** ${new Date(data.lastGenerated).toLocaleString('fr-FR')}\n`;
      summary += `- **Tokens utilisés:** ${data.apiUsage ? Object.values(data.apiUsage).reduce((a, b) => a + b, 0).toLocaleString() : 'N/A'}\n\n`;
    }

    const summaryPath = path.join(this.reportsDir, 'summary.md');
    await fs.writeFile(summaryPath, summary, 'utf8');

    return summary;
  }

  /**
   * Utilitaire pour les pauses
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Liste tous les rapports disponibles
   */
  async listReports() {
    const indexPath = path.join(this.reportsDir, 'index.json');

    if (!await fs.pathExists(indexPath)) {
      return {};
    }

    return await fs.readJson(indexPath);
  }

  /**
   * Nettoie les anciens rapports
   */
  async cleanupOldReports(daysToKeep = 30) {
    const indexPath = path.join(this.reportsDir, 'index.json');

    if (!await fs.pathExists(indexPath)) {
      return { deleted: 0, errors: 0 };
    }

    const index = await fs.readJson(indexPath);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    let deleted = 0;
    let errors = 0;

    for (const domain of Object.keys(index)) {
      try {
        const reportDate = new Date(index[domain].lastGenerated);

        if (reportDate < cutoffDate) {
          // Supprimer le rapport formaté
          const formattedPath = path.join(this.reportsDir, `${domain.replace(/\./g, '-')}-report.md`);
          if (await fs.pathExists(formattedPath)) {
            await fs.remove(formattedPath);
          }

          // Supprimer les rapports JSON bruts
          const rawDir = path.join(this.reportsDir, 'raw');
          if (await fs.pathExists(rawDir)) {
            const files = await fs.readdir(rawDir);
            for (const file of files) {
              if (file.startsWith(domain.replace(/\./g, '-'))) {
                await fs.remove(path.join(rawDir, file));
              }
            }
          }

          // Supprimer de l'index
          delete index[domain];
          deleted++;
        }
      } catch (error) {
        console.error(`Erreur lors du nettoyage de ${domain}:`, error.message);
        errors++;
      }
    }

    // Sauvegarder l'index mis à jour
    await fs.writeJson(indexPath, index, { spaces: 2 });

    return { deleted, errors };
  }
}

module.exports = ReportGenerator;
