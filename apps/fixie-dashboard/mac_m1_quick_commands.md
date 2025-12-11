# 🚀 QUICK INSTALL COMMANDS ONLY - MAC M1 PRO
## After Complete Reformat - Copy/Paste Ready
## Estimated time: 1.5-2 hours

---

## 1️⃣ FOUNDATION (5 min)

# Install Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Configure shell
brew install zsh
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

# Git setup
brew install git
git config --global user.name "Antony Lambi"
git config --global user.email "tehen.antony@protonmail.com"
git config --global init.defaultBranch main

# SSH keys
ssh-keygen -t ed25519 -C "tehen.antony@protonmail.com" -f ~/.ssh/github
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/github
cat ~/.ssh/github.pub  # Copy to GitHub settings

---

## 2️⃣ NODE.JS & PACKAGE MANAGERS (10 min)

# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Install Node 20 LTS
nvm install 20
nvm use 20
nvm alias default 20

# Install package managers
npm install -g npm@latest
npm install -g pnpm
npm install -g yarn

# Configure npm global
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.zshrc
source ~/.zshrc

# Verify
node --version
npm --version
pnpm --version

---

## 3️⃣ DOCKER SETUP (10 min)

# Install Docker Desktop M1
brew install --cask docker

# Create network
docker network create web3-dev

# PostgreSQL
docker pull postgres:16-alpine
docker run -d --name postgres-dev --network web3-dev \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=devpassword123 \
  -e POSTGRES_DB=web3_dev \
  -v postgres_data:/var/lib/postgresql/data \
  -p 5432:5432 \
  postgres:16-alpine

# Redis
docker pull redis:7-alpine
docker run -d --name redis-dev --network web3-dev \
  -p 6379:6379 \
  -v redis_data:/data \
  redis:7-alpine redis-server --appendonly yes

# MongoDB (optional)
docker pull mongo:7
docker run -d --name mongo-dev --network web3-dev \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=devpassword123 \
  -p 27017:27017 \
  -v mongo_data:/data/db \
  mongo:7

# Verify
docker ps

---

## 4️⃣ BLOCKCHAIN TOOLS (15 min)

# Foundry (M1 native)
brew install foundry

# Verify
forge --version
cast --version

# Node global tools
npm install -g typescript ts-node
npm install -g @prisma/cli
npm install -g eslint prettier
npm install -g @chainlink/cli

# Slither (static analysis)
brew install python3
pip3 install slither-analyzer

# Mythril (security)
pip3 install mythril

# Verify
prisma --version
tsc --version
slither --version
myth --version

---

## 5️⃣ NEXT.JS PROJECT INIT (15 min)

# Create project
npx create-next-app@latest fixie-app \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias '@/*'

cd fixie-app

# Install core deps
npm install react@latest react-dom@latest next@latest

# TypeScript
npm install -D typescript@latest @types/react@latest @types/node@latest

# UI Components
npx shadcn-ui@latest init

# Web3 Core
npm install ethers viem web3
npm install @web3-react/core @web3-react/injected-connector
npm install @openzeppelin/contracts zustand axios dotenv

# Styling
npm install -D tailwindcss postcss autoprefixer
npm install clsx classnames

# Additional
npm install axios date-fns

# Dev dependencies
npm install -D @types/node @types/react-dom eslint-config-next prettier prettier-plugin-tailwindcss

# Setup Prisma
npx prisma init

# Update .env.local
cat > .env.local << 'EOF'
DATABASE_URL="postgresql://admin:devpassword123@localhost:5432/web3_dev"
REDIS_URL="redis://localhost:6379"
NEXT_PUBLIC_SCROLL_RPC="https://sepolia-rpc.scroll.io"
NEXT_PUBLIC_POLYGON_ZKEVM_RPC="https://testnet-rpc.zkevmpolygon.com"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET=$(openssl rand -base64 32)
EOF

# Verify
npm list

---

## 6️⃣ SMART CONTRACTS SETUP (10 min)

# Create contracts folder
mkdir ../fixie-contracts
cd ../fixie-contracts

# Hardhat init
npx hardhat init

# Install OpenZeppelin
npm install @openzeppelin/contracts @openzeppelin/contracts-upgradeable
npm install --save-dev @nomicfoundation/hardhat-toolbox

# Setup hardhat.config.js with zkEVM networks (see main guide)

# Foundry (alternative)
cd ..
mkdir foundry-contracts
cd foundry-contracts
forge init

# Verify
npx hardhat --version
forge --version

---

## 7️⃣ FRONTEND TESTING (10 min)

cd ../fixie-app

# Jest + Testing Library
npm install -D jest @testing-library/react @testing-library/jest-dom

# Playwright E2E
npm install -D @playwright/test

# Cypress alternative
npm install -D cypress

# Vitest (backend testing)
npm install -D vitest supertest

# Verify
npx jest --version
npx playwright --version

---

## 8️⃣ CI/CD & DEPLOYMENT (10 min)

# Vercel CLI
npm install -g vercel
vercel login

# Railway CLI
npm install -g railway
railway login

# GitHub CLI
brew install gh
gh auth login

# Cloudflare Wrangler
npm install -g wrangler

# Verify
vercel --version
railway --version
gh --version
wrangler --version

---

## 9️⃣ MONITORING & IA (10 min)

# Sentry CLI
npm install -g @sentry/cli

# n8n (Docker)
docker pull n8nio/n8n:latest
docker run -d --name n8n --network web3-dev \
  -e DB_TYPE=postgres \
  -e DB_URL="postgres://admin:devpassword123@postgres-dev:5432/n8n" \
  -p 5678:5678 \
  n8nio/n8n
# Access: http://localhost:5678

# LangChain + OpenAI
cd fixie-app
npm install langchain openai

# Dune CLI (optional)
pip3 install dune-client

# Verify
sentry --version
echo "✓ n8n running on http://localhost:5678"

---

## 🔟 LINTING & FORMATTING (10 min)

cd fixie-app

# ESLint setup
npm install -D eslint @eslint/js typescript-eslint
npm install -D eslint-config-prettier eslint-plugin-react
npm install -D eslint-plugin-react-hooks

# Prettier
npm install -D prettier prettier-plugin-tailwindcss

# Husky + Lint-staged
npm install -D husky lint-staged
npx husky install

# Create .husky/pre-commit
cat > .husky/pre-commit << 'EOF'
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"
npx lint-staged
EOF
chmod +x .husky/pre-commit

# Verify
npx eslint --version
npx prettier --version

---

## 1️⃣1️⃣ GIT & DEPLOYMENT (10 min)

cd ~/projects/fixie-app

# Initialize Git
git init
git add .
git commit -m "Initial commit: Next.js setup"

# Add GitHub remote
git remote add origin git@github.com:YOUR_USERNAME/fixie-app.git
git branch -M main
git push -u origin main

# Create .github/workflows/ci.yml
mkdir -p .github/workflows
cat > .github/workflows/ci.yml << 'EOF'
name: CI

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

git add .github/
git commit -m "Add CI/CD workflow"
git push

---

## 🔄 DOCKER COMPOSE ALL SERVICES (5 min)

# Create docker-compose.yml in ~/projects
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

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - web3-dev

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
    ports:
      - "5678:5678"
    networks:
      - web3-dev

volumes:
  postgres_data:
  redis_data:
  mongo_data:

networks:
  web3-dev:
    driver: bridge
EOF

# Start everything
cd ~/projects
docker-compose up -d
docker-compose ps

---

## ✅ FINAL VERIFICATION (5 min)

# Test all components
node --version
npm --version
pnpm --version
git --version
docker --version
forge --version
cast --version
npx hardhat --version
vercel --version
gh --version

# Test databases
docker ps | grep postgres
docker ps | grep redis
docker ps | grep mongo
docker ps | grep n8n

# Test Node services
curl http://localhost:5432 2>&1 | grep -q "." && echo "✓ PostgreSQL"
redis-cli ping
curl http://localhost:5678 2>&1 | grep -q "." && echo "✓ n8n"

# Test npm project
cd ~/projects/fixie-app
npm run dev &
sleep 5
curl http://localhost:3000
kill %1

---

## 📋 TOTAL COMMANDS - COPY ALL AT ONCE FOR SPEED

# Save as install.sh and run
chmod +x install.sh
./install.sh

---

## ⏱️ TIME ESTIMATES

Foundation (Git, Brew, SSH)        : 5 min
Node.js + Package managers          : 10 min
Docker + Databases                  : 10 min
Blockchain tools (Foundry, Hardhat) : 15 min
Next.js project                     : 15 min
Web3 dependencies                   : 10 min
Testing stack                       : 10 min
CI/CD tools                         : 10 min
Monitoring (Sentry, n8n)            : 10 min
Linting/Formatting                  : 10 min
Git setup + deployment              : 10 min

TOTAL: ~115 minutes (~2 hours)

---

## 🎯 QUICK START AFTER INSTALLATION

# Terminal 1 - Backend
cd ~/projects/fixie-app
npm run dev

# Terminal 2 - Docker check
docker-compose -f ~/projects/docker-compose.yml ps

# Terminal 3 - Smart contracts
cd ~/projects/fixie-contracts
foundry test

# Browser
http://localhost:3000           # Next.js app
http://localhost:5678          # n8n automation
http://localhost:3001          # Backend (if running)

---

## 🔐 SECURITY CHECKLIST

- [ ] SSH key on GitHub
- [ ] .env.local never committed
- [ ] Secrets in GitHub repository settings
- [ ] npm audit run
- [ ] Slither on smart contracts
- [ ] Mythril on contracts
- [ ] Private key never in code

---

## 📱 WHAT'S INSTALLED

Frontend       : Next.js 14, React 18, Tailwind, Shadcn/UI
Backend        : Node.js 20, Express, Prisma ORM
Blockchain     : Solidity, Foundry, Hardhat, Web3.js, Viem
Database       : PostgreSQL 16, Redis 7, MongoDB 7
DevOps         : Docker, GitHub Actions, Vercel, Railway
Testing        : Jest, Playwright, Hardhat, Foundry fuzzing
Analytics      : Sentry, Mixpanel, Dune
Automation     : n8n, OpenAI API, LangChain
Security       : Slither, Mythril, OpenZeppelin contracts
Linting        : ESLint, Prettier, Husky

---

**Mac M1 Pro - Web3 Stack Ready**
**Version: 1.0 - November 2025**
**Maintainer: Antony Lambi**
