# 🌱 Cozy Growth

An ADHD-friendly anti-procrastination app that transforms overwhelming goals into delightful micro-tasks, wrapped in a cozy garden game aesthetic.

## 🎯 Core Philosophy

**Help users START, not plan endlessly.**

Cozy Growth is designed specifically for adults with ADHD or executive function challenges who struggle with:
- Task initiation
- Overwhelm from big goals
- Time blindness
- Shame from traditional productivity apps

## ✨ Key Features

### 🏡 Garden Scene Dashboard
- **Interactive Garden**: A living, breathing game window that grows with your progress
- **Sprout Avatar**: Your friendly companion with customizable outfits and moods
- **Daily Hero Plant**: Visual representation of daily progress (bud → bloom)
- **Weather Moods**: Toggle between sunny/rainy to match your energy level
- **Weed Mechanic**: Clear weeds as you complete tasks

### 🎮 Gamification
- **Sunlight Currency** ☀️: Earned by completing tasks
- **Seeds Currency** 🌰: Earned through streaks
- **Dual Streak System**:
  - Current Streak (can reset)
  - Total Days Showed Up (never resets - emphasizes showing up over perfection)
- **Grace Blooms**: Protect your streak when life happens

### 🌿 Task Management
- **Micro-Tasks**: 3-10 minute actionable steps
- **Smart AI Breakdown**: Automatically splits big goals into tiny, ADHD-friendly tasks
- **One Clear Action**: Shows ONE thing to do next, reducing decision paralysis
- **Duration Selection**: Choose 5, 10, or 15-minute sessions
- **"I'm Stuck" Flow**: Non-judgmental debugging when tasks don't work out

### 👕 Avatar Customization
- **Outfits**: Gardener, Raincoat, Apron, Explorer, Bee Costume, Sweater
- **Accessories**: Watering Can, Spade, Book, Glasses, Flower Crown, Treasure
- **Mood-Based Animations**: Happy, Working, Celebrating, Idle
- **Shop System**: Unlock items with earned currency

## 🛠️ Tech Stack

- **Framework**: React Native (Expo)
- **Navigation**: Expo Router (file-based routing)
- **State Management**: Zustand
- **Animations**: Reanimated 3
- **UI/UX**: Custom design system with ADHD-friendly principles
- **Haptics**: Expo Haptics for tactile feedback
- **TypeScript**: Full type safety

## 🎨 Design System

### Colors
- **Background**: Soft cream (#FDFBF7) - never harsh white
- **Primary**: Sage green (#8BA888) and Moss green (#5C7A58)
- **Accent**: Warm gold (#FFD166) for energy/celebration
- **Semantic**: Soft coral (#EF8354) for warnings (never harsh red)

### UX Principles
- **One Primary Action Per Screen**: Reduce cognitive load
- **High Border Radius**: Soft, rounded, cozy feel
- **Generous Spacing**: Prevent visual overwhelm
- **Immediate Feedback**: Every interaction has visual/haptic response
- **Auto-Save Everything**: No "Save" buttons
- **Supportive Copy**: "Your garden is resting" not "You failed"

## 📁 Project Structure

```
cozy-growth/
├── app/                      # Expo Router screens
│   ├── (tabs)/              # Main tab navigation
│   │   ├── index.tsx        # Home/Garden Scene
│   │   ├── garden.tsx       # All Goals view
│   │   ├── journal.tsx      # Seeds/Sprouts/Blooms
│   │   └── shop.tsx         # Customization shop
│   ├── _layout.tsx          # Root layout
│   └── onboarding.tsx       # First-time user flow
├── src/
│   ├── components/
│   │   ├── avatar/          # Sprout character components
│   │   ├── garden/          # Garden scene, plants, weeds
│   │   ├── tasks/           # Task management UI
│   │   └── ui/              # Shared components (Button, Card)
│   ├── constants/           # Design tokens (colors, typography)
│   ├── store/               # Zustand state management
│   ├── types/               # TypeScript type definitions
│   ├── hooks/               # Custom React hooks
│   └── utils/               # Helper functions
└── assets/                  # Images, sounds, Lottie files
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo CLI
- iOS Simulator (Mac) or Expo Go app

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on Web
npm run web
```

### Development

```bash
# Clear cache and restart
npm start --clear

# Run with tunnel (for testing on physical device)
npm start --tunnel
```

## 🎯 Roadmap

### Current Implementation (v1.0)
- [x] Core design system
- [x] Zustand state management
- [x] Home screen with Garden Scene
- [x] Sprout Avatar with animations
- [x] Onboarding flow
- [x] Tab navigation structure

### Coming Soon
- [ ] Task creation and AI breakdown
- [ ] Timer functionality with haptic feedback
- [ ] Full shop implementation
- [ ] Journal entries (Seeds/Sprouts/Blooms)
- [ ] Streak tracking with Grace Blooms
- [ ] Sound effects and ambient audio
- [ ] Persistent storage (AsyncStorage/Supabase)
- [ ] Task suggestions based on patterns
- [ ] Calendar view with streak visualization
- [ ] Export/share garden progress

### Future Enhancements
- [ ] Widget support for iOS/Android
- [ ] Companion web dashboard
- [ ] Accountability partner features
- [ ] Custom plant types
- [ ] Seasonal themes
- [ ] Achievement system

## 🤝 Contributing

This app is designed with ADHD users in mind. If you have ADHD or work in accessibility/mental health, your feedback is especially valuable!

## 📝 License

MIT License - See LICENSE file for details

## 💚 Acknowledgments

Built with love for the neurodivergent community. Because every tiny step is growth worth celebrating.

---

**"Your garden is resting" - not "You failed"** 🌿
