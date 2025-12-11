# FIXIE.RUN - Web3 Fitness dApp

🚴‍♂️ **The future of fitness** - Track your activities, compete with friends, and earn tokens through Web3-powered cycling adventures.

![Fixie.Run](https://img.shields.io/badge/Web3-Fitness-blue?style=for-the-badge&logo=ethereum)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css)

## 🌟 Overview

Fixie.Run is a comprehensive Web3 fitness platform that combines metabolic tracking, gamification, and blockchain rewards. Users can track cycling activities, compete on leaderboards, earn Portfolio Tokens (PTF), and participate in community challenges.

### Key Features

- **🔗 Web3 Integration**: Wallet connection, token rewards, decentralized ownership
- **📊 Advanced Tracking**: Real-time metabolic data, activity analytics
- **🏆 Gamification**: Achievements, leaderboards, community challenges
- **👥 Social Features**: Friend connections, activity sharing, group challenges
- **🛒 Token Shop**: Premium gear, exclusive rewards, NFT collectibles
- **📱 Progressive Web App**: Offline functionality, mobile-optimized

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- MetaMask or compatible Web3 wallet
- Supabase account (for database)
- Infura/Alchemy API keys (for Web3)

### Installation

1. **Clone and install dependencies:**
```bash
cd apps/fixie-run
npm install
```

2. **Environment Setup:**
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your configuration:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_INFURA_KEY=your_infura_key
```

3. **Database Setup:**
```bash
# Run the database migrations from database_schema.sql
# Set up your Supabase project with the provided schema
```

4. **Development Server:**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🏗️ Architecture

### Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Web3**: Wagmi, Reown AppKit, Ethers.js
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel, Cloudflare
- **Monitoring**: Vercel Analytics, Sentry

### Project Structure

```
apps/fixie-run/
├── src/
│   ├── components/          # React components
│   │   ├── Dashboard.tsx    # Main dashboard
│   │   ├── Leaderboard.tsx  # Rankings & competition
│   │   ├── Rewards.tsx      # Achievements & tokens
│   │   ├── Social.tsx       # Community features
│   │   ├── Shop.tsx         # Token marketplace
│   │   ├── Profile.tsx      # User profile management
│   │   └── Onboarding.tsx   # New user setup
│   ├── lib/                 # Utility libraries
│   │   ├── supabase.ts      # Database client & helpers
│   │   ├── contracts.ts     # Web3 contract interactions
│   │   ├── wagmi.ts         # Web3 configuration
│   │   └── utils.ts         # General utilities
│   ├── pages/               # Next.js pages
│   │   ├── _app.tsx         # App wrapper
│   │   ├── index.tsx        # Main application
│   │   └── api/             # API routes
│   └── styles/
│       └── globals.css      # Global styles
├── contracts/               # Smart contracts
├── database_schema.sql      # Database schema
├── tailwind.config.js       # Tailwind configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies
```

## 🎯 Features

### Core Functionality

1. **Wallet Integration**
   - MetaMask, WalletConnect, Coinbase Wallet
   - Multi-chain support (Ethereum, Polygon, zkEVM)
   - Gasless transactions where possible

2. **Activity Tracking**
   - GPS-based route tracking
   - Metabolic calculations
   - Real-time metrics dashboard
   - Historical data analysis

3. **Token Economy**
   - Portfolio Token (PTF) rewards
   - Staking mechanism (15% APY)
   - Achievement-based bonuses
   - Community challenge rewards

4. **Social Features**
   - Friend connections
   - Activity sharing
   - Group challenges
   - Leaderboards with filters

5. **Gamification**
   - Achievement system
   - Level progression
   - Streak tracking
   - Milestone rewards

### Advanced Features

- **AI-Powered Insights**: Personalized recommendations
- **Cross-Platform Sync**: Apple Health, Google Fit integration
- **NFT Rewards**: Exclusive digital collectibles
- **Community Governance**: Token-based voting
- **Multi-Language Support**: i18n ready

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
npm run test         # Run Jest tests
npm run test:e2e     # Run Playwright tests
```

### Code Quality

- **ESLint**: Code linting and formatting
- **Prettier**: Automatic code formatting
- **TypeScript**: Type safety and IntelliSense
- **Jest**: Unit testing
- **Playwright**: End-to-end testing

### Database Schema

The application uses a comprehensive PostgreSQL schema with:

- User management and profiles
- Activity tracking with partitioned tables
- Token economy and rewards system
- Social features and relationships
- Analytics and reporting tables

See `database_schema.sql` for the complete schema definition.

## 🚀 Deployment

### Production Setup

1. **Environment Variables:**
   Set all required environment variables in your deployment platform.

2. **Database:**
   - Set up Supabase project
   - Run database migrations
   - Configure Row Level Security (RLS) policies

3. **Smart Contracts:**
   - Deploy PortfolioToken contract
   - Update contract addresses in configuration
   - Verify contracts on block explorers

4. **Build and Deploy:**
```bash
npm run build
npm run deploy  # or deploy via Vercel/Cloudflare
```

### Infrastructure

- **Frontend**: Vercel or Cloudflare Pages
- **Database**: Supabase
- **File Storage**: Cloudinary or Supabase Storage
- **Monitoring**: Vercel Analytics, Sentry
- **CDN**: Cloudflare

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m 'Add your feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write comprehensive tests
- Update documentation
- Use conventional commits
- Ensure accessibility compliance

## 📊 Roadmap

### Phase 1 (Current)
- ✅ Core Web3 integration
- ✅ Basic activity tracking
- ✅ Token rewards system
- ✅ Social features MVP
- ✅ Responsive design

### Phase 2 (Next)
- 🔄 Advanced AI insights
- 🔄 Mobile app development
- 🔄 NFT marketplace expansion
- 🔄 Cross-platform integrations
- 🔄 Advanced analytics

### Phase 3 (Future)
- 🔄 DAO governance
- 🔄 Metaverse integration
- 🔄 AR/VR fitness experiences
- 🔄 Global challenge events

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with Next.js and modern web technologies
- Web3 infrastructure powered by Ethereum ecosystem
- Community-driven development approach
- Open source contributions welcome

## 📞 Support

- **Discord**: [Join our community](https://discord.gg/fixie-run)
- **Twitter**: [@fixie_run](https://twitter.com/fixie_run)
- **Documentation**: [docs.fixie.run](https://docs.fixie.run)
- **Email**: support@fixie.run

---

**Built with ❤️ for the cycling community**

Transform your fitness journey with Web3 technology. Start riding, start earning! 🚴‍♀️💨
