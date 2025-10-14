# CLAUDE.md - TerraGuardian Project Guide

## Project Overview

**Project Name:** TerraGuardian: AI-Powered Community Land Regeneration Platform

**Tagline:** "Where Community Observations Meet AI Intelligence for Climate Action"

**Project Type:** Mobile-first Progressive Web App (PWA) for community-led land restoration

**Core Mission:** Empower communities to become active land stewards through gamified monitoring, AI-driven regeneration guidance, and measurable impact tracking.

---

## Product Vision

TerraGuardian transforms every community member into a land guardian by:
- Making land restoration **participatory** through gamification
- Making it **data-driven** through AI and satellite verification
- Making it **economically viable** through carbon credit integration

Think: "Duolingo for Land Health" meets precision agriculture.

---

## Architecture Overview

### Tech Stack

```yaml
Frontend:
  Framework: Bolt.new (React-based)
  Type: Progressive Web App (PWA)
  UI Library: Tailwind CSS
  Charts: Recharts
  Icons: Lucide React
  State Management: React hooks (useState, useReducer)

Backend:
  Platform: Supabase
  Services:
    - Authentication (email, Google OAuth)
    - PostgreSQL Database
    - Real-time subscriptions
    - File storage (photos, reports)
  
AI Services:
  LLM: Claude.ai API (Sonnet 4.5)
  Computer Vision: TensorFlow Lite (on-device)
  Integration: RESTful API calls

Geospatial:
  Satellite Data: Sentinel Hub / Google Earth Engine API
  Mapping: Leaflet or Mapbox GL JS
  Analysis: NDVI calculations, polygon management

External APIs:
  Weather: OpenWeatherMap API
  Messaging: Twilio / WhatsApp Business API
  
Deployment:
  Hosting: Vercel or Netlify
  CI/CD: GitHub Actions
```

### System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Mobile Client (PWA)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  Quest Feed  │  │  AI Advisor  │  │ Impact Track │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Camera     │  │  Offline DB  │  │  TF Lite     │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                   API Gateway (REST)                     │
└─────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│   Supabase   │   │  Claude.ai   │   │  GIS APIs    │
│   Backend    │   │     API      │   │  (Sentinel)  │
└──────────────┘   └──────────────┘   └──────────────┘
```

---

## Core Features (MVP)

### Module 1: Gamified Land Monitoring

**Quest System:**
- 5 pre-built quest types: Soil Erosion, Crop Health, Water Monitoring, Vegetation Health, Degraded Land
- Photo capture with geolocation
- On-device AI validation (TensorFlow Lite)
- Points and badges reward system
- Offline-first with auto-sync

**Engagement Mechanics:**
- Community Land Health Score
- Leaderboards (community and global)
- Streak tracking
- Unlockable educational content

### Module 2: AI Regeneration Advisor

**Claude.ai Integration:**
- Natural language chatbot
- Context-aware responses based on:
  - User location and climate
  - Soil type and conditions
  - Seasonal timing
  - Community quest data
- Educational content generation
- WhatsApp integration for low-connectivity users

**Advice Categories:**
- Soil health improvements
- Native species selection
- Seasonal action plans
- Erosion control strategies
- Water management techniques

### Module 3: Impact Tracking & Verification

**Plot Management:**
- Interactive map for claiming degraded land
- Polygon drawing for plot boundaries
- Restoration plan creation
- Progress documentation with photos

**Satellite Verification:**
- Quarterly NDVI analysis
- Before/after comparisons
- Automated vegetation recovery metrics

**Impact Dashboard:**
- Hectares restored
- CO2 sequestered (estimated)
- Biodiversity index
- Active guardians count
- Quest completion stats

---

## Database Schema

### Core Tables

```sql
-- Users
users {
  id: uuid (PK)
  email: string
  name: string
  location: geography(point)
  points: integer
  streak_days: integer
  last_active: timestamp
  created_at: timestamp
}

-- Quests
quests {
  id: uuid (PK)
  type: string
  title: string
  description: text
  points_reward: integer
  difficulty: string
  location: geography(point)
  radius_km: float
  created_at: timestamp
}

-- Submissions
submissions {
  id: uuid (PK)
  user_id: uuid (FK -> users)
  quest_id: uuid (FK -> quests)
  photo_url: text
  location: geography(point)
  ai_validation_result: jsonb
  points_earned: integer
  submitted_at: timestamp
}

-- Plots
plots {
  id: uuid (PK)
  user_id: uuid (FK -> users)
  area_hectares: float
  coordinates: geography(polygon)
  degradation_type: string
  restoration_plan: text
  baseline_photo_url: text
  baseline_ndvi: float
  status: string
  claimed_at: timestamp
}

-- Impact Metrics
impact_metrics {
  id: uuid (PK)
  plot_id: uuid (FK -> plots)
  metric_type: string
  value: float
  verification_source: string
  measured_at: timestamp
}

-- Badges
badges {
  id: uuid (PK)
  user_id: uuid (FK -> users)
  badge_type: string
  earned_at: timestamp
}

-- Chat History
chat_history {
  id: uuid (PK)
  user_id: uuid (FK -> users)
  message: text
  response: text
  context: jsonb
  created_at: timestamp
}
```

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Token refresh

### Quests
- `GET /api/quests` - List available quests (location-filtered)
- `GET /api/quests/:id` - Get quest details
- `POST /api/quests/:id/submit` - Submit quest completion
- `GET /api/quests/user/:userId` - User's completed quests

### AI Advisor
- `POST /api/advisor/chat` - Send message to Claude.ai
- `GET /api/advisor/history/:userId` - Get chat history

### Plots
- `GET /api/plots` - List plots (filtered)
- `POST /api/plots/claim` - Claim a plot
- `GET /api/plots/:id` - Get plot details
- `POST /api/plots/:id/update` - Update plot progress
- `GET /api/plots/:id/satellite` - Get satellite verification

### Impact
- `GET /api/impact/user/:userId` - User impact metrics
- `GET /api/impact/community/:communityId` - Community metrics
- `GET /api/impact/report` - Generate impact report

### Leaderboard
- `GET /api/leaderboard/community/:communityId` - Community rankings
- `GET /api/leaderboard/global` - Global rankings

---

## Key User Flows

### 1. Complete a Quest
```
User opens app
  → Views available quests (location-based)
  → Selects quest
  → Reads instructions
  → Takes photo (offline-capable)
  → TF Lite validates on-device
  → Earns points + badge
  → Unlocks educational content from Claude.ai
  → Data syncs when online
```

### 2. Get AI Advice
```
User opens AI Advisor
  → Types question in natural language
  → System adds context (location, season, previous quests)
  → Claude.ai generates personalized response
  → User receives actionable advice
  → Educational resources suggested
  → Can save for later reference
```

### 3. Claim and Track a Plot
```
User opens map view
  → Identifies degraded area
  → Draws polygon boundary
  → Confirms plot details
  → Takes baseline photos
  → AI helps create restoration plan
  → System captures baseline NDVI (satellite)
  → User documents progress over time
  → Quarterly satellite verification
  → Impact metrics auto-calculated
```

---

## AI Integration Guidelines

### Claude.ai Prompt Structure

**For Regeneration Advice:**
```
You are an expert in regenerative agriculture and land restoration.
A farmer in [LOCATION] needs advice on [TOPIC].

Context:
- Climate: [CLIMATE_TYPE]
- Soil: [SOIL_TYPE]
- Season: [CURRENT_SEASON]
- Recent observations: [QUEST_DATA]
- Land condition: [DEGRADATION_TYPE]

Question: [USER_QUESTION]

Provide practical, actionable advice that:
1. Is specific to their local conditions
2. Uses locally available resources
3. Includes step-by-step instructions
4. Explains why the practice works
5. Mentions potential challenges

Keep response under 300 words and use simple language.
```

**For Educational Content:**
```
Generate educational content about [TOPIC] for rural farmers.

Requirements:
- 5th-8th grade reading level
- 150-200 words
- Include one practical example
- Relate to [LOCAL_CONTEXT]
- Inspiring and empowering tone

Format: Short paragraph with bullet points for key takeaways.
```

### TensorFlow Lite Model

**Image Classification:**
- Model: MobileNetV2 (fine-tuned)
- Categories: 8 land health types
- Input: 224x224 RGB image
- Output: Class probabilities + confidence scores
- Threshold: >0.7 confidence for validation

**Integration:**
```javascript
// On-device inference
async function validateQuestPhoto(imageData, questType) {
  const model = await tf.loadLayersModel('model.json');
  const tensor = tf.browser.fromPixels(imageData)
    .resizeBilinear([224, 224])
    .expandDims(0)
    .div(255.0);
  
  const predictions = await model.predict(tensor);
  const result = await predictions.data();
  
  return {
    class: getTopClass(result),
    confidence: Math.max(...result),
    validated: result[questType] > 0.7
  };
}
```

### Satellite Data Processing

**NDVI Calculation:**
```javascript
// Calculate vegetation index
function calculateNDVI(nirBand, redBand) {
  return (nirBand - redBand) / (nirBand + redBand);
}

// Vegetation health interpretation
function interpretNDVI(ndvi) {
  if (ndvi > 0.6) return 'Healthy vegetation';
  if (ndvi > 0.4) return 'Moderate vegetation';
  if (ndvi > 0.2) return 'Sparse vegetation';
  return 'Bare soil / degraded';
}
```

---

## Design System

### Color Palette
```css
/* Primary Colors */
--primary-green: #2D5A1F;
--primary-earth: #8B6F47;
--primary-sky: #4A90E2;

/* Secondary Colors */
--secondary-light-green: #7CB342;
--secondary-sand: #D4C5A9;
--secondary-water: #64B5F6;

/* Neutral Colors */
--neutral-dark: #333333;
--neutral-gray: #757575;
--neutral-light: #F5F5F5;
--neutral-white: #FFFFFF;

/* Status Colors */
--success: #4CAF50;
--warning: #FF9800;
--error: #F44336;
--info: #2196F3;
```

### Typography
```css
/* Font Family */
font-family: 'Inter', system-ui, -apple-system, sans-serif;

/* Font Sizes */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
```

### Component Guidelines

**Buttons:**
- Primary: Green background, white text
- Secondary: Outline, green border
- Disabled: Gray, low opacity
- Min touch target: 44x44px

**Cards:**
- Border radius: 12px
- Shadow: soft, elevated feel
- Padding: 16px
- Background: white

**Icons:**
- Use Lucide React
- Size: 20px (small), 24px (medium), 32px (large)
- Color: Inherit from parent or theme

---

## Code Style & Standards

### File Structure
```
src/
├── components/
│   ├── common/          # Reusable components
│   ├── quests/          # Quest-related components
│   ├── advisor/         # AI advisor components
│   ├── plots/           # Plot management components
│   └── dashboard/       # Dashboard components
├── hooks/               # Custom React hooks
├── services/            # API services
│   ├── supabase.js
│   ├── claude.js
│   ├── gis.js
│   └── tensorflow.js
├── utils/               # Utility functions
├── styles/              # Global styles
├── assets/              # Images, icons
└── App.jsx              # Root component
```

### Naming Conventions

**Components:**
```javascript
// PascalCase for components
QuestCard.jsx
ImpactDashboard.jsx
AIAdvisor.jsx
```

**Functions:**
```javascript
// camelCase for functions
validateQuestSubmission()
calculateCarbonSequestration()
fetchUserImpact()
```

**Constants:**
```javascript
// UPPER_SNAKE_CASE for constants
const MAX_PHOTO_SIZE = 5242880; // 5MB
const QUEST_TYPES = ['erosion', 'crop', 'water', 'vegetation', 'degraded'];
const DEFAULT_RADIUS_KM = 10;
```

### Code Standards

**React Patterns:**
```javascript
// Use functional components with hooks
function QuestCard({ quest, onComplete }) {
  const [isLoading, setIsLoading] = useState(false);
  
  // Event handlers
  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await submitQuest(quest.id);
      onComplete();
    } catch (error) {
      console.error('Quest submission failed:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="quest-card">
      {/* Component JSX */}
    </div>
  );
}

// PropTypes or TypeScript for type safety
QuestCard.propTypes = {
  quest: PropTypes.object.isRequired,
  onComplete: PropTypes.func.isRequired
};
```

**Error Handling:**
```javascript
// Always handle errors gracefully
try {
  const result = await apiCall();
  return result;
} catch (error) {
  console.error('Operation failed:', error);
  showUserFriendlyError('Something went wrong. Please try again.');
  logErrorToMonitoring(error);
}
```

**Async Operations:**
```javascript
// Use async/await for clarity
async function loadUserData(userId) {
  const user = await fetchUser(userId);
  const quests = await fetchUserQuests(userId);
  const impact = await calculateUserImpact(userId);
  
  return { user, quests, impact };
}
```

---

## Environment Variables

```bash
# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key

# Claude AI
VITE_CLAUDE_API_KEY=your_claude_api_key

# Geospatial Services
VITE_SENTINEL_HUB_CLIENT_ID=your_client_id
VITE_SENTINEL_HUB_CLIENT_SECRET=your_secret
VITE_GOOGLE_EARTH_ENGINE_KEY=your_ee_key

# Weather API
VITE_OPENWEATHER_API_KEY=your_api_key

# Messaging (optional for MVP)
VITE_TWILIO_ACCOUNT_SID=your_sid
VITE_TWILIO_AUTH_TOKEN=your_token
VITE_WHATSAPP_BUSINESS_ID=your_business_id

# App Configuration
VITE_APP_ENV=development
VITE_APP_URL=http://localhost:5173
```

---

## Testing Strategy

### Unit Tests
```javascript
// Test utility functions
describe('calculateNDVI', () => {
  it('should calculate correct NDVI value', () => {
    expect(calculateNDVI(0.8, 0.2)).toBeCloseTo(0.6, 2);
  });
  
  it('should handle edge cases', () => {
    expect(calculateNDVI(0, 0)).toBe(0);
  });
});
```

### Integration Tests
```javascript
// Test API interactions
describe('Quest Submission Flow', () => {
  it('should submit quest with photo and get validation', async () => {
    const quest = await createTestQuest();
    const photo = await captureTestPhoto();
    
    const result = await submitQuest(quest.id, photo);
    
    expect(result.validated).toBe(true);
    expect(result.pointsEarned).toBeGreaterThan(0);
  });
});
```

### E2E Tests
```javascript
// Test complete user journeys
describe('Complete Quest Journey', () => {
  it('should allow user to complete quest end-to-end', async () => {
    await login();
    await selectQuest('erosion_detection');
    await takePhoto();
    await waitForValidation();
    await expectPointsAwarded();
    await expectBadgeUnlocked();
  });
});
```

---

## Performance Optimization

### Key Metrics
- First Contentful Paint: <2s
- Time to Interactive: <3s
- Offline functionality: Core features work without network
- Image upload: Max 5MB per photo
- API response time: <500ms for most endpoints

### Optimization Strategies

**Code Splitting:**
```javascript
// Lazy load heavy components
const AIAdvisor = lazy(() => import('./components/advisor/AIAdvisor'));
const PlotMap = lazy(() => import('./components/plots/PlotMap'));
```

**Image Optimization:**
```javascript
// Compress before upload
async function compressImage(file) {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true
  };
  return await imageCompression(file, options);
}
```

**Caching Strategy:**
```javascript
// Cache frequently accessed data
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

function getCachedData(key) {
  const cached = localStorage.getItem(key);
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < CACHE_DURATION) {
      return data;
    }
  }
  return null;
}
```

**Offline Support:**
```javascript
// Service worker for offline functionality
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
```

---

## Security Considerations

### Authentication
- JWT tokens with short expiration (15 minutes)
- Refresh tokens (7 days)
- Secure HTTP-only cookies
- OAuth integration (Google)

### Data Protection
- Encrypt sensitive data at rest
- Use HTTPS for all API calls
- Sanitize user inputs
- Rate limiting on API endpoints

### File Uploads
```javascript
// Validate file types and sizes
function validatePhoto(file) {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type');
  }
  
  if (file.size > maxSize) {
    throw new Error('File too large');
  }
  
  return true;
}
```

### API Security
```javascript
// Add authentication headers
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

## Deployment Checklist

### Pre-Deployment
- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] API endpoints tested
- [ ] Performance metrics checked
- [ ] Security audit completed
- [ ] Offline functionality verified
- [ ] Cross-browser testing done

### Deployment Steps
1. Build production bundle: `npm run build`
2. Run production build locally: `npm run preview`
3. Deploy to Vercel/Netlify
4. Verify deployment URL
5. Run smoke tests on production
6. Monitor error logging
7. Check analytics integration

### Post-Deployment
- [ ] Monitor error rates
- [ ] Check API performance
- [ ] Verify data sync
- [ ] Test critical user flows
- [ ] Monitor user feedback
- [ ] Document any issues

---

## Common Development Tasks

### Adding a New Quest Type

1. Update database enum:
```sql
ALTER TYPE quest_type ADD VALUE 'new_quest_type';
```

2. Add validation logic:
```javascript
// src/services/tensorflow.js
const QUEST_VALIDATORS = {
  new_quest_type: (predictions) => predictions.new_class > 0.7
};
```

3. Create quest data:
```javascript
// Insert via Supabase
const { data } = await supabase
  .from('quests')
  .insert({
    type: 'new_quest_type',
    title: 'New Quest Title',
    description: 'Quest description',
    points_reward: 50
  });
```

### Adding Claude.ai Response Template

```javascript
// src/services/claude.js
const ADVICE_TEMPLATES = {
  soil_health: {
    systemPrompt: `You are an expert in soil health...`,
    maxTokens: 500,
    temperature: 0.7
  },
  // Add new template
  new_topic: {
    systemPrompt: `You are an expert in [topic]...`,
    maxTokens: 400,
    temperature: 0.8
  }
};
```

### Adding Impact Metric

1. Update database:
```sql
INSERT INTO metric_types (name, unit, calculation_method)
VALUES ('new_metric', 'unit', 'calculation_description');
```

2. Add calculation function:
```javascript
// src/utils/impact.js
function calculateNewMetric(plotData) {
  // Calculation logic
  return metricValue;
}
```

3. Display in dashboard:
```javascript
// src/components/dashboard/ImpactDashboard.jsx
<MetricCard
  title="New Metric"
  value={metrics.newMetric}
  unit="units"
  icon={<NewIcon />}
/>
```

---

## Troubleshooting Guide

### Common Issues

**Offline Sync Not Working:**
```javascript
// Check service worker registration
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.ready.then((registration) => {
    console.log('Service Worker ready:', registration);
  });
}

// Verify IndexedDB storage
const request = indexedDB.open('TerraGuardianDB');
request.onsuccess = () => console.log('IndexedDB available');
```

**AI Validation Failing:**
```javascript
// Check model loading
try {
  const model = await tf.loadLayersModel('model.json');
  console.log('Model loaded:', model.summary());
} catch (error) {
  console.error('Model loading failed:', error);
}

// Verify image preprocessing
const preprocessed = preprocessImage(imageData);
console.log('Image shape:', preprocessed.shape);
```

**Satellite Data Not Loading:**
```javascript
// Test API connection
const testSentinelHub = async () => {
  try {
    const response = await fetch('https://services.sentinel-hub.com/...');
    console.log('Sentinel Hub status:', response.status);
  } catch (error) {
    console.error('Sentinel Hub error:', error);
  }
};
```

**Supabase Authentication Issues:**
```javascript
// Debug auth state
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth event:', event);
  console.log('Session:', session);
});

// Check token validity
const { data: { user } } = await supabase.auth.getUser();
console.log('Current user:', user);
```

---

## Development Best Practices

### 1. Offline-First Approach
Always design features to work offline first:
- Store data locally
- Queue API calls
- Sync when connection available
- Provide clear offline indicators

### 2. Progressive Enhancement
Build core functionality first, enhance later:
- Basic quest submission before AI
- Simple map before satellite overlay
- Text advice before multimedia

### 3. Mobile-First Design
Optimize for mobile devices:
- Touch-friendly UI (44px minimum)
- Responsive layouts
- Fast load times
- Limited bandwidth consideration

### 4. Accessibility
Make the app usable for everyone:
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Screen reader support
- High contrast mode

### 5. Internationalization
Prepare for multiple languages:
- Extract strings to translation files
- Use i18n library
- Format dates/numbers locally
- Right-to-left language support

---

## Resources & Documentation

### External Documentation
- [Supabase Docs](https://supabase.com/docs)
- [Claude AI API](https://docs.anthropic.com)
- [TensorFlow.js Guide](https://www.tensorflow.org/js)
- [Sentinel Hub API](https://docs.sentinel-hub.com)
- [Leaflet Documentation](https://leafletjs.com/reference.html)

### Internal Documentation
- Product Requirements Document (PRD)
- API Documentation
- Database Schema Reference
- Design System Guide
- User Research Findings

### Community Resources
- GitHub Repository: [link]
- Slack Channel: #terraguardian-dev
- Weekly Standup: Mondays 10am
- Sprint Planning: Every 2 weeks

---

## Project Priorities

### Must Have (MVP)
1. ✅ User authentication
2. ✅ Quest system with 5 types
3. ✅ On-device AI validation
4. ✅ Points and basic badges
5. ✅ Claude.ai advisor chat
6. ✅ Plot claiming
7. ✅ Basic impact dashboard
8. ✅ Offline functionality

### Should Have (Post-MVP)
1. Satellite NDVI integration
2. WhatsApp integration
3. Advanced badges and achievements
4. Community leaderboards
5. Educational content library
6. Impact reports (PDF export)

### Nice to Have (Future)
1. Voice input
2. IoT sensor integration
3. Blockchain carbon credits
4. Virtual reality training
5. Drone imagery
6. Machine translation

---

## Success Metrics

### Technical Metrics
- Uptime: >99.5%
- API response time: <500ms (p95)
- App load time: <3s
- Error rate: <1%
- Test coverage: >80%

### User Metrics
- Daily Active Users (DAU)
- Quest completion rate: >60%
- Retention (Day 30): >70%
- Average session duration: >5 min
- User satisfaction (NPS): >50

### Impact Metrics
- Quests completed: 10,000+ (Month 3)
- Hectares under restoration: 100+ (Month 6)
- Active communities: 5+ (Month 6)
- Carbon credits pre-committed: $50K+ (Month 12)

---

## Contact & Support

**Project Owner:** Product Team
**Tech Lead:** [Name]
**Community Manager:** [Name]

**Communication Channels:**
- Email: dev@terraguardian.org
- Slack: #terraguardian-dev
- GitHub Issues: For bugs and features
- Weekly Standups: Mondays 10am UTC

**Emergency Contact:**
- On-call rotation: [Link to schedule]
- Incident response: [Runbook link]

---

## Version History

- **v1.0** (Oct 2025): Initial CLAUDE.md creation
- **v0.9** (Sep 2025): MVP specification
- **v0.5** (Aug 2025): Concept validation

---

**Remember:** TerraGuardian is about empowering communities. Every line of code should serve that mission. Build features that work offline, are accessible to all, and create measurable environmental impact.

Happy coding! 🌱🌍