# 📱 MAC M1 PRO - INSTALLATION COMPLÈTE APRÈS FORMATAGE

## Stack Full-Stack Blockchain Web3 - Novembre 2025

### 🎯 RÉCAPITULATIF STACK (du document)

**Frontend:**

- React/Next.js 14+, TypeScript strict, Tailwind CSS, Shadcn/UI, PWA

**Backend:**

- Node.js, Prisma ORM, PostgreSQL, APIs REST/GraphQL, Auth OAuth2/JWT

**Blockchain/Web3:**

- Solidity 0.8+, Web3.js/Viem, zkEVM (Scroll/Polygon), Foundry, OpenZeppelin

**DevOps:**

- Docker, GitHub Actions, Vercel, Cloudflare, VPS admin, Sentry

**IA/ML:**

- OpenAI API, agents on-chain, NLP, n8n workflow automation

**Monitoring:**

- Sentry, Mixpanel analytics, Dune dashboards

---

## 🚀 PHASE 1: PRÉPARATION SYSTÈME & OUTILS ESSENTIELS (30 min)

### 1.1 Mettre à jour macOS (si nécessaire)

\`\`\`bash
softwareupdate -a -i -R
\`\`\`

### 1.2 Installer Homebrew (gestionnaire packages macOS)

\`\`\`bash
/bin/bash -c "$(curl -fsSL <https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh>)"

# Vérifier installation

brew --version
\`\`\`

### 1.3 Installer Git & configurer

\`\`\`bash
brew install git

# Configurer Git global

git config --global user.name "Antony Lambi"
git config --global user.email "<antony.lambi88@gmail.com>"
git config --global init.defaultBranch main

# Vérifier config

git config --list --global
\`\`\`

### 1.4 Générer clés SSH pour GitHub

\`\`\`bash
ssh-keygen -t ed25519 -C "<antony.lambi88@gmail.com>" -f ~/.ssh/github

# Ajouter clé à ssh-agent

eval "$(ssh-agent -s)"
ssh-add ~/.ssh/github

# Afficher clé publique (copier dans GitHub settings)

cat ~/.ssh/github.pub
\`\`\`

### 1.5 Installer terminal shells avancés

\`\`\`bash

# Installer Zsh (déjà par défaut sur macOS récent)

# Installer Oh-my-zsh pour config + plugins

sh -c "$(curl -fsSL <https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh>)"

# Installer Ghostty (terminal moderne recommandé)

brew install --cask ghostty

# Ou garder iTerm2 (alternative)

brew install --cask iterm2
\`\`\`

---

## 💻 PHASE 2: ENVIRONNEMENT NODE.JS & PACKAGE MANAGERS (45 min)

### 2.1 Installer Node Version Manager (NVM)

\`\`\`bash

# Installer NVM (gérer plusieurs versions Node)

curl -o- <https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh> | bash

# Charger NVM dans shell

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Vérifier

nvm --version
\`\`\`

### 2.2 Installer Node.js 20 LTS (latest stable + support long terme)

\`\`\`bash

# Installer Node 20 LTS (recommandé prod)

nvm install 20
nvm use 20
nvm alias default 20

# Vérifier versions

node --version  # v20.x.x
npm --version   # 10.x.x
\`\`\`

### 2.3 Configurer npm global & package managers alternatifs

\`\`\`bash

# Mettre à jour npm à latest

npm install -g npm@latest

# Installer pnpm (plus rapide + espace disque réduit)

npm install -g pnpm

# Installer yarn (alternative)

npm install -g yarn

# Vérifier installations

npm --version
pnpm --version
yarn --version
\`\`\`

### 2.4 Configurer npm pour modules globaux

\`\`\`bash

# Créer dossier npm global (éviter permission issues)

mkdir ~/.npm-global
npm config set prefix '~/.npm-global'

# Ajouter à PATH dans ~/.zshrc

echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.zshrc
source ~/.zshrc
\`\`\`

---

## 🐳 PHASE 3: DOCKER & CONTAINERIZATION (30 min)

### 3.1 Installer Docker Desktop pour Mac M1

\`\`\`bash

# Via Homebrew (recommandé)

brew install --cask docker

# OU télécharger direct

# <https://www.docker.com/products/docker-desktop>

# Vérifier après install

docker --version
docker run hello-world
\`\`\`

### 3.2 Configurer Docker daemon pour M1

\`\`\`bash

# Dans Docker Desktop → Preferences → Resources

# - CPUs: 4-6 (selon RAM dispo)

# - Memory: 8-12 GB

# - Disk: 100 GB minimum

# - Enable VirtioFS (performance)

# Vérifier Docker fonctionne

docker ps
docker images
\`\`\`

### 3.3 Installer Docker Compose (inclus avec Desktop)

\`\`\`bash

# Vérifier version

docker-compose --version

# Si besoin de v2 explicite

docker compose version
\`\`\`

### 3.4 Créer network Docker pour dev

\`\`\`bash
docker network create web3-dev
docker network ls
\`\`\`

---

## 📦 PHASE 4: BASES DE DONNÉES & PERSISTENCE (40 min)

### 4.1 PostgreSQL via Docker (recommandé)

\`\`\`bash

# Installer PostgreSQL image local

docker pull postgres:16-alpine

# Créer container persistant PostgreSQL

docker run -d \
  --name postgres-dev \
  --network web3-dev \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=devpassword123 \
  -e POSTGRES_DB=web3_dev \
  -v postgres_data:/var/lib/postgresql/data \
  -p 5432:5432 \
  postgres:16-alpine

# Vérifier

docker ps | grep postgres
\`\`\`

### 4.2 Installer PostgreSQL CLI client local (optionnel)

\`\`\`bash
brew install libpq
echo 'export PATH="/opt/homebrew/opt/libpq/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# Test connexion

psql -h localhost -U admin -d web3_dev

# Password: devpassword123

\`\`\`

### 4.3 Redis via Docker (caching + sessions)

\`\`\`bash
docker pull redis:7-alpine

docker run -d \
  --name redis-dev \
  --network web3-dev \
  -p 6379:6379 \
  -v redis_data:/data \
  redis:7-alpine redis-server --appendonly yes

docker ps | grep redis
\`\`\`

### 4.4 MongoDB via Docker (optional, si NoSQL needed)

\`\`\`bash
docker pull mongo:7

docker run -d \
  --name mongo-dev \
  --network web3-dev \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=devpassword123 \
  -p 27017:27017 \
  -v mongo_data:/data/db \
  mongo:7

# Test

docker exec -it mongo-dev mongosh
\`\`\`

---

## 🎨 PHASE 5: FRONTEND STACK - NEXT.JS + REACT (45 min)

### 5.1 Installer Node global tools essentiels

\`\`\`bash

# Prisma CLI (ORM)

npm install -g @prisma/cli

# TypeScript

npm install -g typescript ts-node

# ESLint + Prettier (linting + formatting)

npm install -g eslint prettier

# Vérifier

prisma --version
tsc --version
eslint --version
\`\`\`

### 5.2 Créer nouveau projet Next.js 14 avec template optimal

\`\`\`bash

# Option 1: Create Next App (recommandé)

npx create-next-app@latest fixie-app \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias '@/*'

cd fixie-app

# Option 2: Si tu préfères pnpm

pnpm create next-app@latest fixie-app \
  --typescript \
  --tailwind \
  --eslint \
  --app
\`\`\`

### 5.3 Installer dépendances essentielles Next.js + Web3

\`\`\`bash
cd fixie-app

# React + Next essentials (normalement inclu)

npm install react@latest react-dom@latest next@latest

# TypeScript strict

npm install -D typescript@latest @types/react@latest @types/node@latest

# UI Components (Shadcn/UI)

npx shadcn-ui@latest init

# Web3 Libraries

npm install ethers viem web3 @web3-react/core @web3-react/injected-connector

# Blockchain utilities

npm install @openzeppelin/contracts zustand axios dotenv

# Tailwind CSS (normalement préinstallé)

npm install -D tailwindcss postcss autoprefixer

# Additional tools

npm install clsx classnames
npm install zustand # state management (léger)
npm install axios # HTTP client
npm install dotenv # environment vars
npm install date-fns # date utilities

# Dev dependencies

npm install -D @types/node @types/react-dom eslint-config-next prettier prettier-plugin-tailwindcss
\`\`\`

### 5.4 Configurer TypeScript strict mode

\`\`\`bash

# Créer tsconfig.json optimal

cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "isolatedModules": true,
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
EOF
\`\`\`

### 5.5 Setup Prisma ORM

\`\`\`bash
npx prisma init

# Configurer DATABASE_URL dans .env.local

# DATABASE_URL="postgresql://admin:devpassword123@localhost:5432/web3_dev"

# Créer schema.prisma optimal

\`\`\`

---

## ⛓️ PHASE 6: BLOCKCHAIN & WEB3 STACK (1 heure)

### 6.1 Installer Foundry (smart contract testing + deployment)

\`\`\`bash

# Via brew (M1 native support)

brew install foundry

# Vérifier

forge --version
cast --version

# OU installer via script officiel

curl -L <https://foundry.paradigm.xyz> | bash
foundryup
\`\`\`

### 6.2 Installer Hardhat (alternative à Foundry)

\`\`\`bash

# Créer dossier pour smart contracts

mkdir fixie-contracts
cd fixie-contracts

# Init Hardhat project

npx hardhat init

# Installer dépendances

npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox

# OpenZeppelin contracts (sécurité)

npm install @openzeppelin/contracts @openzeppelin/contracts-upgradeable

# Vérifier

npx hardhat --version
\`\`\`

### 6.3 Setup Solidity compiler + zkEVM networks

\`\`\`bash

# Dans hardhat.config.js ajouter Scroll zkEVM networks

cat > hardhat.config.js << 'EOF'
require("@nomicfoundation/hardhat-toolbox");
require("@openzeppelin/hardhat-upgrades");

module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    // Scroll Sepolia Testnet (zkEVM)
    scrollSepolia: {
      url: "<https://sepolia-rpc.scroll.io>",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 534351,
    },
    // Polygon zkEVM Testnet
    polygonZkEVM: {
      url: "<https://testnet-rpc.zkevmpolygon.com>",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 1402,
    },
    // Ethereum Sepolia (test)
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: {
      scrollSepolia: process.env.ETHERSCAN_API_KEY || "",
    },
  },
};
EOF
\`\`\`

### 6.4 Installer Web3.js / Viem (client libraries)

\`\`\`bash
cd ../fixie-app

# Viem (moderne, TypeScript-native)

npm install viem

# Web3.js (fallback, plus old-school)

npm install web3

# Ethers.js (très populaire)

npm install ethers

# Contract interaction helpers

npm install @wagmi/core wagmi
npm install @rainbow-me/rainbowkit  # wallet connection UI

# zkEVM specific

npm install @scroll-tech/contracts
\`\`\`

### 6.5 Setup environment variables Web3

\`\`\`bash

# Créer .env.local complet

cat > .env.local << 'EOF'

# Database

DATABASE_URL="postgresql://admin:devpassword123@localhost:5432/web3_dev"
REDIS_URL="redis://localhost:6379"

# Blockchain RPC Endpoints

NEXT_PUBLIC_SCROLL_RPC="<https://sepolia-rpc.scroll.io>"
NEXT_PUBLIC_POLYGON_ZKEVM_RPC="<https://testnet-rpc.zkevmpolygon.com>"
NEXT_PUBLIC_ETHEREUM_RPC="<https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY>"

# API Keys

PRIVATE_KEY="0x..." # Pour deployments
ALCHEMY_API_KEY="YOUR_KEY"
ETHERSCAN_API_KEY="YOUR_KEY"
INFURA_API_KEY="YOUR_KEY"

# OpenAI (IA integration)

OPENAI_API_KEY="sk-..."
OPENAI_ORG_ID="org-..."

# Chainlink oracles

CHAINLINK_API_KEY="YOUR_KEY"

# Auth

NEXTAUTH_URL="<http://localhost:3000>"
NEXTAUTH_SECRET=$(openssl rand -base64 32)

# Sentry monitoring

NEXT_PUBLIC_SENTRY_DSN="https://..."
\`\`\`

### 6.6 Installer Chainlink CLI (oracles)

\`\`\`bash

# Via npm

npm install -g @chainlink/cli

# Vérifier

chainlink --version
\`\`\`

---

## 🔒 PHASE 7: SÉCURITÉ & AUDITS SMART CONTRACTS (30 min)

### 7.1 Installer Slither (static analysis)

\`\`\`bash

# Via pip (Python required)

brew install python3

pip3 install slither-analyzer

# Vérifier

slither --version
\`\`\`

### 7.2 Installer Mythril (security analyzer)

\`\`\`bash
pip3 install mythril

# Vérifier

myth --version
\`\`\`

### 7.3 Setup contract fuzzing Foundry

\`\`\`bash

# Déjà inclus avec Foundry

# Tests fuzzing dans tests/ dossier

# Créer test example

cat > test/Fuzzing.t.sol << 'EOF'
pragma solidity ^0.8.0;

import "forge-std/Test.sol";

contract FuzzingTest is Test {
    function testFuzz_invariant(uint256 x) public {
        require(x < type(uint256).max);
        // Test logic
    }
}
EOF

# Lancer fuzzing

forge test --fuzz
\`\`\`

---

## 📊 PHASE 8: MONITORING & ANALYTICS (30 min)

### 8.1 Installer Sentry CLI

\`\`\`bash
npm install -g @sentry/cli

# Vérifier

sentry --version
\`\`\`

### 8.2 Installer Dune Analytics CLI (optionnel)

\`\`\`bash

# Via pip

pip3 install dune-client

# Authentifier

dune auth login
\`\`\`

### 8.3 Installer Mixpanel CLI (analytics)

\`\`\`bash
npm install -g @mixpanel/mixpanel-cli

# Vérifier

mixpanel --version
\`\`\`

---

## 🚀 PHASE 9: CI/CD & DEPLOYMENT TOOLS (30 min)

### 9.1 Installer Vercel CLI (deployment frontend)

\`\`\`bash
npm install -g vercel

# Login

vercel login

# Vérifier

vercel --version
\`\`\`

### 9.2 Installer Railway CLI (backend deployment)

\`\`\`bash
npm install -g railway

# Login

railway login

# Vérifier

railway --version
\`\`\`

### 9.3 Installer GitHub CLI

\`\`\`bash
brew install gh

# Login

gh auth login

# Vérifier

gh --version
\`\`\`

### 9.4 Installer Cloudflare CLI

\`\`\`bash
npm install -g wrangler

# Vérifier

wrangler --version
\`\`\`

---

## 🤖 PHASE 10: IA/AUTOMATION TOOLS (30 min)

### 10.1 Installer n8n (workflow automation)

\`\`\`bash

# Via Docker (recommandé)

docker pull n8nio/n8n:latest

docker run -d \
  --name n8n \
  --network web3-dev \
  -e DB_TYPE=postgres \
  -e DB_URL="postgres://admin:devpassword123@postgres-dev:5432/n8n" \
  -p 5678:5678 \
  n8nio/n8n

# Accès: <http://localhost:5678>

\`\`\`

### 10.2 Configurer OpenAI CLI

\`\`\`bash
npm install -g openai

# Setup

openai api keys list

# Test

openai api completions.create -m text-davinci-003 -p "Hello"
\`\`\`

### 10.3 Installer LangChain (agents on-chain)

\`\`\`bash
cd fixie-app
npm install langchain openai
\`\`\`

---

## 📱 PHASE 11: MOBILE & PWA (optional - 20 min)

### 11.1 React Native setup (si besoin native mobile)

\`\`\`bash

# Via Expo (plus simple)

npm install -g expo-cli

# OU React Native CLI

npm install -g react-native-cli

# Créer app React Native

npx create-expo-app fixie-mobile
cd fixie-mobile

# Installer Web3 pour RN

npm install ethers wagmi viem react-native-web3-provider
\`\`\`

### 11.2 PWA tooling

\`\`\`bash

# Next.js PWA plugin

npm install next-pwa

# Workbox (service workers)

npm install workbox-core workbox-precaching workbox-routing workbox-strategies
\`\`\`

---

## 🎯 PHASE 12: TESTING SUITE COMPLÈTE (45 min)

### 12.1 Frontend testing

\`\`\`bash
cd fixie-app

# Jest + React Testing Library

npm install -D jest @testing-library/react @testing-library/jest-dom @testing-library/user-event

# E2E testing (Playwright)

npm install -D @playwright/test

# Cypress alternative

npm install -D cypress

# Vérifier

npx jest --version
npx playwright --version
\`\`\`

### 12.2 Backend testing

\`\`\`bash

# Vitest (rapide, Vite-compatible)

npm install -D vitest

# Supertest (HTTP testing)

npm install -D supertest @types/supertest

# Vérifier

npx vitest --version
\`\`\`

### 12.3 Smart contract testing

\`\`\`bash
cd fixie-contracts

# Truffle testing

npm install -D truffle

# Hardhat testing (déjà setup)

# Test files in test/ directory

# Vérifier

npx truffle --version
npx hardhat test
\`\`\`

---

## 🔧 PHASE 13: DEVELOPMENT UTILITIES & HELPERS (30 min)

### 13.1 Installer outils utiles

\`\`\`bash

# Utility packages globales

npm install -g   http-server \      # Quick static server
  nodemon \          # Auto-restart Node
  concurrently \     # Run multiple commands
  cross-env \        # Cross-platform env vars
  dotenv-cli \       # .env CLI tool
  pm2 \              # Process manager
  serve \            # Production server

# Vérifier

npm list -g --depth=0
\`\`\`

### 13.2 Installer linters + formatters

\`\`\`bash
cd fixie-app

# ESLint avec config Web3/React

npm install -D eslint @eslint/js typescript-eslint eslint-config-prettier eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-web3

# Prettier config

npm install -D prettier prettier-plugin-tailwindcss prettier-plugin-solidity

# Husky + Lint-staged (pre-commit hooks)

npm install -D husky lint-staged
npx husky install

# Vérifier

npx eslint --version
npx prettier --version
\`\`\`

### 13.3 Setup project template optimal

\`\`\`bash

# Créer structure Next.js idéale

mkdir -p src/{app,components,lib,hooks,services,types,utils,constants,config}
mkdir -p public/{images,icons,fonts}

# Créer fichiers template

touch src/lib/web3.ts
touch src/hooks/useWeb3.ts
touch src/services/api.ts
touch src/utils/helpers.ts
touch src/types/index.ts
\`\`\`

---

## 💾 PHASE 14: BACKUP & VERSION CONTROL SETUP (20 min)

### 14.1 Initialiser Git repos pour 3 projets

\`\`\`bash

# Fixie.run

cd ~/projects/fixie-app
git init
git add .
git commit -m "Initial commit: Next.js setup"
git remote add origin <git@github.com>:YOUR_USERNAME/fixie-app.git
git push -u origin main

# RhymeChain.win

cd ~/projects/rhymechain
git init

# ... same setup

# SEO-SEA-Vision

cd ~/projects/seo-sea-vision
git init

# ... same setup

\`\`\`

### 14.2 Setup GitHub workflows CI/CD

\`\`\`bash

# Créer .github/workflows

mkdir -p .github/workflows

# Créer build workflow

cat > .github/workflows/ci.yml << 'EOF'
name: CI/CD Pipeline

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run build
EOF
\`\`\`

### 14.3 Setup automated backups

\`\`\`bash

# Créer script backup

cat > ~/backup-projects.sh << 'EOF'
# !/bin/bash
BACKUP_DIR="$HOME/backups/web3-projects"
mkdir -p "$BACKUP_DIR"

tar -czf "$BACKUP_DIR/fixie-app-$(date +%Y%m%d).tar.gz" ~/projects/fixie-app
tar -czf "$BACKUP_DIR/rhymechain-$(date +%Y%m%d).tar.gz" ~/projects/rhymechain
tar -czf "$BACKUP_DIR/seo-sea-vision-$(date +%Y%m%d).tar.gz" ~/projects/seo-sea-vision

echo "Backup completed at $BACKUP_DIR"
EOF

chmod +x ~/backup-projects.sh

# Ajouter à crontab (daily 2 AM)

crontab -e

# 0 2 ** * ~/backup-projects.sh

\`\`\`

---

## ✅ PHASE 15: VERIFICATION & HEALTH CHECK (30 min)

### 15.1 Script verification complet

\`\`\`bash

# Créer verification script

cat > ~/verify-stack.sh << 'EOF'
# !/bin/bash

echo "=== WEB3 STACK VERIFICATION ==="

echo "✓ Homebrew"
brew --version

echo "✓ Git"
git --version

echo "✓ Node.js"
node --version && npm --version && pnpm --version

echo "✓ Docker"
docker --version && docker-compose --version

echo "✓ PostgreSQL"
docker ps | grep postgres

echo "✓ Redis"
docker ps | grep redis

echo "✓ Foundry"
forge --version && cast --version

echo "✓ Node Global Tools"
npx -v
typescript --version
prisma --version
eslint --version
prettier --version

echo "✓ Blockchain RPC endpoints"
curl -s <https://sepolia-rpc.scroll.io> | head -c 100

echo "✓ GitHub SSH"
ssh -T <git@github.com> 2>&1 | grep -o "Hi.*" || echo "⚠️  SSH not configured"

echo ""
echo "=== STACK VERIFICATION COMPLETE ==="
EOF

chmod +x ~/verify-stack.sh
~/verify-stack.sh
\`\`\`

### 15.2 Docker compose pour ALL services (prod-ready)

\`\`\`bash

# Créer docker-compose.yml complet

cat > ~/projects/docker-compose.yml << 'EOF'
version: '3.9'

services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: devpassword123
      POSTGRES_DB: web3_dev
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - web3-dev
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U admin"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - web3-dev
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  mongo:
    image: mongo:7
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: devpassword123
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
    networks:
      - web3-dev

  n8n:
    image: n8nio/n8n:latest
    environment:
      DB_TYPE: postgres
      DB_URL: "postgres://admin:devpassword123@postgres:5432/n8n"
      N8N_BASIC_AUTH_ACTIVE: "true"
      N8N_BASIC_AUTH_USER: "admin"
      N8N_BASIC_AUTH_PASSWORD: "change_me"
    ports:
      - "5678:5678"
    networks:
      - web3-dev
    depends_on:
      postgres:
        condition: service_healthy

volumes:
  postgres_data:
  redis_data:
  mongo_data:

networks:
  web3-dev:
    driver: bridge
EOF

# Start ALL services

docker-compose -f ~/projects/docker-compose.yml up -d
\`\`\`

---

## 🚀 DEMARRAGE RAPIDE - PRODUCTION READY

### Résumé commandes essentielles à exécuter

\`\`\`bash

# 1️⃣  FOUNDATION (10 min)

brew install git nodejs docker nvm
nvm install 20
npm install -g pnpm npm@latest

# 2️⃣  DOCKER INFRASTRUCTURE (5 min)

docker network create web3-dev
docker compose -f docker-compose.yml up -d

# 3️⃣  PROJECT INIT (10 min)

npx create-next-app@latest fixie-app --typescript --tailwind --app
cd fixie-app

# 4️⃣  DEPENDENCIES (10 min)

npm install ethers viem web3 @openzeppelin/contracts zustand axios
npm install -D typescript prettier eslint @types/react tailwindcss

# 5️⃣  BLOCKCHAIN (5 min)

brew install foundry
npm install -g @prisma/cli

# 6️⃣  RUN DEV

npm run dev

# → <http://localhost:3000>

# 7️⃣  VERIFY STACK

npm list
docker ps
forge --version
\`\`\`

---

## 📋 CHECKLIST FINAL - APRÈS FORMATAGE COMPLET

- [ ] macOS mis à jour
- [ ] Homebrew installé + fonctionnel
- [ ] Git configuré + SSH keys
- [ ] Node.js 20 LTS via NVM
- [ ] pnpm + yarn installés
- [ ] Docker Desktop M1 + networks
- [ ] PostgreSQL container running
- [ ] Redis container running
- [ ] MongoDB container (optional)
- [ ] Foundry installé (forge, cast)
- [ ] Hardhat project setup
- [ ] Solidity 0.8.24+ compiler
- [ ] Web3.js/Viem installés
- [ ] Slither + Mythril pour audits
- [ ] Vercel CLI logged in
- [ ] GitHub CLI logged in
- [ ] SSH keys sur GitHub
- [ ] Next.js 14 project créé
- [ ] TypeScript strict mode
- [ ] Prisma + schema.prisma
- [ ] Sentry configuré
- [ ] Zsh + Oh-my-zsh setup
- [ ] n8n running (automation)
- [ ] Docker compose stack healthy
- [ ] Git repos initialisés
- [ ] First commit poussé
- [ ] Backup script en place

---

## ⚡ PERFORMANCE TIPS MAC M1 PRO

\`\`\`bash

# 1. Limiter Docker resources intelligemment

# Docker Desktop → Preferences → Resources

# CPUs: 6, Memory: 10GB, Disk: 100GB

# 2. Utiliser pnpm au lieu npm (40% plus rapide)

pnpm install

# 3. Enable Rosetta 2 pour compat Intel packages

# Docker Desktop → Features → Use Rosetta 2 for x86

# 4. SSD optimization

defaults write NSGlobalDomain NSAppSleepTime -int 0  # Disable sleep

# 5. Activate mDNS for local development

cat >> /etc/hosts << EOF
127.0.0.1 localhost.local
EOF

# 6. Terminal optimization

export HOMEBREW_NO_AUTO_UPDATE=1
export NODE_OPTIONS=--max-old-space-size=4096
\`\`\`

---

**Setup complet environ 3-4 heures**
**Version: 1.0 - Novembre 2025**
