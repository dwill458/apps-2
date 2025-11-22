# 🌱 Cozy Growth

> **An ADHD-Friendly Productivity App That Actually Helps You Start**
>
> Turn overwhelming goals into 3-10 minute micro-tasks with gentle nature-based gamification.

[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3+-38bdf8.svg)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-✓-green.svg)](https://supabase.com/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Phase](https://img.shields.io/badge/Phase-2%20Complete-brightgreen.svg)](#roadmap)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Core Philosophy](#core-philosophy)
- [Features](#features)
- [Design System](#design-system)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [User Journey](#user-journey)
- [Gamification System](#gamification-system)
- [Tech Stack](#tech-stack)
- [Development](#development)
- [Roadmap](#roadmap)
- [Contributing](#contributing)

---

## 🎯 Overview

**Cozy Growth** is a productivity app specifically designed for adults with ADHD or executive function challenges. Instead of overwhelming you with complex project management, it focuses on one core principle: **help you START**.

### The Problem

Traditional productivity apps punish missed tasks, create guilt with red notifications, and demand extensive planning before action. For ADHD brains, this creates paralysis.

### Our Solution

- ✅ **One micro-task at a time** - Never see your full todo list
- ✅ **3-10 minute chunks** - Small enough to always start
- ✅ **Zero guilt** - Supportive debugging instead of shame
- ✅ **Visual growth** - Watch your goals bloom like plants
- ✅ **Gentle RPG elements** - Streaks, badges, bloom points
- ✅ **AI task breakdown** - Turn "Learn Spanish" into "Watch 5-min Duolingo intro video"

---

## 💚 Core Philosophy

### Help Users START, Not Plan Endlessly

The app surfaces **ONE clear "do this now" action** based on:
- Current energy level (Low/Medium/High)
- Available time (3/5/10/15 minutes)
- Task difficulty and "spicy" flag
- Time of day patterns

### Celebrate Attempts, Never Punish

- No harsh red colors or guilt-inducing language
- "Debug loop" when tasks aren't completed
- Grace Blooms protect streaks (built-in forgiveness)
- Supportive AI persona that adapts tone

### Low Cognitive Load Design

- One primary action per screen
- Large touch targets (44px+)
- Generous whitespace
- Clear visual hierarchy
- Auto-save everything

---

## ✨ Features

### 🌟 Core Features

#### 1. Smart Micro-Task Suggestions
- AI breaks goals into 3-15 minute actionable steps
- Filter by energy level and available time
- "Spicy" tasks for variety when energy is low
- Learns your patterns over time

#### 2. Daily Bloom Progress
- Vine-style progress bar that grows throughout the day
- Leaves sprout at 25% progress
- Flowers bloom at milestones
- Track daily minutes toward your goal (10-60 min/day)

#### 3. Chain of Action Rewards
- Complete one task → Immediate suggestion for next logical step
- Build momentum with chain multipliers
- Celebrate chain streaks (3×, 5×, 10× combos)
- Optional: Choose to continue or rest

#### 4. Debug Loop (When You Can't Complete)
Instead of marking "failed," users select:
- "Feels too big" → Get 1-minute fallback version
- "Wrong time/place" → Reschedule with suggestions
- "Something came up" → Supportive acknowledgment
- "Not feeling it" → Gentle pivot options

#### 5. Dual Streak Tracking
- **Current Streak**: Consecutive days with ≥1 task
- **Total Days Showed Up**: Lifetime counter (never resets)
- Grace Blooms: Earn 1/week, use to protect streaks
- Emphasize Total Days over Current Streak

### 🎮 Gamification Features

#### Bloom Points (BP) Currency
Earn points for:
- Each completed task (1-3 BP based on difficulty/duration)
- Streak multipliers (7-day = 1.5×, 14-day = 2×, 30-day = 2.5×, 60+ day = 3×)

Spend on:
- Rare plant types (10-50 BP)
- Garden decorations (5-20 BP)
- Avatar accessories (25 BP)
- Seasonal themes (30 BP)
- "Plant a Real Tree" donation (100 BP)

#### Plant Collection System
- Common plants (1-3 day streaks): Basic flowers, herbs
- Uncommon (7 days): Vegetables, small shrubs
- Rare (14-30 days): Fruit trees, exotic flowers
- Legendary (60+ days): Mythical plants (glowing mushrooms)

#### Achievement Badges
- Seedling Starter (3 days)
- Budding Gardener (7 days)
- Bloom Keeper (14 days)
- Garden Guardian (30 days)
- Forest Sage (60 days)
- Ancient Grove Tender (100+ days)

#### Garden Evolution
As streaks grow, your garden gains:
- 3 days: Small flowers appear
- 7 days: Butterflies and bees animate
- 14 days: Bird's nest in background
- 30 days: Garden expands with new plot
- 60 days: Weather effects (gentle rain, mist)
- 100 days: Seasonal themes unlock permanently

### 📱 All App Pages

1. **Splash Screen** - Branded entry with encouraging tagline
2. **Onboarding (5 Steps)**
   - Welcome + name input
   - Avatar customization (5 characters × 5 color palettes)
   - First goal creation
   - AI task generation preview
   - Daily goal setup (minutes + reminder intensity)

3. **Home (Daily Bloom)**
   - Personalized greeting + streak badge
   - Daily Bloom progress bar
   - Energy Reserve selector (Low/Medium/High)
   - Duration picker (3/5/10/15 min)
   - "Cultivate One Tiny Step" CTA
   - Today's Wins (collapsible)

4. **Task Flow**
   - Task Suggestion with energy/duration filters
   - Timer with pause/resume
   - Completion celebration + Chain prompt
   - Debug Loop for blockers
   - 1-Minute Fallback alternatives

5. **Garden (Goals Overview)**
   - All goals displayed as growing plants
   - Visual growth stage (1-5: seed → full bloom)
   - Progress bars per goal
   - Tap to view detailed Garden Path

6. **Garden Path (Single Goal)**
   - Organic vine visualization
   - Task cards along the path
   - Completed = blooms 🌸
   - Current task highlighted with pulse
   - Expandable task details

7. **Journal**
   - Quick capture text area
   - Tag as Seed (idea) / Sprout (task) / Bloom (win)
   - Feed with filtering
   - Move entries between categories
   - Send Sprouts to active goals

8. **Calendar & Streaks**
   - Monthly heatmap (green intensity by activity)
   - Current Streak with vine visualization
   - Total Days Showed Up (emphasized)
   - Longest Streak
   - Grace Bloom count
   - Tap day for details

9. **Settings (Cozy)**
   - Profile (avatar, color, daily goal)
   - Notifications (frequency, quiet hours, sound/vibration)
   - Accessibility (text size, dyslexia font, reduce motion, high contrast)
   - Growth Preferences (suggestions mode, chain intensity, debug prompts)
   - Data & Privacy (export, reset, delete account)
   - About & Support

---

## 🎨 Design System

### Cozy Growth Color Palette

```css
/* Backgrounds */
Cream: #F5EAD6 (base) to #FEFDFB (lightest)

/* Primary Accents */
Sage: #7A9F6E (buttons, active states)
Moss: #738C61 (secondary buttons)

/* Secondary Accents */
Wood: #B49B73 (primary CTAs with texture)
Gold: #FFD978 (celebrations, highlights)
Coral: #FF8C73 (error states, supportive)
```

### Typography
- **Display**: Quicksand (headings)
- **Body**: Nunito (400, 600, 700, 800)
- **Base size**: 16px (with 18px, 20px options)
- **Line height**: 1.6-1.7 for readability

### UI Principles
- **Border radius**: 1rem (cozy), 1.5rem (cozy-lg), 2.5rem (cozy-2xl), 9999px (pill)
- **Shadows**: Soft, diffused (rgba(122, 159, 110, 0.08-0.15))
- **Touch targets**: Minimum 44×44px
- **Animations**: Gentle, 0.2-0.6s durations
- **Wood texture**: SVG noise overlay on primary buttons

### Nature-Based Icons
- Tasks = seeds 🌱, sprouts 🌿
- Completed = blooms 🌸
- Energy = leaves (small → large)
- Streaks = vines 🌿
- Goals = roots, tree trunks 🌳

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/cozy-growth.git
cd cozy-growth

# Install frontend dependencies
cd frontend
npm install
```

### Supabase Setup (Required for Backend)

1. **Create Supabase Project**:
   - Go to [https://supabase.com](https://supabase.com)
   - Create a new project
   - Save your project URL and anon key

2. **Run Database Migrations**:
   - Open Supabase SQL Editor
   - Run migrations in order:
     - `backend/supabase/migrations/001_initial_schema.sql`
     - `backend/supabase/migrations/002_rls_policies.sql`
     - `backend/supabase/migrations/003_functions.sql`
   - Optional: Run `backend/supabase/seed.sql` for test data

3. **Configure Environment**:
   ```bash
   # In frontend directory
   cp .env.example .env

   # Edit .env and add your Supabase credentials:
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

📚 **Detailed setup guide**: [docs/SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md)

### Start Development Server

```bash
npm run dev
# Access at http://localhost:5173
```

### First Run
1. Open browser to `http://localhost:5173`
2. **Sign in** with email magic link or Google OAuth
3. Complete 5-step onboarding:
   - Enter your name
   - Pick avatar character and color
   - Create first goal (e.g., "Learn Spanish basics")
   - Watch AI generate micro-tasks
   - Set daily goal (10-60 min) and reminders
4. Land on Home screen with your first suggested task!

### Quick Demo (No Supabase)

Want to try the UI without setting up backend?
```bash
# The app will use sample data from localStorage
npm run dev
# Note: Data won't persist across sessions without Supabase
```

---

## 📁 Project Structure

```
cozy-growth/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── ui/
│   │   │       ├── Button.tsx
│   │   │       ├── Card.tsx
│   │   │       ├── ProgressBar.tsx
│   │   │       ├── EnergySelector.tsx
│   │   │       ├── DurationPicker.tsx
│   │   │       ├── PlantVisual.tsx
│   │   │       ├── TaskCard.tsx
│   │   │       ├── Badge.tsx
│   │   │       ├── Modal.tsx
│   │   │       ├── ConfettiAnimation.tsx
│   │   │       ├── Loading.tsx
│   │   │       └── Input.tsx
│   │   │
│   │   ├── pages/
│   │   │   ├── SplashScreen.tsx
│   │   │   ├── Home.tsx
│   │   │   ├── Garden.tsx
│   │   │   ├── GardenPath.tsx
│   │   │   ├── Journal.tsx
│   │   │   ├── Calendar.tsx
│   │   │   ├── CozySettings.tsx
│   │   │   ├── Onboarding/
│   │   │   │   ├── OnboardingLayout.tsx
│   │   │   │   ├── Step1Welcome.tsx
│   │   │   │   ├── Step2Avatar.tsx
│   │   │   │   ├── Step3Goal.tsx
│   │   │   │   ├── Step4Preview.tsx
│   │   │   │   └── Step5Setup.tsx
│   │   │   └── TaskFlow/
│   │   │       ├── TaskSuggestion.tsx
│   │   │       ├── TaskTimer.tsx
│   │   │       ├── TaskComplete.tsx
│   │   │       ├── DebugLoop.tsx
│   │   │       └── FallbackTask.tsx
│   │   │
│   │   ├── store/
│   │   │   └── useStore.ts (Zustand stores)
│   │   │
│   │   ├── types/
│   │   │   └── index.ts (TypeScript definitions)
│   │   │
│   │   ├── data/
│   │   │   └── sampleData.ts (Demo data)
│   │   │
│   │   ├── utils/
│   │   │   ├── helpers.ts (Utility functions)
│   │   │   └── taskSuggestionEngine.ts (Task filtering)
│   │   │
│   │   ├── services/
│   │   │   └── aiService.ts (Mock AI integration)
│   │   │
│   │   ├── lib/
│   │   │   ├── supabase.ts (Supabase client)
│   │   │   ├── database.types.ts (DB types)
│   │   │   └── api/
│   │   │       ├── auth.ts (Authentication)
│   │   │       ├── goals.ts (Goals & tasks API)
│   │   │       ├── tasks.ts (Task completion)
│   │   │       ├── journal.ts (Journal entries)
│   │   │       ├── streaks.ts (Streaks & badges)
│   │   │       └── user.ts (Profile & settings)
│   │   │
│   │   ├── contexts/
│   │   │   ├── AuthContext.tsx (Auth provider)
│   │   │   ├── useAuth.tsx (Auth hook)
│   │   │   └── AuthGuard.tsx (Protected routes)
│   │   │
│   │   ├── styles/
│   │   │   └── index.css (Global styles + Tailwind)
│   │   │
│   │   ├── App.tsx (Routing)
│   │   └── main.tsx (Entry point)
│   │
│   ├── tailwind.config.js (Cozy Growth theme)
│   ├── package.json
│   ├── .env.example
│   └── vite.config.ts
│
├── backend/
│   └── supabase/
│       ├── migrations/
│       │   ├── 001_initial_schema.sql
│       │   ├── 002_rls_policies.sql
│       │   └── 003_functions.sql
│       └── seed.sql (Test data)
│
├── docs/
│   └── SUPABASE_SETUP.md (Backend setup guide)
│
└── README.md (This file)
```

---

## 👤 User Journey

### First-Time User
1. **Splash Screen** (2-3 seconds) → "Ready for your next quest?"
2. **Onboarding** (~3-5 minutes)
   - Pick name and avatar
   - Enter one goal
   - See AI break it down
   - Set daily time commitment
3. **Home Screen** → Immediately see first micro-task suggestion
4. **First Task** → Complete 5-min task, see celebration
5. **Chain Prompt** → Option to do another or rest

### Returning User
1. **Splash Screen** → Auto-redirect to Home
2. **Home Screen**
   - See streak count
   - View Daily Bloom progress
   - Adjust energy/duration
   - Tap "Cultivate One Tiny Step"
3. **Task Flow** → Complete tasks, build chains, earn BP
4. **End of Day** → Check Today's Wins, see garden growth

### Long-Term User (30+ Days)
- Unlock rare plants
- Evolving garden with butterflies and birds
- High streak multipliers (2.5× BP)
- Purchase decorations with BP
- Badge collection
- Seasonal event participation

---

## 🎮 Gamification System

### Progression Loop

```
Complete Task → Earn BP → Unlock Plants → Grow Garden
      ↓
Build Streak → Get Multipliers → More BP → Better Rewards
      ↓
Unlock Badges → Seasonal Events → Achievement Tree
```

### Balanced Progression
- **Short-term rewards**: Immediate BP, chain celebrations
- **Medium-term**: Weekly Grace Bloom, 7-day badges
- **Long-term**: Rare plants (30+ days), permanent seasonal themes (60+ days)

### Non-Punitive Design
- Streaks can be protected with Grace Blooms
- Total Days Showed Up never decreases
- Skipped tasks trigger Debug Loop (supportive)
- No "failure" states—only "resting" states

---

## 🛠 Tech Stack

### Frontend
- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS 3.3+ (custom Cozy Growth theme)
- **Animations**: Framer Motion 10+
- **State Management**: Zustand 4+ (persistent stores)
- **Routing**: React Router 6
- **Icons**: Lucide React
- **Date Handling**: date-fns

### Backend ✅
- **Database**: Supabase (PostgreSQL with Row Level Security)
- **Auth**: Supabase Auth (email magic link + Google OAuth)
- **Realtime**: Supabase Realtime subscriptions
- **API Layer**: TypeScript API services with optimistic updates
- **Storage**: Supabase Storage (avatars, exports - coming soon)

### AI Integration (Planned)
- **Provider**: OpenAI GPT-4 or Anthropic Claude
- **Features**:
  - Goal → micro-task breakdown
  - Adaptive task suggestions
  - Debug loop responses
  - Pattern detection

### Deployment
- **Frontend**: Vercel or Netlify
- **Backend**: Supabase Cloud
- **CI/CD**: GitHub Actions

---

## 💻 Development

### Available Scripts

```bash
# Development
npm run dev          # Start dev server (hot reload)

# Building
npm run build        # TypeScript compile + Vite build
npm run preview      # Preview production build

# Code Quality
npm run lint         # ESLint check
npm run type-check   # TypeScript type checking
```

### Environment Variables

Create `frontend/.env`:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_OPENAI_API_KEY=your_openai_key (optional)
```

### Development Tips

1. **Hot Reload**: Vite provides instant HMR
2. **Sample Data**: App loads with demo goals/tasks for testing
3. **State Persistence**: Zustand stores persist to localStorage
4. **Reset Data**: Use Settings → "Reset All Data" to clear
5. **Debug Mode**: Console logs show task suggestion reasoning

---

## 🗺️ Roadmap

### Phase 1: MVP ✅ (Current)
- [x] Complete UI component library
- [x] All core pages (Home, Onboarding, TaskFlow, Garden, Journal, Calendar, Settings)
- [x] Zustand state management
- [x] Sample data and mock AI
- [x] Cozy Growth design system
- [x] Responsive layouts

### Phase 2: Backend Integration ✅ (Completed)
- [x] Supabase setup (database, auth, RLS policies)
- [x] User authentication (email magic link + Google OAuth)
- [x] Real-time data synchronization
- [x] Profile management and settings sync
- [x] Goal/task CRUD operations with optimistic updates
- [x] Journal and streak tracking
- [x] API service layer with TypeScript types
- [x] Auth context and protected routes

### Phase 3: AI Integration (Q2 2025)
- [ ] OpenAI/Claude API integration
- [ ] Intelligent goal breakdown
- [ ] Adaptive task suggestions
- [ ] Pattern learning
- [ ] Debug loop AI responses

### Phase 4: Advanced Features (Q3 2025)
- [ ] Push notifications
- [ ] PWA installation
- [ ] Offline mode
- [ ] Export/backup to CSV/JSON
- [ ] Seasonal events system
- [ ] Social features (optional accountability partners)
- [ ] Garden sharing

### Phase 5: Expansion (Q4 2025)
- [ ] Native mobile apps (iOS/Android)
- [ ] Body-doubling mode (virtual co-working)
- [ ] Pomodoro-style focus sessions
- [ ] Calendar app integrations
- [ ] Voice input for tasks
- [ ] More plant varieties and themes
- [ ] Charity partnerships (plant real trees)

---

## 🤝 Contributing

We welcome contributions! Here's how:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** with clear messages: `git commit -m 'Add amazing feature'`
4. **Push** to your branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Development Guidelines
- Follow the existing code style (TypeScript + React)
- Use the Cozy Growth design system (colors, spacing, components)
- Write descriptive commit messages
- Add comments for complex logic
- Test on mobile and desktop viewports
- Maintain ADHD-friendly design principles

### Areas We Need Help
- 🎨 Lottie animations for plant growth
- 🧪 Unit tests (React Testing Library, Vitest)
- 🌐 Internationalization (i18n)
- ♿ Accessibility audits
- 📱 Mobile app development (React Native)
- 🤖 AI prompt engineering
- 📝 Documentation improvements

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **ADHD Community**: For insights on executive function challenges
- **How to ADHD** (Jessica McCabe): Inspiration for non-judgmental design
- **Forest App**: Plant-based gamification inspiration
- **Habitica**: RPG elements done right
- **Todoist**: Task management UX patterns
- **Notion**: Flexible, low-pressure productivity
- **Tailwind CSS**: Utility-first styling system
- **Framer Motion**: Smooth, accessible animations

---

## 📞 Support & Community

- **Documentation**: [docs.cozygrowth.app](https://docs.cozygrowth.app) (coming soon)
- **Issues**: [GitHub Issues](https://github.com/yourusername/cozy-growth/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/cozy-growth/discussions)
- **Discord**: [Join our community](https://discord.gg/cozygrowth) (coming soon)
- **Twitter**: [@CozyGrowthApp](https://twitter.com/CozyGrowthApp) (coming soon)

---

## ⚡ Quick Links

- [Demo Video](https://youtube.com/cozygrowth-demo) (coming soon)
- [Figma Designs](https://figma.com/cozygrowth) (coming soon)
- [API Documentation](docs/API.md) (coming soon)
- [Design System Guide](docs/DESIGN_SYSTEM.md) (coming soon)
- [User Research](docs/RESEARCH.md) (coming soon)

---

<div align="center">

**Made with 💚 for the ADHD community**

*Remember: Every tiny step counts. Your garden is growing.*

[⬆ Back to Top](#-cozy-growth)

</div>
