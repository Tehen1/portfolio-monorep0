# FixieRun PWA - Guide de Développement Complet

## Vue d'ensemble du Projet

FixieRun est une application **Move-to-Earn** révolutionnaire qui combine le fitness, la blockchain et les technologies Web3 dans une Progressive Web App ultra-performante. Cette application permet aux utilisateurs de gagner des tokens et des NFT Soulbound en pratiquant leurs activités sportives favorites (cyclisme, course à pied, etc.).

### Architecture Technique

#### Stack Frontend
- **Framework**: Next.js 14 (App Router) avec TypeScript
- **Styling**: Tailwind CSS + shadcn/ui pour une interface moderne
- **PWA**: Serwist 9.0 (successeur de next-pwa) pour les capacités offline
- **Web3**: wagmi + viem pour l'intégration blockchain
- **État**: Zustand pour la gestion d'état légère

#### Stack Blockchain
- **Smart Contracts**: Solidity 0.8.21 avec Foundry
- **Réseaux**: Ethereum L1, Polygon zkEVM, Arbitrum, zkSync Era
- **Sécurité**: ReentrancyGuard, AccessControl, UUPS Proxy
- **NFT**: ERC721 Soulbound "ProofOfRun" non-transférable

#### Infrastructure
- **Hébergement**: GitHub Pages (déploiement statique)
- **Base de données**: Neon/PostgreSQL
- **Stockage**: IPFS (Pinata/NFT.Storage)
- **CDN**: Cloudflare

## Objectifs de Performance

### Core Web Vitals
- **LCP (Largest Contentful Paint)**: < 2,5s
- **FID (First Input Delay)**: < 100ms  
- **CLS (Cumulative Layout Shift)**: < 0,1
- **Score Global**: ≥ 90/100

### Scalabilité
- Support de **5 000 utilisateurs/minute**
- Expérience **offline-first** complète
- Synchronisation en arrière-plan

## Sections de l'Application

### 1. Home - Tableau de Bord Principal
**Fonctionnalités**:
- Dashboard avec métriques en temps réel
- Démarrage rapide d'entraînement
- Défis quotidiens personnalisés
- Aperçu collection NFT

**Optimisations PWA**:
- CSS critique inline pour LCP < 1,5s
- Prefetching des ressources critiques
- Synchronisation d'arrière-plan

### 2. DeFi - Intégration Blockchain
**Fonctionnalités**:
- Connexion wallet (MetaMask, WalletConnect)
- Staking de tokens $FIXIE
- Yield farming et liquidity mining
- Marketplace NFT intégré

**Optimisations PWA**:
- Mise en file d'attente des transactions offline
- Cache des données de prix
- Persistance de l'état Web3

### 3. Analytics - Métriques et Insights
**Fonctionnalités**:
- Métriques de performance détaillées
- Graphiques de progression
- Classements communautaires
- Données historiques

**Optimisations PWA**:
- Cache des données de graphiques
- Visualisation offline
- Sync d'arrière-plan des données

### 4. Workouts - Suivi d'Activité
**Fonctionnalités**:
- Tracking GPS en temps réel
- Enregistrement de parcours
- Mint automatique de NFT
- Partage social

**Optimisations PWA**:
- Tracking GPS en arrière-plan
- Enregistrement offline d'entraînements
- Cache des médias

### 5. Rewards - Système de Récompenses
**Fonctionnalités**:
- Solde de tokens en temps réel
- Galerie NFT interactive
- Badges d'achievement
- Programme de parrainage

**Optimisations PWA**:
- Préchargement des assets
- Affichage offline des récompenses
- Notifications d'arrière-plan

### 6. Profile - Gestion Utilisateur
**Fonctionnalités**:
- Paramètres utilisateur
- Gestion de wallet
- Contrôles de confidentialité
- Export de données RGPD

**Optimisations PWA**:
- Cache des données utilisateur
- Édition offline du profil
- Stockage sécurisé

## Implémentation PWA avec Serwist

### Configuration Service Worker

```typescript
// src/service-worker/app-worker.ts
import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    // Cache-first pour les assets statiques
    {
      urlPattern: /^https:\/\/app\.fixie\.run\/_next\/static\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "static-assets",
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 jours
        },
      },
    },
    // Network-first pour les API calls
    {
      urlPattern: /^https:\/\/api\.fixie\.run\/.*/i,
      handler: "NetworkFirst",
      options: {
        cacheName: "api-cache",
        networkTimeoutSeconds: 3,
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 5 * 60, // 5 minutes
        },
      },
    },
    // Stale-while-revalidate pour les données utilisateur
    {
      urlPattern: /^https:\/\/app\.fixie\.run\/api\/user\/.*/i,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "user-data",
        expiration: {
          maxEntries: 20,
          maxAgeSeconds: 60 * 60, // 1 heure
        },
      },
    },
  ],
  fallbacks: {
    entries: [
      {
        url: '/offline',
        matcher({ request }) {
          return request.destination === 'document';
        },
      },
    ],
  },
});

serwist.addEventListeners();
```

### Manifest PWA

```json
{
  "name": "FixieRun - Move to Earn",
  "short_name": "FixieRun",
  "description": "Gagnez des crypto en faisant du sport",
  "start_url": "/",
  "display": "standalone",
  "orientation": "portrait-primary",
  "theme_color": "#6366f1",
  "background_color": "#ffffff",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable"
    },
    {
      "src": "/icons/icon-512x512.png", 
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "categories": ["fitness", "blockchain", "lifestyle"],
  "screenshots": [
    {
      "src": "/screenshots/mobile-dashboard.png",
      "sizes": "390x844",
      "type": "image/png",
      "form_factor": "narrow"
    }
  ]
}
```

## Sécurité Blockchain

### Smart Contract Soulbound NFT

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract ProofOfRun is 
    ERC721Upgradeable, 
    AccessControlUpgradeable, 
    ReentrancyGuardUpgradeable,
    UUPSUpgradeable 
{
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    
    struct WorkoutData {
        uint256 distance; // en mètres
        uint256 duration; // en secondes
        uint256 calories; // calories brûlées
        string routeHash; // Hash IPFS du parcours
        uint8 difficulty; // 1-10
        uint256 timestamp;
    }
    
    mapping(uint256 => WorkoutData) public workoutData;
    mapping(address => uint256[]) public userTokens;
    
    event WorkoutMinted(
        address indexed user,
        uint256 indexed tokenId,
        uint256 distance,
        uint256 duration,
        string metadataURI
    );
    
    function initialize(
        string memory name,
        string memory symbol
    ) public initializer {
        __ERC721_init(name, symbol);
        __AccessControl_init();
        __ReentrancyGuard_init();
        __UUPSUpgradeable_init();
        
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }
    
    function mintWorkoutNFT(
        address to,
        WorkoutData calldata workout,
        string calldata metadataURI
    ) external onlyRole(MINTER_ROLE) nonReentrant {
        require(workout.distance > 0, "Distance must be positive");
        require(workout.duration > 0, "Duration must be positive");
        
        uint256 tokenId = totalSupply() + 1;
        workoutData[tokenId] = workout;
        userTokens[to].push(tokenId);
        
        _mint(to, tokenId);
        _setTokenURI(tokenId, metadataURI);
        
        emit WorkoutMinted(
            to,
            tokenId,
            workout.distance,
            workout.duration,
            metadataURI
        );
    }
    
    // Override pour rendre les NFT non-transférables (Soulbound)
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override {
        require(
            from == address(0) || to == address(0),
            "Soulbound: Transfer not allowed"
        );
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }
    
    function _authorizeUpgrade(address newImplementation)
        internal
        override
        onlyRole(DEFAULT_ADMIN_ROLE)
    {}
}
```

### Mesures de Sécurité

#### Smart Contract
- **ReentrancyGuard**: Protection contre les attaques de réentrance
- **AccessControl**: Gestion des rôles et permissions
- **UUPS Proxy**: Pattern pour les mises à jour sécurisées
- **Tests Slither**: Analyse statique ≥90% de couverture
- **Mythril**: Tests de sécurité automatisés

#### Web Security
- **CSP**: Content Security Policy strict
- **HTTPS**: Chiffrement TLS obligatoire
- **Secure Headers**: HSTS, X-Frame-Options, etc.
- **XSS Protection**: Sanitisation des entrées utilisateur

## Déploiement sur GitHub Pages

### Configuration Next.js

```javascript
// next.config.js
const withSerwist = require("@serwist/next").default({
  swSrc: "src/service-worker/app-worker.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  assetPrefix: process.env.NODE_ENV === 'production' ? '/fixierun-pwa' : '',
  basePath: process.env.NODE_ENV === 'production' ? '/fixierun-pwa' : '',
};

module.exports = withSerwist(nextConfig);
```

### GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build application
        run: npm run build
        
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './out'
          
      - name: Deploy to GitHub Pages
        uses: actions/deploy-pages@v4
```

## Optimisation des Core Web Vitals

### LCP (Largest Contentful Paint) < 2.5s
- **CSS critique inline**: Premier rendu sans bloquer
- **Préchargement d'images**: `<link rel="preload">` pour les assets critiques
- **Optimisation des fonts**: `font-display: swap`
- **CDN**: Cloudflare pour la distribution rapide

### FID (First Input Delay) < 100ms
- **Code splitting**: Chargement progressif des composants
- **Web Workers**: Traitement lourd en arrière-plan
- **Lazy loading**: Composants non-critiques différés
- **Bundle optimization**: Tree shaking agressif

### CLS (Cumulative Layout Shift) < 0.1
- **Dimensions fixes**: Images et composants avec tailles définies
- **Placeholder skeleton**: Éviter les décalages de contenu
- **Font loading**: Éviter les FOUT/FOIT
- **CSS Grid/Flexbox**: Layouts stables

## Intégration Multi-Chain

### Configuration Wagmi

```typescript
// lib/wagmi-config.ts
import { createConfig, http } from 'wagmi'
import { mainnet, polygon, arbitrum, zkSync } from 'wagmi/chains'
import { metaMask, walletConnect } from 'wagmi/connectors'

export const config = createConfig({
  chains: [mainnet, polygon, arbitrum, zkSync],
  connectors: [
    metaMask(),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID!,
    }),
  ],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [arbitrum.id]: http(), 
    [zkSync.id]: http(),
  },
})
```

### Déploiement Multi-Chain

```bash
# Déploiement sur Polygon zkEVM
forge create --rpc-url $POLYGON_ZKEVM_RPC \
  --private-key $PRIVATE_KEY \
  --etherscan-api-key $POLYGONSCAN_API_KEY \
  --verify \
  src/ProofOfRun.sol:ProofOfRun

# Déploiement sur Arbitrum
forge create --rpc-url $ARBITRUM_RPC \
  --private-key $PRIVATE_KEY \
  --etherscan-api-key $ARBISCAN_API_KEY \
  --verify \
  src/ProofOfRun.sol:ProofOfRun

# Déploiement sur zkSync Era
forge create --rpc-url $ZKSYNC_RPC \
  --private-key $PRIVATE_KEY \
  --verify \
  src/ProofOfRun.sol:ProofOfRun
```

## Stockage IPFS pour NFT

### Configuration Pinata

```typescript
// lib/ipfs.ts
import { PinataSDK } from "pinata-web3";

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT,
  pinataGateway: process.env.NEXT_PUBLIC_PINATA_GATEWAY,
});

export async function uploadWorkoutMetadata(
  workoutData: WorkoutData,
  imageFile: File
) {
  try {
    // Upload image
    const imageUpload = await pinata.upload.file(imageFile);
    
    // Create metadata
    const metadata = {
      name: `Workout #${Date.now()}`,
      description: `${workoutData.distance/1000}km run completed`,
      image: `ipfs://${imageUpload.IpfsHash}`,
      attributes: [
        {
          trait_type: "Distance",
          value: workoutData.distance,
          display_type: "number"
        },
        {
          trait_type: "Duration", 
          value: workoutData.duration,
          display_type: "number"
        },
        {
          trait_type: "Calories",
          value: workoutData.calories,
          display_type: "number"
        },
        {
          trait_type: "Difficulty",
          value: workoutData.difficulty,
          display_type: "number"
        }
      ]
    };
    
    // Upload metadata
    const metadataUpload = await pinata.upload.json(metadata);
    
    return {
      metadataUri: `ipfs://${metadataUpload.IpfsHash}`,
      imageUri: `ipfs://${imageUpload.IpfsHash}`
    };
    
  } catch (error) {
    console.error("IPFS upload error:", error);
    throw error;
  }
}
```

## Checklist de Déploiement

### Phase 1: Fondations PWA (Semaine 1)
- [ ] Configuration Serwist 9.0
- [ ] Manifest.json optimisé pour Web3 fitness
- [ ] Stratégies de cache de base
- [ ] Page offline de fallback

### Phase 2: Optimisations Performance (Semaine 2)  
- [ ] Core Web Vitals ≥ 90/100
- [ ] Code splitting par routes
- [ ] Lazy loading des composants
- [ ] Image optimization (WebP/AVIF)

### Phase 3: Intégration Blockchain (Semaine 3)
- [ ] Smart contracts ProofOfRun
- [ ] Tests de sécurité (Slither/Mythril)
- [ ] Déploiement multi-chain
- [ ] Intégration IPFS

### Phase 4: Production & Monitoring (Semaine 4)
- [ ] Déploiement GitHub Pages
- [ ] Configuration CDN Cloudflare
- [ ] Monitoring performance
- [ ] Tests charge 5000 users/min

## Surveillance et Maintenance

### Métriques Clés
- **Performance**: Core Web Vitals temps réel
- **Adoption**: Taux d'installation PWA
- **Engagement**: Sessions offline/online
- **Sécurité**: Alertes smart contracts

### Outils de Monitoring
- **Lighthouse CI**: Tests automatisés performance
- **Web Vitals**: Métriques utilisateur réel
- **Sentry**: Monitoring erreurs et performance
- **Alchemy**: Surveillance blockchain

Cette architecture garantit une PWA FixieRun performante, sécurisée et scalable, prête pour un écosystème Web3 en production.