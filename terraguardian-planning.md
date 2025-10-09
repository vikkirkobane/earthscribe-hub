# TerraGuardian Project Planning

> **Repository:** https://github.com/vikkirkobane/earthscribe-hub.git  
> **Project Status:** Planning & Architecture Phase  
> **Target Launch:** MVP in 8 weeks  
> **Last Updated:** October 9, 2025

---

## Table of Contents

1. [Vision & Mission](#vision--mission)
2. [Project Objectives](#project-objectives)
3. [Architecture Overview](#architecture-overview)
4. [Technology Stack](#technology-stack)
5. [Required Tools & Services](#required-tools--services)
6. [Development Environment Setup](#development-environment-setup)
7. [Project Structure](#project-structure)
8. [Implementation Phases](#implementation-phases)
9. [Team & Roles](#team--roles)
10. [Timeline & Milestones](#timeline--milestones)
11. [Success Metrics](#success-metrics)
12. [Risk Management](#risk-management)
13. [Getting Started](#getting-started)

---

## Vision & Mission

### Vision Statement
**"A world where every community member can contribute to reversing land degradation through accessible technology and be rewarded for their environmental stewardship."**

### Mission Statement
**"To empower communities worldwide to become active stewards of land health by providing accessible, AI-powered tools that make land restoration participatory, data-driven, and economically viable."**

### Product Tagline
**"Where Community Observations Meet AI Intelligence for Climate Action"**

### Core Problem We're Solving

**The Challenge:**
- 3.2 billion people globally affected by land degradation
- Top-down land management misses on-the-ground realities
- Farmers lack accessible, hyperlocal regenerative farming advice
- No verification systems for community-led restoration efforts
- Communities can't access carbon markets due to lack of credible data

**Our Solution:**
TerraGuardian bridges these gaps through:
1. **Participatory:** Gamification drives sustained community engagement
2. **Intelligent:** Multi-AI system provides personalized regeneration guidance
3. **Verifiable:** Satellite data enables carbon credit verification
4. **Accessible:** Offline-first mobile app works in low-connectivity areas

---

## Project Objectives

### Primary Objectives (MVP - 8 Weeks)

#### 1. Gamified Land Monitoring
- ✅ Implement 5 quest types (erosion, crop health, water, vegetation, degraded land)
- ✅ On-device AI image validation using TensorFlow Lite
- ✅ Points, badges, and leaderboard system
- ✅ Offline photo capture with automatic sync
- ✅ Community Land Health Score

#### 2. AI Regeneration Advisor
- ✅ Claude.ai integration for natural language advice
- ✅ Context-aware recommendations (location, climate, soil type)
- ✅ Educational content generation
- ✅ Chat history and saved advice
- ⏳ WhatsApp integration (Phase 2)

#### 3. Impact Tracking & Verification
- ✅ Interactive plot claiming system
- ✅ Photo-based progress documentation
- ✅ Basic impact dashboard (hectares, users, quests)
- ⏳ Satellite NDVI integration (Phase 2)
- ⏳ Carbon credit calculation (Phase 2)

### Secondary Objectives (Post-MVP)

- Multi-language support (Swahili, French, Spanish)
- Advanced analytics and reporting
- WhatsApp bot integration
- Satellite-based verification system
- Carbon credit marketplace integration
- Government/NGO partnership portal

### Success Criteria (MVP Launch)

- [ ] 500+ active users across 5 pilot communities
- [ ] 5,000+ verified quest submissions
- [ ] 70%+ user retention after 30 days
- [ ] 50+ hectares claimed for restoration
- [ ] Net Promoter Score (NPS) > 50
- [ ] <3 second app load time
- [ ] Offline functionality for all core features

---

## Architecture Overview

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      MOBILE CLIENT (PWA)                         │
│  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓  │
│  ┃  PRESENTATION LAYER                                        ┃  │
│  ┃  ┌────────────┐  ┌────────────┐  ┌────────────┐          ┃  │
│  ┃  │ Quest Feed │  │ AI Advisor │  │ Impact     │          ┃  │
│  ┃  │ Component  │  │ Component  │  │ Dashboard  │          ┃  │
│  ┃  └────────────┘  └────────────┘  └────────────┘          ┃  │
│  ┃  ┌────────────┐  ┌────────────┐  ┌────────────┐          ┃  │
│  ┃  │ Plot Map   │  │ Profile    │  │ Leaderboard│          ┃  │
│  ┃  └────────────┘  └────────────┘  └────────────┘          ┃  │
│  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛  │
│  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓  │
│  ┃  CLIENT SERVICES LAYER                                    ┃  │
│  ┃  ┌────────────┐  ┌────────────┐  ┌────────────┐          ┃  │
│  ┃  │ Camera     │  │ IndexedDB  │  │ TensorFlow │          ┃  │
│  ┃  │ Service    │  │ (Offline)  │  │ Lite       │          ┃  │
│  ┃  └────────────┘  └────────────┘  └────────────┘          ┃  │
│  ┃  ┌────────────┐  ┌────────────┐  ┌────────────┐          ┃  │
│  ┃  │ Geolocation│  │ Service    │  │ State Mgmt │          ┃  │
│  ┃  │ Service    │  │ Worker     │  │ (Context)  │          ┃  │
│  ┃  └────────────┘  └────────────┘  └────────────┘          ┃  │
│  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     API GATEWAY LAYER                            │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  RESTful API (Express.js / Supabase Edge Functions)    │    │
│  │  - Authentication & Authorization                       │    │
│  │  - Rate Limiting & Caching                              │    │
│  │  - Request Validation                                   │    │
│  │  - Error Handling                                       │    │
│  └────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  SUPABASE    │    │  CLAUDE.AI   │    │  EXTERNAL    │
│   BACKEND    │    │     API      │    │   SERVICES   │
│              │    │              │    │              │
│ - PostgreSQL │    │ - Sonnet 4.5 │    │ - Sentinel   │
│ - Auth       │    │ - 200K ctx   │    │   Hub        │
│ - Storage    │    │ - Streaming  │    │ - OpenWeather│
│ - Realtime   │    │              │    │ - Twilio     │
│ - Functions  │    │              │    │              │
└──────────────┘    └──────────────┘    └──────────────┘
```

### Architecture Principles

1. **Offline-First:** All core features work without internet connectivity
2. **Progressive Enhancement:** Basic functionality first, enhanced features layer on top
3. **Mobile-First:** Optimized for mobile devices, scales up to desktop
4. **API-Driven:** Clear separation between frontend and backend
5. **Modular Design:** Components are self-contained and reusable
6. **Scalable Infrastructure:** Serverless architecture for automatic scaling
7. **Data Privacy:** User data encrypted, minimal collection, user-controlled

### Data Flow Architecture

```
User Action (e.g., Complete Quest)
    │
    ▼
┌─────────────────────┐
│  Client Component   │
│  (QuestSubmit)      │
└─────────────────────┘
    │
    ▼
┌─────────────────────┐
│  Local Processing   │
│  - Validate photo   │
│  - TF Lite AI       │
│  - Store in IDB     │
└─────────────────────┘
    │
    ▼
┌─────────────────────┐
│  Sync Queue         │
│  (When online)      │
└─────────────────────┘
    │
    ▼
┌─────────────────────┐
│  API Call           │
│  POST /api/quests   │
│  /:id/submit        │
└─────────────────────┘
    │
    ▼
┌─────────────────────┐
│  Supabase           │
│  - Store submission │
│  - Update points    │
│  - Trigger events   │
└─────────────────────┘
    │
    ▼
┌─────────────────────┐
│  AI Processing      │
│  - Claude advice    │
│  - Educational tips │
└─────────────────────┘
    │
    ▼
┌─────────────────────┐
│  Client Update      │
│  - Show success     │
│  - Update UI        │
│  - Sync state       │
└─────────────────────┘
```

---

## Technology Stack

### Frontend Technologies

#### Core Framework
```yaml
Framework: React 18+
Build Tool: Vite
Language: JavaScript (ES2022+) / TypeScript (optional)
Type Checking: PropTypes or TypeScript
```

#### UI & Styling
```yaml
CSS Framework: Tailwind CSS 3.x
Component Library: Custom components + shadcn/ui
Icons: Lucide React
Charts: Recharts
Maps: Leaflet or Mapbox GL JS
Animations: Framer Motion (optional)
```

#### State Management
```yaml
Global State: React Context API
Server State: React Query (TanStack Query)
Form State: React Hook Form
URL State: React Router
```

#### PWA & Offline
```yaml
Service Worker: Workbox
Offline Storage: IndexedDB (via Dexie.js)
Offline Sync: Custom sync queue
Cache Strategy: Network-first with fallback
```

#### AI & ML
```yaml
Computer Vision: TensorFlow.js / TensorFlow Lite
Image Processing: Browser Canvas API
Model Format: .tflite converted to .json
```

### Backend Technologies

#### Backend Platform
```yaml
Primary: Supabase (PostgreSQL + Auth + Storage + Realtime)
Database: PostgreSQL 14+
Authentication: Supabase Auth (JWT)
File Storage: Supabase Storage
Functions: Supabase Edge Functions (Deno)
```

#### AI Services
```yaml
LLM: Claude.ai API (Anthropic)
Model: Claude Sonnet 4.5
Context Window: 200K tokens
Response Format: JSON or markdown
Streaming: SSE (Server-Sent Events)
```

#### Geospatial Services
```yaml
Satellite Imagery: Sentinel Hub API / Google Earth Engine
NDVI Calculation: Custom algorithms
Map Data: OpenStreetMap
Geocoding: Nominatim or Mapbox
```

#### External APIs
```yaml
Weather: OpenWeatherMap API
Messaging: Twilio / WhatsApp Business API
Analytics: Plausible or PostHog
Error Tracking: Sentry
```

### DevOps & Infrastructure

#### Hosting & Deployment
```yaml
Frontend Hosting: Vercel or Netlify
Backend: Supabase Cloud
CDN: Cloudflare or Vercel Edge Network
Domain: Custom domain with SSL
```

#### CI/CD Pipeline
```yaml
Version Control: Git / GitHub
CI/CD: GitHub Actions
Testing: Run on every PR
Deployment: Automatic on merge to main
Environments: Development, Staging, Production
```

#### Monitoring & Logging
```yaml
Error Tracking: Sentry
Performance Monitoring: Web Vitals
Analytics: Plausible or PostHog
Logging: Supabase Logs + Custom logging
Uptime Monitoring: UptimeRobot or Better Uptime
```

### Development Tools

#### Code Quality
```yaml
Linter: ESLint
Formatter: Prettier
Git Hooks: Husky + lint-staged
Commit Convention: Conventional Commits
```

#### Testing
```yaml
Unit Testing: Vitest
Component Testing: React Testing Library
E2E Testing: Playwright or Cypress
Coverage: Built-in Vitest coverage
```

#### Documentation
```yaml
API Docs: Swagger / OpenAPI
Component Docs: Storybook (optional)
Code Comments: JSDoc
Architecture: Mermaid diagrams
```

---

## Required Tools & Services

### Development Tools (Local Setup)

#### Essential Software
- [ ] **Node.js** (v18+ LTS) - https://nodejs.org
- [ ] **npm** or **pnpm** (v8+) - Package manager
- [ ] **Git** (v2.30+) - Version control
- [ ] **VS Code** or **Cursor** - IDE
- [ ] **Postman** or **Insomnia** - API testing

#### Recommended VS Code Extensions
```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "PKief.material-icon-theme",
    "ms-vscode.vscode-typescript-next",
    "usernamehw.errorlens",
    "christian-kohler.path-intellisense",
    "dsznajder.es7-react-js-snippets"
  ]
}
```

#### Browser Extensions
- [ ] React Developer Tools
- [ ] Redux DevTools (if using Redux)
- [ ] Lighthouse
- [ ] axe DevTools (Accessibility)

### Cloud Services & APIs

#### Required Accounts (Free Tier Available)

##### 1. Supabase
```yaml
Purpose: Backend platform
Required For: Database, Auth, Storage, Realtime
Sign Up: https://supabase.com
Free Tier: Yes (500MB database, 1GB storage, 2GB bandwidth)
Setup:
  - Create project
  - Get API URL and anon key
  - Configure authentication providers
  - Set up storage buckets
```

##### 2. Anthropic (Claude.ai)
```yaml
Purpose: AI advisor and educational content
Required For: Natural language advice generation
Sign Up: https://console.anthropic.com
Free Tier: $5 credit (limited)
Pricing: Pay-as-you-go ($3-15 per million tokens)
Setup:
  - Create account
  - Generate API key
  - Set up billing (required after free credit)
```

##### 3. Sentinel Hub (Optional for MVP)
```yaml
Purpose: Satellite imagery and NDVI
Required For: Land degradation verification
Sign Up: https://www.sentinel-hub.com
Free Tier: Yes (trial with 10,000 requests)
Alternative: Google Earth Engine (free for research)
Setup:
  - Create account
  - Get client ID and secret
  - Configure OAuth
```

##### 4. OpenWeatherMap
```yaml
Purpose: Weather data for recommendations
Required For: Climate-aware farming advice
Sign Up: https://openweathermap.org/api
Free Tier: Yes (60 calls/minute, 1,000,000/month)
Setup:
  - Create account
  - Get API key
  - Enable required endpoints
```

##### 5. Vercel or Netlify
```yaml
Purpose: Frontend hosting
Required For: Production deployment
Sign Up: https://vercel.com or https://netlify.com
Free Tier: Yes (generous for hobby projects)
Setup:
  - Connect GitHub repository
  - Configure environment variables
  - Set up custom domain
```

#### Optional Services (Post-MVP)

##### 6. Twilio / WhatsApp Business
```yaml
Purpose: WhatsApp integration
Required For: Low-connectivity user access
Sign Up: https://www.twilio.com
Free Tier: Trial credits
Setup:
  - Create account
  - Set up WhatsApp sandbox
  - Configure webhook
```

##### 7. Sentry
```yaml
Purpose: Error tracking
Required For: Production monitoring
Sign Up: https://sentry.io
Free Tier: Yes (5K errors/month)
Setup:
  - Create project
  - Install SDK
  - Configure source maps
```

##### 8. Plausible Analytics
```yaml
Purpose: Privacy-friendly analytics
Required For: User behavior insights
Sign Up: https://plausible.io
Free Tier: 30-day trial
Alternative: PostHog (open-source)
```

### API Keys & Environment Variables

Create a `.env.local` file with the following:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# Claude AI Configuration
VITE_CLAUDE_API_KEY=sk-ant-api03-your-key-here
VITE_CLAUDE_MODEL=claude-sonnet-4-5-20250929

# Geospatial Services (Optional for MVP)
VITE_SENTINEL_HUB_CLIENT_ID=your_client_id
VITE_SENTINEL_HUB_CLIENT_SECRET=your_secret
VITE_GOOGLE_EARTH_ENGINE_KEY=your_ee_key

# Weather API
VITE_OPENWEATHER_API_KEY=your_api_key

# Messaging (Optional)
VITE_TWILIO_ACCOUNT_SID=your_sid
VITE_TWILIO_AUTH_TOKEN=your_token
VITE_WHATSAPP_BUSINESS_ID=your_business_id

# App Configuration
VITE_APP_ENV=development
VITE_APP_URL=http://localhost:5173
VITE_APP_VERSION=0.1.0

# Feature Flags
VITE_ENABLE_SATELLITE=false
VITE_ENABLE_WHATSAPP=false
VITE_ENABLE_ANALYTICS=false
```

---

## Development Environment Setup

### Quick Start (5 Minutes)

```bash
# 1. Clone the repository
git clone https://github.com/vikkirkobane/earthscribe-hub.git
cd earthscribe-hub

# 2. Install dependencies
npm install
# or
pnpm install

# 3. Copy environment template
cp .env.example .env.local

# 4. Edit .env.local with your API keys
# (Use your favorite editor)

# 5. Initialize Supabase
npm run db:init

# 6. Start development server
npm run dev

# 7. Open browser
# Navigate to http://localhost:5173
```

### Detailed Setup Steps

#### 1. Prerequisites Check

```bash
# Check Node.js version (should be 18+)
node --version

# Check npm version
npm --version

# Check Git version
git --version
```

#### 2. Supabase Setup

```bash
# Install Supabase CLI (optional but recommended)
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Push database schema
supabase db push

# Generate TypeScript types (optional)
supabase gen types typescript --project-id your-project-ref > src/types/supabase.ts
```

#### 3. Database Initialization

```sql
-- Run these SQL commands in Supabase SQL Editor

-- Enable PostGIS for geographic data
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create tables (see CLAUDE.md for full schema)
-- Run migrations from supabase/migrations/ folder
```

#### 4. Configure Authentication

In Supabase Dashboard:
1. Go to Authentication > Providers
2. Enable Email/Password
3. Enable Google OAuth (optional)
4. Configure redirect URLs
5. Set JWT expiry (15 minutes)

#### 5. Storage Setup

In Supabase Dashboard:
1. Go to Storage
2. Create bucket: `quest-photos`
3. Set permissions: Public read, authenticated write
4. Configure size limits (5MB per file)

#### 6. TensorFlow Model Setup

```bash
# Download pre-trained model
npm run download:model

# Or manually place model files in public/models/
# - model.json
# - group1-shard1of1.bin
```

#### 7. Verify Installation

```bash
# Run tests
npm run test

# Check linting
npm run lint

# Build for production (test)
npm run build

# Preview production build
npm run preview
```

---

## Project Structure

### Directory Organization

```
earthscribe-hub/
├── .github/                    # GitHub configuration
│   ├── workflows/              # CI/CD workflows
│   │   ├── ci.yml              # Continuous integration
│   │   ├── deploy.yml          # Deployment pipeline
│   │   └── tests.yml           # Automated testing
│   └── ISSUE_TEMPLATE/         # Issue templates
├── docs/                       # Documentation
│   ├── PRD.md                  # Product Requirements
│   ├── CLAUDE.md               # Development guide
│   ├── PLANNING.md             # This file
│   ├── API.md                  # API documentation
│   └── ARCHITECTURE.md         # Architecture details
├── public/                     # Static assets
│   ├── models/                 # TensorFlow models
│   │   ├── model.json
│   │   └── weights.bin
│   ├── icons/                  # App icons
│   ├── images/                 # Static images
│   └── manifest.json           # PWA manifest
├── src/                        # Source code
│   ├── assets/                 # Dynamic assets
│   │   ├── images/
│   │   └── videos/
│   ├── components/             # React components
│   │   ├── common/             # Reusable components
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Modal.jsx
│   │   │   └── LoadingSpinner.jsx
│   │   ├── layout/             # Layout components
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── Navigation.jsx
│   │   ├── quests/             # Quest features
│   │   │   ├── QuestFeed.jsx
│   │   │   ├── QuestCard.jsx
│   │   │   ├── QuestDetail.jsx
│   │   │   ├── QuestSubmit.jsx
│   │   │   └── QuestValidation.jsx
│   │   ├── advisor/            # AI Advisor
│   │   │   ├── ChatInterface.jsx
│   │   │   ├── MessageList.jsx
│   │   │   ├── InputBox.jsx
│   │   │   └── AdviceCard.jsx
│   │   ├── plots/              # Plot management
│   │   │   ├── PlotMap.jsx
│   │   │   ├── PlotClaim.jsx
│   │   │   ├── PlotDetail.jsx
│   │   │   └── PlotProgress.jsx
│   │   ├── dashboard/          # Impact dashboard
│   │   │   ├── ImpactDashboard.jsx
│   │   │   ├── MetricCard.jsx
│   │   │   ├── ChartWidget.jsx
│   │   │   └── Leaderboard.jsx
│   │   └── profile/            # User profile
│   │       ├── ProfileView.jsx
│   │       ├── BadgeDisplay.jsx
│   │       ├── StatsOverview.jsx
│   │       └── Settings.jsx
│   ├── contexts/               # React contexts
│   │   ├── AuthContext.jsx
│   │   ├── QuestContext.jsx
│   │   └── ThemeContext.jsx
│   ├── hooks/                  # Custom hooks
│   │   ├── useAuth.js
│   │   ├── useQuests.js
│   │   ├── useGeolocation.js
│   │   ├── useCamera.js
│   │   ├── useOfflineSync.js
│   │   └── useImpact.js
│   ├── services/               # API services
│   │   ├── api/                # API clients
│   │   │   ├── client.js       # Base API client
│   │   │   ├── auth.js         # Auth endpoints
│   │   │   ├── quests.js       # Quest endpoints
│   │   │   ├── plots.js        # Plot endpoints
│   │   │   └── impact.js       # Impact endpoints
│   │   ├── supabase.js         # Supabase client
│   │   ├── claude.js           # Claude AI service
│   │   ├── tensorflow.js       # TF Lite service
│   │   ├── gis.js              # Geospatial service
│   │   ├── weather.js          # Weather API service
│   │   └── storage.js          # Local storage service
│   ├── utils/                  # Utility functions
│   │   ├── calculations.js     # Math utilities
│   │   ├── formatters.js       # Data formatters
│   │   ├── validators.js       # Input validation
│   │   ├── constants.js        # App constants
│   │   └── helpers.js          # General helpers
│   ├── styles/                 # Global styles
│   │   ├── index.css           # Main stylesheet
│   │   ├── tailwind.css        # Tailwind imports
│   │   └── variables.css       # CSS variables
│   ├── types/                  # TypeScript types (if using TS)
│   │   ├── supabase.ts
│   │   ├── quest.ts
│   │   └── user.ts
│   ├── App.jsx                 # Root component
│   ├── main.jsx                # Entry point
│   └── router.jsx              # Route configuration
├── supabase/                   # Supabase configuration
│   ├── migrations/             # Database migrations
│   │   ├── 001_initial_schema.sql
│   │   ├── 002_add_plots.sql
│   │   └── 003_add_badges.sql
│   ├── functions/              # Edge functions
│   │   ├── claude-advisor/
│   │   └── impact-calculator/
│   └── config.toml             # Supabase config
├── tests/                      # Test files
│   ├── unit/                   # Unit tests
│   ├── integration/            # Integration tests
│   └── e2e/                    # E2E tests
├── .env.example                # Environment template
├── .eslintrc.json              # ESLint config
├── .gitignore                  # Git ignore rules
├── .prettierrc                 # Prettier config
├── index.html                  # HTML entry
├── package.json                # Dependencies
├── postcss.config.js           # PostCSS config
├── tailwind.config.js          # Tailwind config
├── vite.config.js              # Vite config
└── README.md                   # Project readme
```

### File Naming Conventions

```yaml
Components: PascalCase (e.g., QuestCard.jsx)
Utilities: camelCase (e.g., formatDate.js)
Constants: UPPER_SNAKE_CASE (e.g., API_ENDPOINTS.js)
Styles: kebab-case (e.g., quest-card.css)
Tests: *.test.js or *.spec.js
Types: PascalCase (e.g., User.ts)
```

---

## Implementation Phases

### Phase 0: Project Setup (Week 1)

**Objective:** Establish development environment and foundation

**Tasks:**
- [x] Initialize Git repository
- [x] Set up project structure
- [x] Configure Vite + React
- [x] Install core dependencies
- [x] Set up Supabase project
- [x] Create environment configuration
- [x] Set up CI/CD pipeline
- [x] Create documentation files (CLAUDE.md, PLANNING.md)

**Deliverables:**
- Working development environment
- Deployed "Hello World" to staging
- Documentation skeleton

**Team:** Full team (1 week)

---

### Phase 1: Authentication & Core UI (Week 2)

**Objective:** Build authentication system and basic UI components

**Tasks:**
- [ ] Implement Supabase authentication
  - [ ] Email/password signup and login
  - [ ] Google OAuth integration
  - [ ] Session management
  - [ ] Protected routes
- [ ] Create layout components
  - [ ] Header with navigation
  - [ ] Sidebar (mobile drawer)
  - [ ] Footer
- [ ] Build common components
  - [ ] Button, Card, Modal
  - [ ] Form inputs and validation
  - [ ] Loading states and spinners
- [ ] Set up routing (React Router)
- [ ] Implement dark mode toggle
- [ ] Create user profile page

**Deliverables:**
- Working auth system
- Basic UI component library
- User can sign up, log in, and view profile

**Team:**
- Frontend Developer (full week)
- Backend Developer (2 days)

---

### Phase 2: Quest System (Weeks 3-4)

**Objective:** Implement gamified land monitoring with AI validation

#### Week 3: Quest Infrastructure

**Tasks:**
- [ ] Database setup for quests
  - [ ] Create quest schema
  - [ ] Seed sample quests
  - [ ] Create submissions table
- [ ] Build Quest Feed component
  - [ ] List available quests
  - [ ] Filter by location and type
  - [ ] Quest card design
- [ ] Implement camera functionality
  - [ ] Photo capture with preview
  - [ ] Geolocation tagging
  - [ ] Image compression
- [ ] Create offline storage
  - [ ] IndexedDB setup with Dexie
  - [ ] Queue system for pending submissions
  - [ ] Sync mechanism

**Deliverables:**
- Quest feed showing available quests
- Camera working with photo capture
- Offline storage functioning

#### Week 4: AI Validation & Gamification

**Tasks:**
- [ ] Integrate TensorFlow Lite
  - [ ] Load pre-trained model
  - [ ] On-device image classification
  - [ ] Validation logic per quest type
  - [ ] Confidence scoring
- [ ] Implement points system
  - [ ] Award points on validation
  - [ ] Update user score
  - [ ] Track streaks
- [ ] Create badge system
  - [ ] Define badge criteria
  - [ ] Award badges automatically
  - [ ] Display earned badges
- [ ] Build quest submission flow
  - [ ] Submit with validation
  - [ ] Show results and feedback
  - [ ] Unlock educational content
- [ ] Create leaderboard
  - [ ] Community rankings
  - [ ] Global rankings
  - [ ] Update in real-time

**Deliverables:**
- Complete quest submission workflow
- Working AI validation
- Points, badges, and leaderboard functional
- Educational content unlocks

**Team:**
- Frontend Developer (2 weeks)
- ML Engineer (1 week for TF integration)
- Backend Developer (1 week)

---

### Phase 3: AI Regeneration Advisor (Week 5)

**Objective:** Build Claude.ai-powered advice system

**Tasks:**
- [ ] Set up Claude API integration
  - [ ] Create API service wrapper
  - [ ] Implement prompt templates
  - [ ] Add context injection (location, season, soil)
  - [ ] Error handling and fallbacks
- [ ] Build chat interface
  - [ ] Message list component
  - [ ] Input box with send button
  - [ ] Typing indicators
  - [ ] Streaming responses (SSE)
- [ ] Implement chat history
  - [ ] Store conversations in database
  - [ ] Load previous chats
  - [ ] Search functionality
- [ ] Create advice categories
  - [ ] Soil health
  - [ ] Native species
  - [ ] Seasonal planning
  - [ ] Erosion control
- [ ] Build educational content system
  - [ ] Generate content from Claude
  - [ ] Store in database
  - [ ] Display in cards
  - [ ] Link to relevant quests
- [ ] Add save/bookmark functionality

**Deliverables:**
- Working AI chatbot
- Context-aware advice generation
- Chat history and saved advice
- Educational content library

**Team:**
- Frontend Developer (3 days)
- Backend Developer (2 days for API setup)
- Product Manager (prompts and content strategy)

---

### Phase 4: Plot Management & Impact Tracking (Week 6)

**Objective:** Enable land claiming and progress tracking

**Tasks:**
- [ ] Set up mapping infrastructure
  - [ ] Integrate Leaflet/Mapbox
  - [ ] Display user location
  - [ ] Load map tiles
- [ ] Implement plot claiming
  - [ ] Draw polygon on map
  - [ ] Calculate area
  - [ ] Capture baseline data
  - [ ] Store plot in database
- [ ] Create plot detail view
  - [ ] Show plot info and photos
  - [ ] Display restoration plan
  - [ ] Progress timeline
- [ ] Build progress tracking
  - [ ] Upload progress photos
  - [ ] Timestamped updates
  - [ ] Before/after comparison
- [ ] Implement impact calculations
  - [ ] Hectares restored
  - [ ] CO2 sequestration estimates
  - [ ] Biodiversity index
  - [ ] Active guardians count
- [ ] Create impact dashboard
  - [ ] Metric cards
  - [ ] Charts (Recharts)
  - [ ] Community stats
  - [ ] Personal stats

**Deliverables:**
- Interactive map with plot claiming
- Plot management system
- Impact dashboard with metrics
- Basic before/after tracking

**Team:**
- Frontend Developer (4 days)
- Backend Developer (2 days)
- GIS Specialist (1 day for consultation)

---

### Phase 5: Testing & Polish (Week 7)

**Objective:** Test all features, fix bugs, optimize performance

**Tasks:**
- [ ] Unit testing
  - [ ] Test utility functions
  - [ ] Test API services
  - [ ] Test calculations
- [ ] Integration testing
  - [ ] Test user flows
  - [ ] Test API interactions
  - [ ] Test offline sync
- [ ] E2E testing
  - [ ] Complete quest flow
  - [ ] Chat with AI advisor
  - [ ] Claim and track plot
- [ ] Performance optimization
  - [ ] Reduce bundle size
  - [ ] Optimize images
  - [ ] Lazy load components
  - [ ] Improve load times
- [ ] Accessibility audit
  - [ ] Keyboard navigation
  - [ ] Screen reader support
  - [ ] ARIA labels
  - [ ] Color contrast
- [ ] Mobile optimization
  - [ ] Test on real devices
  - [ ] Touch interactions
  - [ ] Responsive layouts
- [ ] Browser compatibility
  - [ ] Chrome, Firefox, Safari
  - [ ] iOS Safari, Android Chrome
- [ ] Bug fixes
  - [ ] Address critical bugs
  - [ ] Fix UI issues
  - [ ] Resolve edge cases

**Deliverables:**
- 80%+ test coverage
- <3s load time
- All critical bugs fixed
- Accessible and mobile-optimized

**Team:**
- Full team (1 week)
- QA Tester (if available)

---

### Phase 6: Pilot Preparation & Launch (Week 8)

**Objective:** Prepare for pilot launch with real users

**Tasks:**
- [ ] User onboarding flow
  - [ ] Welcome screen
  - [ ] Interactive tutorial
  - [ ] First quest guidance
- [ ] Help and support
  - [ ] FAQ section
  - [ ] Help tooltips
  - [ ] Contact support
- [ ] Create demo data
  - [ ] Sample quests
  - [ ] Example plots
  - [ ] Community stats
- [ ] Set up analytics
  - [ ] User behavior tracking
  - [ ] Error tracking (Sentry)
  - [ ] Performance monitoring
- [ ] Create marketing materials
  - [ ] Landing page
  - [ ] Demo video (3 min)
  - [ ] Screenshots
  - [ ] Social media content
- [ ] Pilot community setup
  - [ ] Identify 5 pilot communities
  - [ ] Recruit local champions
  - [ ] Schedule training sessions
- [ ] Deployment to production
  - [ ] Configure production environment
  - [ ] Set up custom domain
  - [ ] SSL certificates
  - [ ] Final testing on production
- [ ] Soft launch
  - [ ] Launch to pilot communities
  - [ ] Monitor closely
  - [ ] Gather feedback
  - [ ] Iterate rapidly

**Deliverables:**
- Production-ready application
- Onboarding flow complete
- 5 pilot communities onboarded
- Marketing materials ready
- Analytics and monitoring active

**Team:**
- Full team (1 week)
- Community Manager
- Marketing/Communications

---

### Post-MVP Roadmap

#### Phase 7: Satellite Integration (Months 3-4)

**Features:**
- Sentinel Hub API integration
- NDVI calculation and visualization
- Quarterly verification reports
- Before/after satellite comparisons

#### Phase 8: WhatsApp Integration (Month 4)

**Features:**
- WhatsApp bot setup
- Natural language processing
- Photo submission via WhatsApp
- Advice delivery through messaging

#### Phase 9: Advanced Features (Months 5-6)

**Features:**
- Multi-language support
- Voice input for questions
- Advanced analytics dashboard
- Carbon credit calculation
- Export impact reports (PDF)

#### Phase 10: Scale & Partnerships (Months 7-12)

**Features:**
- Government/NGO portal
- White-label capabilities
- API for third-party integrations
- Carbon credit marketplace
- Community marketplace for products

---

## Team & Roles

### Core Team (MVP)

#### Product Manager
**Responsibilities:**
- Define product vision and roadmap
- Prioritize features and user stories
- Coordinate between team members
- Manage stakeholder communications
- User research and feedback analysis

**Time Commitment:** Full-time (8 weeks)

#### Frontend Developer
**Responsibilities:**
- Build React components and UI
- Implement responsive design
- Integrate APIs and services
- Optimize performance
- PWA and offline functionality

**Skills Required:**
- React, JavaScript/TypeScript
- Tailwind CSS
- REST APIs
- Progressive Web Apps
- Mobile-first development

**Time Commitment:** Full-time (8 weeks)

#### Backend Developer
**Responsibilities:**
- Set up Supabase infrastructure
- Design database schema
- Create API endpoints
- Implement authentication
- Configure storage and security

**Skills Required:**
- PostgreSQL/SQL
- Supabase/Firebase
- API design
- Authentication systems
- Server-side logic

**Time Commitment:** Full-time (8 weeks)

#### ML/AI Engineer
**Responsibilities:**
- Integrate TensorFlow Lite
- Fine-tune image classification model
- Implement Claude AI integration
- Optimize on-device inference
- Create AI prompt templates

**Skills Required:**
- TensorFlow/PyTorch
- Computer vision
- LLM integration
- Model optimization
- Python and JavaScript

**Time Commitment:** Part-time (3 weeks total, distributed)

#### Designer (UI/UX)
**Responsibilities:**
- Create design system
- Design user interfaces
- User flow diagrams
- Prototype key interactions
- Usability testing

**Skills Required:**
- Figma/Sketch
- Mobile design
- Design systems
- User research
- Accessibility

**Time Commitment:** Part-time (2 weeks upfront, ongoing feedback)

### Extended Team (Post-MVP)

- **Community Manager:** User engagement, training, support
- **GIS Specialist:** Satellite data, NDVI analysis
- **DevOps Engineer:** Infrastructure, monitoring, scaling
- **QA Tester:** Testing, bug reporting, quality assurance
- **Technical Writer:** Documentation, user guides
- **Marketing Lead:** Go-to-market, partnerships

---

## Timeline & Milestones

### 8-Week MVP Timeline

```
Week 1: Project Setup ████████████████████ 100%
├─ Environment setup
├─ Repository initialization
├─ Documentation creation
└─ CI/CD pipeline

Week 2: Auth & Core UI ████████████████████ 100%
├─ Authentication system
├─ Basic components
├─ Routing setup
└─ User profiles

Week 3: Quest Infrastructure ██████████░░░░░░░░░░ 50%
├─ Database schema
├─ Quest feed
├─ Camera integration
└─ Offline storage

Week 4: AI & Gamification ░░░░░░░░░░░░░░░░░░░░ 0%
├─ TensorFlow integration
├─ Points and badges
├─ Leaderboard
└─ Quest submissions

Week 5: AI Advisor ░░░░░░░░░░░░░░░░░░░░ 0%
├─ Claude API integration
├─ Chat interface
├─ Educational content
└─ Chat history

Week 6: Plots & Impact ░░░░░░░░░░░░░░░░░░░░ 0%
├─ Map integration
├─ Plot claiming
├─ Impact calculations
└─ Dashboard

Week 7: Testing & Polish ░░░░░░░░░░░░░░░░░░░░ 0%
├─ Unit tests
├─ E2E tests
├─ Performance optimization
└─ Bug fixes

Week 8: Launch Preparation ░░░░░░░░░░░░░░░░░░░░ 0%
├─ Onboarding flow
├─ Marketing materials
├─ Pilot setup
└─ Production deployment
```

### Key Milestones

| Milestone | Date | Status | Description |
|-----------|------|--------|-------------|
| **M0: Project Kickoff** | Week 1 | ✅ Complete | Environment setup, documentation |
| **M1: Authentication** | End Week 2 | 🟡 In Progress | Users can sign up and log in |
| **M2: First Quest** | End Week 4 | ⏳ Planned | Users can complete their first quest |
| **M3: AI Advisor Live** | End Week 5 | ⏳ Planned | Users can chat with Claude |
| **M4: Plot Claiming** | End Week 6 | ⏳ Planned | Users can claim and track plots |
| **M5: Feature Complete** | End Week 7 | ⏳ Planned | All MVP features implemented |
| **M6: MVP Launch** | End Week 8 | ⏳ Planned | Live with 5 pilot communities |

### Weekly Standup Schedule

**When:** Every Monday, 10:00 AM
**Duration:** 30 minutes
**Format:**
- What did you complete last week?
- What are you working on this week?
- Any blockers or concerns?
- Demo time (show your work)

### Sprint Reviews

**When:** Every 2 weeks (End of Week 2, 4, 6, 8)
**Duration:** 1 hour
**Attendees:** Full team + stakeholders
**Agenda:**
- Demo completed features
- Review metrics and progress
- Gather feedback
- Plan next sprint

---

## Success Metrics

### Technical Metrics

#### Performance
- **Page Load Time:** <3 seconds (target: <2s)
- **Time to Interactive:** <5 seconds (target: <3s)
- **Lighthouse Score:** >90 (Performance, Accessibility, Best Practices, SEO)
- **Bundle Size:** <500KB gzipped
- **API Response Time:** <500ms (p95)

#### Reliability
- **Uptime:** >99.5% (target: 99.9%)
- **Error Rate:** <1% of requests
- **Successful Sync Rate:** >98% for offline submissions
- **AI Validation Accuracy:** >85%

#### Quality
- **Test Coverage:** >80%
- **Critical Bugs:** 0 at launch
- **High Priority Bugs:** <5 at launch
- **Accessibility Score:** WCAG 2.1 AA compliant

### User Metrics

#### Engagement (30 Days Post-Launch)
- **Active Users:** 500+ (across 5 communities)
- **Daily Active Users (DAU):** 150+
- **DAU/MAU Ratio:** >30%
- **Average Session Duration:** >5 minutes
- **Sessions per User per Week:** >3

#### Retention
- **Day 1 Retention:** >80%
- **Day 7 Retention:** >60%
- **Day 30 Retention:** >40%
- **Churned Users:** <20% after 30 days

#### Feature Adoption
- **Quests Completed:** 5,000+ in first month
- **Quest Completion Rate:** >60%
- **AI Advisor Usage:** >50% of users interact
- **Plots Claimed:** >50 in first month
- **Users with Badges:** >70%

### Impact Metrics

#### Environmental Impact
- **Hectares Monitored:** 500+ hectares
- **Hectares Claimed for Restoration:** 50+ hectares
- **Quest Types Distributed:** Balanced across all 5 types
- **Community Participation Rate:** >30% of eligible adults

#### User Satisfaction
- **Net Promoter Score (NPS):** >50
- **App Store Rating:** >4.5 stars (if applicable)
- **User Feedback Sentiment:** >80% positive
- **Feature Satisfaction:** >4/5 average rating

#### Business Metrics
- **Cost per Acquisition (CPA):** <$5 (organic growth)
- **User Acquisition Rate:** 50+ new users per week
- **Community Expansion:** 2+ new communities expressing interest
- **Partnership Inquiries:** 3+ NGOs/organizations interested

---

## Risk Management

### Technical Risks

#### Risk 1: AI Model Accuracy Issues
**Impact:** High | **Probability:** Medium

**Risk Description:**
TensorFlow Lite model may have low accuracy on real-world images from diverse environments.

**Mitigation Strategies:**
- Start with pre-trained models (MobileNetV2)
- Collect diverse training data during pilot
- Implement confidence thresholds (>70%)
- Add manual review option for edge cases
- Continuous model improvement with user feedback

**Contingency Plan:**
- Fall back to manual validation by community admins
- Partner with agricultural experts for validation
- Reduce validation strictness temporarily

---

#### Risk 2: Offline Sync Failures
**Impact:** High | **Probability:** Medium

**Risk Description:**
Offline-first architecture may have sync conflicts or data loss issues.

**Mitigation Strategies:**
- Extensive offline testing before launch
- Implement robust queue system
- Add conflict resolution logic
- Provide clear sync status indicators
- Regular automated sync attempts

**Contingency Plan:**
- Manual data recovery tools
- Export local data to JSON
- Support team can manually sync data

---

#### Risk 3: Claude API Costs
**Impact:** Medium | **Probability:** High

**Risk Description:**
High usage could lead to unexpected API costs, especially at scale.

**Mitigation Strategies:**
- Implement response caching
- Set per-user rate limits (10 queries/day free tier)
- Pre-generate common responses
- Use smaller token limits (500 tokens max)
- Monitor costs daily

**Contingency Plan:**
- Reduce context window size
- Switch to cheaper model (Claude Haiku)
- Implement pay-as-you-go tier for power users
- Partner with Anthropic for credits

---

#### Risk 4: Supabase Free Tier Limits
**Impact:** Medium | **Probability:** Medium

**Risk Description:**
May exceed free tier limits (500MB database, 1GB storage, 2GB bandwidth).

**Mitigation Strategies:**
- Image compression before upload
- Limit photo size to 2MB
- Use CDN for static assets
- Monitor usage weekly
- Upgrade plan when approaching limits

**Contingency Plan:**
- Upgrade to Pro plan ($25/month)
- Implement image cleanup (delete old photos)
- Move to different storage provider (S3)

---

### User Adoption Risks

#### Risk 5: Low User Engagement
**Impact:** High | **Probability:** Medium

**Risk Description:**
Users may not find the app engaging enough to use regularly.

**Mitigation Strategies:**
- Strong gamification (points, badges, leaderboards)
- Push notifications for reminders
- Community challenges and events
- Tangible rewards (carbon credits)
- Local champions to drive usage

**Contingency Plan:**
- Rapid iteration based on feedback
- Incentive programs (gift cards, prizes)
- Partnerships for additional benefits
- In-person training and support

---

#### Risk 6: Technical Barriers
**Impact:** Medium | **Probability:** High

**Risk Description:**
Target users may have old smartphones, limited data, or low technical literacy.

**Mitigation Strategies:**
- Offline-first design
- Lightweight app (<5MB initial load)
- Simple, intuitive UI
- Visual instructions over text
- In-person training sessions

**Contingency Plan:**
- Create simplified "lite" version
- WhatsApp integration for basic features
- SMS-based interactions
- Community kiosks with tablets

---

### Partnership & Market Risks

#### Risk 7: Regulatory Compliance
**Impact:** High | **Probability:** Low

**Risk Description:**
Data privacy regulations (GDPR, local laws) may require changes.

**Mitigation Strategies:**
- GDPR-compliant from day one
- Clear privacy policy and consent
- Data minimization
- User data control (export, delete)
- Regular compliance audits

**Contingency Plan:**
- Legal counsel on retainer
- Quick compliance updates
- Flexible architecture for changes
- Partner with local legal experts

---

#### Risk 8: Carbon Credit Market Changes
**Impact:** Medium | **Probability:** Medium

**Risk Description:**
Carbon credit market volatility or regulatory changes could affect monetization.

**Mitigation Strategies:**
- Diversified revenue model
- Multiple carbon registry partnerships
- Focus on immediate value (education, yields)
- Don't over-promise carbon revenue
- Build product value independent of carbon credits

**Contingency Plan:**
- Pivot to other monetization (subscriptions, grants)
- Focus on non-monetary impact
- Partner with alternative buyers
- Government/NGO funding

---

## Getting Started

### For New Developers

#### Day 1: Environment Setup
```bash
# 1. Clone and setup
git clone https://github.com/vikkirkobane/earthscribe-hub.git
cd earthscribe-hub
npm install

# 2. Create accounts
# - Supabase: https://supabase.com
# - Anthropic: https://console.anthropic.com
# - OpenWeatherMap: https://openweathermap.org

# 3. Configure environment
cp .env.example .env.local
# Edit .env.local with your API keys

# 4. Initialize database
npm run db:init

# 5. Start development
npm run dev
```

#### Day 2: Explore Codebase
1. Read `docs/CLAUDE.md` for technical overview
2. Review `src/components/` to understand UI structure
3. Check `src/services/` for API integrations
4. Run tests: `npm test`
5. Make a small change and create PR

#### Day 3: First Task
1. Pick a task from GitHub Issues
2. Create feature branch: `git checkout -b feature/your-feature`
3. Implement and test locally
4. Create pull request
5. Address review feedback

### For Project Managers

#### Week 1 Checklist
- [ ] Set up project management tool (GitHub Projects, Jira)
- [ ] Create initial backlog with user stories
- [ ] Schedule kickoff meeting with team
- [ ] Set up communication channels (Slack, Discord)
- [ ] Define sprint cadence (2-week sprints)
- [ ] Create project wiki/documentation
- [ ] Identify pilot communities and stakeholders

#### Ongoing Responsibilities
- Daily: Monitor team progress, unblock issues
- Weekly: Monday standup, update metrics dashboard
- Bi-weekly: Sprint planning and review
- Monthly: Stakeholder update, budget review

### For Designers

#### Design Deliverables Needed
1. **Week 1:**
   - Brand colors and typography
   - Logo and app icon
   - Component library (buttons, cards, inputs)

2. **Week 2:**
   - High-fidelity mockups for key screens
   - User flow diagrams
   - Mobile and desktop layouts

3. **Week 3-4:**
   - Quest submission flow designs
   - Gamification elements (badges, progress bars)
   - Illustration for empty states

4. **Week 5:**
   - Chat interface designs
   - Educational content cards
   - Onboarding flow designs

5. **Week 6:**
   - Map interface design
   - Impact dashboard layout
   - Data visualization components

---

## Appendix

### A. Glossary

- **NDVI:** Normalized Difference Vegetation Index - satellite-based vegetation health metric
- **MRV:** Monitoring, Reporting, Verification - framework for carbon credits
- **PWA:** Progressive Web App - web app that works like native app
- **Quest:** Gamified task where users document land health indicators
- **Plot:** Area of land claimed by user for restoration
- **Guardian:** Active TerraGuardian user contributing to land monitoring
- **Claude.ai:** Anthropic's large language model AI
- **TensorFlow Lite:** Lightweight ML framework for mobile devices
- **Supabase:** Open-source Firebase alternative for backend
- **IndexedDB:** Browser-based database for offline storage

### B. Useful Links

**Project Resources:**
- GitHub Repo: https://github.com/vikkirkobane/earthscribe-hub.git
- Documentation: `/docs` folder
- Figma Designs: [Link when available]
- Project Board: [Link when available]

**External Documentation:**
- React: https://react.dev
- Vite: https://vitejs.dev
- Tailwind CSS: https://tailwindcss.com
- Supabase: https://supabase.com/docs
- Claude API: https://docs.anthropic.com
- TensorFlow.js: https://www.tensorflow.org/js
- Leaflet: https://leafletjs.com

**Learning Resources:**
- React Tutorial: https://react.dev/learn
- Tailwind Tutorial: https://tailwindcss.com/docs
- PWA Guide: https://web.dev/progressive-web-apps/
- Offline-First: https://offlinefirst.org/

### C. Contact Information

**Project Lead:** [Name]
**Email:** dev@terraguardian.org
**Slack:** #terraguardian-team
**GitHub:** https://github.com/vikkirkobane/earthscribe-hub

**Office Hours:**
- Monday, Wednesday, Friday: 2-3 PM UTC
- Open for questions and pair programming

**Emergency Contact:**
- On-call Developer: [Phone]
- Supabase Issues: support@supabase.com
- Critical Bugs: File GitHub issue with "CRITICAL" label

---

## Change Log

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.1 | Oct 9, 2025 | Planning Team | Initial PLANNING.md creation |
| 0.2 | [TBD] | | Updates after Week 1 review |

---

**Remember:** This is a living document. Update it as the project evolves, milestones are reached, and new insights emerge. Every team member should review this document before starting work.

**Let's build something that changes the world! 🌱🌍**