# TerraGuardian 🌱

> **"Where Community Observations Meet AI Intelligence for Climate Action"**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![Status: MVP Development](https://img.shields.io/badge/Status-MVP%20Development-orange.svg)]()

Empowering communities worldwide to become active stewards of land health through accessible, AI-powered tools that make land restoration participatory, data-driven, and economically viable.

---

## 📖 Table of Contents

- [About](#about)
- [The Problem](#the-problem)
- [Our Solution](#our-solution)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Development](#development)
- [Contributing](#contributing)
- [Roadmap](#roadmap)
- [License](#license)
- [Contact](#contact)

---

## 🌍 About

TerraGuardian is a gamified, AI-powered progressive web application that enables communities to monitor, restore, and earn from degraded lands. By combining community observations with artificial intelligence, we're building a verification system for community-led restoration efforts that unlocks access to carbon markets and provides hyperlocal regenerative farming advice.

### Vision Statement

**"A world where every community member can contribute to reversing land degradation through accessible technology and be rewarded for their environmental stewardship."**

### Key Statistics

- **3.2 billion people** globally affected by land degradation
- **Target:** 500+ active users across 5 pilot communities (MVP)
- **Goal:** 5,000+ verified land health observations in first month
- **Impact:** 50+ hectares claimed for restoration

---

## 🎯 The Problem

### Challenges We're Addressing

1. **Top-down land management** misses on-the-ground realities
2. **Farmers lack accessible**, hyperlocal regenerative farming advice
3. **No verification systems** for community-led restoration efforts
4. **Communities can't access carbon markets** due to lack of credible data
5. **Limited connectivity** in rural areas prevents technology adoption

---

## 💡 Our Solution

TerraGuardian bridges these gaps through four core innovations:

### 1. 🎮 Gamified Land Monitoring

- Complete quests to document land health indicators
- Earn points, badges, and climb leaderboards
- AI-powered image validation using on-device TensorFlow Lite
- Offline-first design works without internet connectivity

### 2. 🤖 AI Regeneration Advisor

- Chat with Claude.ai for personalized farming advice
- Context-aware recommendations based on location, climate, and soil type
- Educational content tailored to your needs
- Available via app and WhatsApp (coming soon)

### 3. 📊 Impact Tracking & Verification

- Claim plots of land for restoration
- Document progress with before/after photos
- Satellite-based NDVI verification (coming soon)
- Calculate carbon sequestration potential

### 4. 💰 Path to Carbon Markets

- Credible data collection for carbon credit verification
- Community-owned impact metrics
- Future integration with carbon registries
- Economic incentives for land stewardship

---

## ✨ Features

### MVP Features (Current Development)

#### Quest System
- ✅ 5 quest types: Erosion, Crop Health, Water Quality, Vegetation, Degraded Land
- ✅ On-device AI image validation
- ✅ Points, badges, and leaderboard
- ✅ Offline photo capture with automatic sync
- ✅ Community Land Health Score

#### AI Advisor
- ✅ Claude.ai integration for natural language advice
- ✅ Context-aware recommendations
- ✅ Chat history and saved advice
- ⏳ WhatsApp integration (Phase 2)

#### Impact Dashboard
- ✅ Interactive plot claiming system
- ✅ Photo-based progress documentation
- ✅ Basic impact metrics (hectares, users, quests)
- ⏳ Satellite NDVI integration (Phase 2)
- ⏳ Carbon credit calculation (Phase 2)

### Coming Soon

- 🌐 Multi-language support (Swahili, French, Spanish)
- 📡 Satellite-based verification system
- 📱 WhatsApp bot integration
- 💳 Carbon credit marketplace integration
- 🏢 Government/NGO partnership portal
- 📈 Advanced analytics and reporting

---

## 🛠️ Tech Stack

### Frontend

- **Framework:** React 18+ with Vite
- **Styling:** Tailwind CSS 3.x
- **State Management:** React Context API + React Query
- **Maps:** Leaflet / Mapbox GL JS
- **Charts:** Recharts
- **Icons:** Lucide React
- **PWA:** Workbox for service workers
- **Offline Storage:** IndexedDB (Dexie.js)

### Backend

- **Platform:** Supabase (PostgreSQL + Auth + Storage + Realtime)
- **Database:** PostgreSQL 14+ with PostGIS
- **Authentication:** Supabase Auth (JWT)
- **File Storage:** Supabase Storage
- **Edge Functions:** Deno runtime

### AI & ML

- **LLM:** Claude Sonnet 4.5 (Anthropic)
- **Computer Vision:** TensorFlow.js / TensorFlow Lite
- **Image Classification:** MobileNetV2

### External Services

- **Satellite Imagery:** Sentinel Hub API (Phase 2)
- **Weather Data:** OpenWeatherMap API
- **Messaging:** Twilio / WhatsApp Business API (Phase 2)

### DevOps

- **Hosting:** Vercel / Netlify
- **CI/CD:** GitHub Actions
- **Monitoring:** Sentry
- **Analytics:** Plausible / PostHog

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ LTS
- **npm** or **pnpm** v8+
- **Git** v2.30+
- **Supabase account** (free tier)
- **Anthropic API key** (for Claude.ai)

### Quick Start (5 Minutes)

```bash
# 1. Clone the repository
git clone https://github.com/vikkirkobane/earthscribe-hub.git
cd earthscribe-hub

# 2. Install dependencies
npm install

# 3. Copy environment template
cp .env.example .env.local

# 4. Add your API keys to .env.local
# (See Environment Variables section below)

# 5. Initialize database
npm run db:init

# 6. Start development server
npm run dev

# 7. Open browser to http://localhost:5173
```

### Environment Variables

Create a `.env.local` file with the following:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# Claude AI Configuration
VITE_CLAUDE_API_KEY=sk-ant-api03-your-key-here
VITE_CLAUDE_MODEL=claude-sonnet-4-5-20250929

# Weather API
VITE_OPENWEATHER_API_KEY=your_api_key

# App Configuration
VITE_APP_ENV=development
VITE_APP_URL=http://localhost:5173
```

### Required Accounts

1. **Supabase** - [Sign up](https://supabase.com)
   - Free tier: 500MB database, 1GB storage
   
2. **Anthropic** - [Sign up](https://console.anthropic.com)
   - $5 free credit, then pay-as-you-go
   
3. **OpenWeatherMap** - [Sign up](https://openweathermap.org/api)
   - Free tier: 60 calls/minute

---

## 📁 Project Structure

```
earthscribe-hub/
├── docs/                       # Documentation
│   ├── PRD.md                  # Product Requirements
│   ├── CLAUDE.md               # Development guide
│   ├── PLANNING.md             # Project planning
│   └── API.md                  # API documentation
├── public/                     # Static assets
│   ├── models/                 # TensorFlow models
│   ├── icons/                  # App icons
│   └── manifest.json           # PWA manifest
├── src/                        # Source code
│   ├── components/             # React components
│   │   ├── common/             # Reusable components
│   │   ├── quests/             # Quest features
│   │   ├── advisor/            # AI Advisor
│   │   ├── plots/              # Plot management
│   │   └── dashboard/          # Impact dashboard
│   ├── contexts/               # React contexts
│   ├── hooks/                  # Custom hooks
│   ├── services/               # API services
│   │   ├── supabase.js         # Supabase client
│   │   ├── claude.js           # Claude AI service
│   │   └── tensorflow.js       # TF Lite service
│   ├── utils/                  # Utility functions
│   ├── styles/                 # Global styles
│   ├── App.jsx                 # Root component
│   └── main.jsx                # Entry point
├── supabase/                   # Supabase configuration
│   ├── migrations/             # Database migrations
│   └── functions/              # Edge functions
├── tests/                      # Test files
├── .env.example                # Environment template
├── package.json                # Dependencies
└── vite.config.js              # Vite configuration
```

---

## 💻 Development

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build

# Database
npm run db:init          # Initialize database
npm run db:migrate       # Run migrations
npm run db:reset         # Reset database

# Testing
npm run test             # Run unit tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Generate coverage report
npm run test:e2e         # Run E2E tests

# Code Quality
npm run lint             # Run ESLint
npm run format           # Format with Prettier
npm run type-check       # Check types (if using TypeScript)
```

### Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, readable code
   - Follow existing patterns
   - Add tests for new features

3. **Test your changes**
   ```bash
   npm run test
   npm run lint
   ```

4. **Commit with conventional commits**
   ```bash
   git commit -m "feat: add new quest type"
   ```

5. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

### Coding Standards

- **ESLint** configuration for code quality
- **Prettier** for consistent formatting
- **Conventional Commits** for clear history
- **JSDoc** comments for complex functions
- **React Hook** best practices

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Ways to Contribute

- 🐛 **Report bugs** - Create an issue with reproduction steps
- 💡 **Suggest features** - Share your ideas for improvements
- 📝 **Improve documentation** - Help make our docs clearer
- 🔧 **Submit PRs** - Fix bugs or add features
- 🌍 **Translate** - Help make TerraGuardian multilingual
- 🎨 **Design** - Contribute UI/UX improvements

### Development Process

1. Check [open issues](https://github.com/vikkirkobane/earthscribe-hub/issues)
2. Comment on an issue to claim it
3. Fork the repository
4. Create your feature branch
5. Write tests for your changes
6. Submit a pull request

### Code of Conduct

This project adheres to a [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you agree to uphold this code.

---

## 🗺️ Roadmap

### Phase 1: MVP (Weeks 1-8) - Current

- [x] Project setup and infrastructure
- [x] Authentication system
- [ ] Quest system with AI validation
- [ ] AI advisor chatbot
- [ ] Plot claiming and tracking
- [ ] Impact dashboard
- [ ] Launch with 5 pilot communities

### Phase 2: Enhancement (Months 3-4)

- [ ] Satellite NDVI integration
- [ ] WhatsApp bot
- [ ] Multi-language support
- [ ] Advanced analytics

### Phase 3: Scale (Months 5-6)

- [ ] Carbon credit calculation
- [ ] Marketplace integration
- [ ] Government/NGO portal
- [ ] White-label capabilities

### Phase 4: Enterprise (Months 7-12)

- [ ] API for third-party integrations
- [ ] Advanced verification systems
- [ ] Partnership management
- [ ] Global expansion

---

## 📊 Success Metrics (MVP Goals)

- **500+ active users** across 5 pilot communities
- **5,000+ verified quest submissions**
- **70%+ user retention** after 30 days
- **50+ hectares claimed** for restoration
- **Net Promoter Score (NPS) > 50**
- **<3 second app load time**
- **Offline functionality** for all core features

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Contact

- **Website:** [terraguardian.org](https://terraguardian.netlify.app/)
- **Email:** victorchogo37@gmail.com
- **GitHub:** [@vikkirkobane](https://github.com/vikkirkobane)
- **Issues:** [GitHub Issues](https://github.com/vikkirkobane/earthscribe-hub/issues)

---

## 🙏 Acknowledgments

- **Anthropic** for Claude.ai API access
- **Supabase** for backend infrastructure
- **Sentinel Hub** for satellite imagery
- **Open-source community** for amazing tools
- **Pilot communities** for feedback and testing

---

## 📚 Additional Resources

- [Product Requirements Document](docs/PRD.md)
- [Development Guide](docs/CLAUDE.md)
- [Project Planning](docs/PLANNING.md)
- [API Documentation](docs/API.md)
- [Architecture Overview](docs/ARCHITECTURE.md)

---

<div align="center">

**Let's build a sustainable future together! 🌱🌍**

[Report Bug](https://github.com/vikkirkobane/earthscribe-hub/issues) · [Request Feature](https://github.com/vikkirkobane/earthscribe-hub/issues) · [Documentation](docs/)

Made with ❤️ by the TerraGuardian team

</div>
