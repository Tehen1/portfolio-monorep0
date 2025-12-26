# GUIDE DE DÉPLOIEMENT VERCEL - PORTFOLIO MONOREPO
**Déploiement Production-Ready en 10 Minutes**

---

## ✅ PRÉREQUIS

Avant de commencer, assurez-vous d'avoir :
- [ ] Compte Vercel (gratuit sur vercel.com)
- [ ] Repository GitHub/GitLab avec votre code
- [ ] Variables d'environnement prêtes (voir `.env.production`)

---

## 📋 ÉTAPE 1 : PRÉPARATION DU REPOSITORY

### 1.1 Vérifier que le build fonctionne localement
```bash
cd /Users/devtehen/Desktop/Dev/portfolio-monorep0
pnpm build
```

✅ **Résultat attendu** : `my-portfolio:build: ✓ Compiled successfully`

### 1.2 Commit et Push vers GitHub
```bash
git add .
git commit -m "feat: Production-ready monorepo with DeFi agents"
git push origin main
```

---

## 📋 ÉTAPE 2 : CONFIGURATION VERCEL

### 2.1 Importer le Projet
1. Allez sur [vercel.com/new](https://vercel.com/new)
2. Sélectionnez votre repository `portfolio-monorep0`
3. Vercel détectera automatiquement **Turborepo**

### 2.2 Configuration du Build
**Framework Preset** : Next.js  
**Root Directory** : `./` (laisser la racine)  
**Build Command** : `npx turbo run build --filter=my-portfolio`  
**Output Directory** : `apps/portfolio/.next`  
**Install Command** : `pnpm install`

> ⚠️ **Important** : Le fichier `vercel.json` à la racine automatise déjà ces commandes.

### 2.3 Variables d'Environnement
Ajoutez ces variables dans **Settings → Environment Variables** :

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Blockchain
NEXT_PUBLIC_ETHEREUM_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY
NEXT_PUBLIC_POLYGON_RPC_URL=https://polygon-mainnet.g.alchemy.com/v2/YOUR_KEY

# AI
OPENAI_API_KEY=sk-your-key

# Monitoring
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
```

---

## 📋 ÉTAPE 3 : DÉPLOIEMENT

### 3.1 Premier Déploiement
Cliquez sur **Deploy** dans Vercel.

**Durée estimée** : 3-5 minutes

### 3.2 Vérification
Une fois déployé, Vercel vous donnera une URL :
```
https://portfolio-monorep0-xxx.vercel.app
```

Testez les pages principales :
- `/` (Homepage)
- `/about`
- `/services/smart-contracts-solidity-liege`
- `/blog`

---

## 📋 ÉTAPE 4 : DOMAINE PERSONNALISÉ

### 4.1 Ajouter votre Domaine
1. Dans Vercel, allez dans **Settings → Domains**
2. Ajoutez `antonylambi.be` (ou votre domaine)
3. Vercel vous donnera des enregistrements DNS à configurer

### 4.2 Configuration DNS
Chez votre registrar (Cloudflare, OVH, etc.), ajoutez :

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com

Type: A
Name: @
Value: 76.76.21.21
```

**Propagation** : 5-30 minutes

---

## 📋 ÉTAPE 5 : DÉPLOIEMENTS MULTIPLES (OPTIONNEL)

### 5.1 RhymeChain Landing Page
Pour déployer `rhymechain.win` séparément :

1. Créez un **nouveau projet** Vercel
2. Même repository
3. **Root Directory** : `deployment/sites_deploy/rhymechain-win`
4. **Framework** : Other (site statique)
5. **Build Command** : (laisser vide)
6. **Output Directory** : `.`

### 5.2 Fixie Dashboard
1. Nouveau projet Vercel
2. **Root Directory** : `apps/fixie-dashboard/fixie-app`
3. **Build Command** : `pnpm build`
4. **Output Directory** : `.next`

---

## 🔧 TROUBLESHOOTING

### Erreur : "Module not found"
**Solution** : Vérifiez que tous les packages sont dans `pnpm-workspace.yaml`

### Erreur : "Build failed"
**Solution** : Relancez `pnpm build` localement et corrigez les erreurs TypeScript

### Erreur : "Environment variable not found"
**Solution** : Ajoutez toutes les variables dans Vercel Settings

---

## 📊 POST-DÉPLOIEMENT

### Analytics
Activez **Vercel Analytics** dans Settings pour suivre :
- Page views
- Performance (Core Web Vitals)
- Erreurs runtime

### Monitoring
Configurez **Sentry** pour capturer les erreurs :
```bash
pnpm add @sentry/nextjs
```

### CI/CD
Chaque push sur `main` déclenchera automatiquement un redéploiement.

---

## ✅ CHECKLIST FINALE

- [ ] Build local réussi
- [ ] Code pushé sur GitHub
- [ ] Projet importé dans Vercel
- [ ] Variables d'environnement configurées
- [ ] Premier déploiement réussi
- [ ] Domaine personnalisé configuré
- [ ] Analytics activées
- [ ] Monitoring Sentry configuré

---

**Temps total estimé** : 15-20 minutes  
**Coût** : $0 (plan gratuit Vercel suffit pour commencer)

🎉 **Votre portfolio est maintenant en production !**
