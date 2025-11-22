# 🌱 Cozy Growth - Zero-Friction Onboarding Specification

## Design Philosophy

**The IKEA Effect**: Users invest emotional energy before we ask for anything in return.
**Compassion Over Discipline**: Every interaction reinforces that this is a safe, shame-free space.
**Show, Don't Tell**: Learn by doing, not reading instructions.

---

## 📱 Scene-by-Scene Breakdown

### Scene 1: The Potential (The Seed)
**Duration**: 5-10 seconds
**Goal**: Create curiosity and invite interaction

#### Visual Design
- **Background**: Deep, rich soil brown (#3D2817) with subtle texture
- **Seed**: Centered, glowing white seed (40x50px) with gentle pulse animation
- **Lighting**: Soft rim light around seed (radial gradient, warm gold #FFD166)
- **Particles**: Occasional tiny sparkles floating upward (very subtle)

#### Interaction
- **State**: Idle - seed pulses gently (scale 1.0 → 1.05, 2s ease-in-out loop)
- **Action Required**: Tap and hold the seed for 2 seconds
- **Visual Feedback**:
  - On touch down: Seed stops pulsing, glows brighter
  - Progress ring appears around seed (fills over 2s)
  - Haptic: Soft impact on touch down
  - Haptic: Success pattern on completion

#### Copy
```
Top of screen (fade in after 1s):
"Every big journey starts with a single seed."

Bottom of screen (fade in after 2s):
[Icon: finger with hold gesture]
"Hold to plant"
```

#### Animation Sequence on Completion
1. Progress ring completes → Medium haptic
2. Seed shakes excitedly (3 quick bounces)
3. Bright flash of golden light
4. Screen transitions to soil texture
5. Seed burrows into soil (moves down, fades)
6. → Transition to Scene 2

---

### Scene 2: The Connection (The Sprout Emerges)
**Duration**: 15-20 seconds
**Goal**: Create immediate emotional bond through vulnerability

#### Visual Design
- **Background**: Soil texture (top half darker #3D2817, bottom lighter #F5E6D3)
- **Animation Stage**:
  - Soil "cracks" appear where seed was planted
  - Two tiny green leaves push through (animated spring)
  - Sprout character "pops" up with surprised expression
  - Confetti particles (leaves, sparkles) burst around Sprout

#### Character Introduction
- **Sprout Appearance**:
  - Default design: Round green body, two leaf arms, big eyes
  - Expression: Wide-eyed, slightly scared but hopeful
  - Size: Starts small (100px), grows to 180px during emergence
  - Animation: Breathing idle (gentle bob)

#### Dialogue System
Speech bubbles appear above Sprout with typewriter effect:

```
Bubble 1 (auto, after emergence):
"Oh! Hi there! 👋"
[Wait 1.5s, auto-advance]

Bubble 2:
"I'm a little nervous... I just sprouted!"
[Wait 2s, auto-advance]

Bubble 3:
"I don't have a name yet..."
[Wait 1.5s]
"Could you give me one?"
[Input field appears]
```

#### Interaction
- **Input Field**:
  - Appears below Sprout with gentle slide-up + haptic
  - Placeholder: "What should we call you?"
  - Style: Soft white rounded rectangle, sage green border
  - Max length: 15 characters
  - Auto-focus keyboard

- **Validation**:
  - Disabled submit if empty
  - Trim whitespace
  - Capitalize first letter automatically

- **Submit Button**:
  - Label: "That's perfect!" (only appears when name entered)
  - Style: Warm gold button, bounces when appears
  - Haptic: Light impact on press

#### Animation on Name Submission
1. Keyboard dismisses smoothly
2. Input field fades out
3. Sprout jumps excitedly (2 bounces) + Medium haptic
4. Speech bubble appears:
   ```
   "[Name]! I love it! 💚"
   ```
5. Wait 1.5s
6. Sprout expression changes to happy/confident
7. Fade to Scene 3

---

### Scene 3: The Vibe Check (Setting the Environment)
**Duration**: 10-15 seconds
**Goal**: Give user control while teaching customization exists

#### Visual Design
- **Background**: Fades from soil to soft cream (#FDFBF7)
- **Sprout Position**: Moves to left side of screen (smaller, 120px)
- **Layout**: Card-based selection in center/right

#### Dialogue
```
Sprout (top-left):
"Now... what kind of garden should we grow together?"

Subtext (below Sprout):
"This will be our cozy space. Choose what feels right."
```

#### Vibe Options (3 Cards, Vertically Stacked)

**Option 1: Peaceful Garden**
- **Icon**: 🧘‍♀️ Meditation pose, soft leaves
- **Color Preview**: Sage greens, soft blues, cream
- **Label**: "Peaceful Garden"
- **Description**: "Calm, minimal, breathing room"
- **Theme Values**:
  - Accent: Soft blue (#A7C6DA)
  - Emphasis on white space
  - Gentle animations

**Option 2: Wild Bloom**
- **Icon**: 🌺 Colorful flowers, butterflies
- **Color Preview**: Warm golds, coral, bright greens
- **Label**: "Wild Bloom"
- **Description**: "Vibrant, energetic, full of life"
- **Theme Values**:
  - Accent: Bright coral (#EF8354)
  - More particles and effects
  - Faster animations

**Option 3: Cozy Cottage**
- **Icon**: 🏡 Little house, organized rows
- **Color Preview**: Earthy browns, sage, warm cream
- **Label**: "Cozy Cottage"
- **Description**: "Structured, warm, like home"
- **Theme Values**:
  - Accent: Moss green (#5C7A58)
  - Grid-based layouts
  - Steady, reliable animations

#### Interaction
- **Card Hover**: Scale up slightly (1.02), shadow deepens
- **Card Select**:
  - Border glows with theme accent color
  - Haptic: Light impact
  - Sprout reacts with excited animation
  - Sprout speech bubble: "Ooh, that's lovely!"

- **Continue Button**:
  - Appears at bottom when selection made
  - Label: "Let's grow! 🌱"
  - Style: Uses selected theme accent color

#### Animation on Submission
1. Selected card scales up and fills screen
2. Other cards fade out
3. Background transitions to chosen theme colors
4. Sprout jumps to center + Medium haptic
5. Fade to Scene 4

---

### Scene 4: The First Win (The Tutorial)
**Duration**: 20-30 seconds
**Goal**: Teach core mechanic, deliver instant gratification, ensure success

#### Visual Design
- **Background**: Full chosen theme applied
- **Garden Scene**: Simple garden plot with soil
- **Sprout Position**: Center, standing in garden (200px)
- **UI Elements**: Top bar shows "Sunlight: 0 ☀️"

#### Tutorial Flow

**Step 1: The Need**
```
Sprout looks tired, droopy animation

Speech bubble:
"[Name], I'm feeling a little thirsty... 💧"

[Wait 1s]

"Could you help me?"

[Watering can button appears]
```

**Step 2: The Action**
- **Watering Can Button**:
  - Position: Bottom center, large (80px)
  - Icon: Glowing watering can
  - Pulse animation to draw attention
  - Label below: "Water your Sprout"

- **Interaction**:
  - Tap triggers watering animation
  - Haptic: Medium impact
  - Confetti of water droplets
  - Watering can tilts, water particles pour

**Step 3: The Reward**
Sequence (over 3 seconds):
1. Water droplets hit Sprout
2. Sprout perks up with spring animation
3. Sparkles appear around Sprout
4. Sprout does happy spin (360°)
5. Success haptic pattern
6. Speech bubble:
   ```
   "Ahh! Thank you! I feel so much better! ✨"
   ```
7. **Currency Reward Animation**:
   - "+5 Sunlight" appears above Sprout
   - Floats up to top bar
   - Top bar counter: 0 → 5 (animated count-up)
   - Gentle glow effect on counter

**Step 4: The Explanation**
```
Sprout (calmer now):
"When you take care of yourself, you take care of me too!"

[Wait 2s]

"Every time you complete a task, we both grow stronger. 🌱"

[Wait 2s]

"Ready to see our garden?"

[Button appears: "Show me around!"]
```

#### Animation on Completion
1. Button press → Heavy haptic
2. Zoom out animation
3. Garden expands, more plot space revealed
4. Additional UI elements fade in (tabs, menu)
5. Gentle tour arrows point to:
   - Task list
   - Shop icon
   - Journal
6. Onboarding complete flag set
7. Transition to main app (tabs/index)

---

## 🎨 Animation & Juice Specification

### Haptic Feedback Patterns

| Event | Haptic Type | Timing |
|-------|------------|--------|
| Seed touch down | Light | Immediate |
| Seed plant complete | Medium | On completion |
| Sprout emerges | Success pattern | 3-tap burst |
| Name submission | Light | On tap |
| Vibe card select | Light | On tap |
| Vibe submit | Medium | On tap |
| Watering can tap | Medium | On tap |
| Reward received | Success pattern | 2-tap burst |

### Particle Effects

**Seed Planting**
- Type: Golden sparkles
- Count: 20-30 particles
- Duration: 1s
- Direction: Radial burst
- Fade: Exponential

**Sprout Emergence**
- Type: Leaf confetti + sparkles
- Count: 40-50 particles
- Duration: 1.5s
- Direction: Upward spray
- Colors: Mix of greens + golds

**Watering**
- Type: Water droplets
- Count: 15-20 particles
- Duration: 1s
- Direction: Arc from can to Sprout
- Physics: Gravity simulation

**Sunlight Reward**
- Type: Golden rays + sparkles
- Count: 10-15 particles
- Duration: 0.8s
- Direction: From Sprout to UI counter
- Effect: Light trail

### Transition Timing

| Transition | Duration | Easing |
|------------|----------|--------|
| Scene 1 → 2 | 800ms | ease-out |
| Scene 2 → 3 | 600ms | ease-in-out |
| Scene 3 → 4 | 1000ms | ease-out |
| Scene 4 → Main | 1200ms | ease-in-out |

### Spring Animations
- Default: `{ stiffness: 300, damping: 20 }`
- Bouncy (Sprout jump): `{ stiffness: 400, damping: 15 }`
- Gentle (floating): `{ stiffness: 150, damping: 25 }`

---

## 📊 Data Structure

### Onboarding State Schema (JSON)

```json
{
  "onboarding": {
    "version": "1.0",
    "started_at": "2025-11-22T10:30:00Z",
    "completed": false,
    "current_scene": 1,

    "progress": {
      "seed_planted": false,
      "sprout_named": false,
      "theme_selected": false,
      "first_task_completed": false
    },

    "user_data": {
      "sprout_name": null,
      "selected_theme": null,
      "first_interaction_timestamp": null
    },

    "session_data": {
      "times_opened": 1,
      "total_time_in_onboarding_seconds": 0,
      "scenes_completed": []
    }
  },

  "user": {
    "id": null,
    "created_at": null,
    "sprout": {
      "name": null,
      "mood": "happy",
      "outfit": "farmer",
      "level": 1
    },
    "preferences": {
      "theme": "cozy-cottage",
      "haptics_enabled": true,
      "sound_enabled": true
    },
    "progress": {
      "sunlight": 5,
      "seeds": 0,
      "current_streak": 1,
      "total_days": 1
    }
  }
}
```

### TypeScript Interfaces

```typescript
type OnboardingScene = 1 | 2 | 3 | 4;
type ThemeOption = 'peaceful-garden' | 'wild-bloom' | 'cozy-cottage';

interface OnboardingProgress {
  seed_planted: boolean;
  sprout_named: boolean;
  theme_selected: boolean;
  first_task_completed: boolean;
}

interface OnboardingState {
  version: string;
  started_at: Date;
  completed: boolean;
  current_scene: OnboardingScene;
  progress: OnboardingProgress;
  user_data: {
    sprout_name: string | null;
    selected_theme: ThemeOption | null;
    first_interaction_timestamp: Date | null;
  };
  session_data: {
    times_opened: number;
    total_time_in_onboarding_seconds: number;
    scenes_completed: OnboardingScene[];
  };
}
```

---

## 🔄 Edge Cases & Recovery

### Case 1: User Closes App During Scene 1 (Seed)
**Behavior**: Reset to Scene 1 on return
**Reason**: No data captured yet, let them start fresh
**Implementation**: Check if `seed_planted === false`, show Scene 1

### Case 2: User Closes App During Scene 2 (Before Naming)
**Behavior**: Return to Scene 2, show emergence animation again (skip if seen)
**Reason**: Naming is crucial for emotional connection
**Implementation**:
```javascript
if (sprout_named === false) {
  if (session_data.scenes_completed.includes(2)) {
    // Skip emergence animation, go straight to name input
    showScene2(skipAnimation: true)
  } else {
    // Show full animation
    showScene2(skipAnimation: false)
  }
}
```

### Case 3: User Closes App After Naming (Scene 2 Complete)
**Behavior**: Return to Scene 3 (Vibe Check)
**Reason**: Name is saved, continue journey
**Implementation**:
```javascript
if (sprout_named === true && theme_selected === false) {
  showScene3()
  // Sprout greets: "[Name]! You're back! Let's keep going."
}
```

### Case 4: User Closes App During Scene 3
**Behavior**: Return to Scene 3 with saved name
**Reason**: Theme selection is quick, ask again
**Implementation**: Same as Case 3

### Case 5: User Closes App During Scene 4 (Tutorial)
**Behavior**: Return to Scene 4, skip tutorial setup, go straight to action
**Reason**: Don't bore returning users
**Implementation**:
```javascript
if (first_task_completed === false && current_scene === 4) {
  if (session_data.times_opened > 1) {
    // Short version
    showScene4(condensed: true)
    // Sprout: "Let's finish what we started! Water me?"
  }
}
```

### Case 6: User Completes Onboarding but Crashes Before Saving
**Behavior**: Check all progress flags on app open
**Implementation**:
```javascript
const isOnboardingComplete = () => {
  return (
    progress.seed_planted &&
    progress.sprout_named &&
    progress.theme_selected &&
    progress.first_task_completed
  )
}

// On app launch:
if (isOnboardingComplete() && !onboarding.completed) {
  // Mark as complete and go to main app
  markOnboardingComplete()
  router.replace('/(tabs)')
}
```

### Persistence Strategy
- **Local Storage**: AsyncStorage for onboarding state
- **Save Frequency**: After each scene completion
- **Backup**: Save on every user input (name, theme selection)
- **Key**: `@cozy_growth:onboarding_state`

---

## 🎭 Dialogue & Copy Bank

### Sprout Personality
- Vulnerable but hopeful
- Uses contractions ("I'm" not "I am")
- Occasional emoji (1 per message max)
- Breaks fourth wall gently
- Never pushy or demanding

### Alternative Dialogue Options

**Scene 2 Variations** (random selection):
```
Option A:
"Oh! Hi there! 👋"
"I'm a little nervous... I just sprouted!"

Option B:
"*gasp* Is someone there?"
"I'm so glad you're here... I was a little scared."

Option C:
"Hello! You must be the one who planted me!"
"Thank you for that. What's your name? I'd love to know who helped me grow."
```

**Scene 4 Variations** (based on time of day):
```
Morning (6am-12pm):
"Good morning, [Name]! I'm feeling a little thirsty... Could you help me?"

Afternoon (12pm-6pm):
"Hey [Name]! The sun is so warm today... I could use some water!"

Evening (6pm-12am):
"[Name], before we rest for the night... could I have a little water?"

Night (12am-6am):
"[Name]... I know it's late, but I'm a bit thirsty... 💧"
```

---

## 📐 UI Layout Specifications

### Scene 1
```
┌─────────────────────────┐
│                         │
│   "Every big journey    │
│   starts with a seed"   │
│                         │
│          ✨🌰✨         │  ← Glowing seed (center)
│                         │
│      [Hold to plant]    │
│          👆            │
│                         │
└─────────────────────────┘
```

### Scene 2
```
┌─────────────────────────┐
│      💬 Speech bubble   │
│      "Oh! Hi there!"    │
│                         │
│          🌱            │  ← Sprout character
│       (animated)        │
│                         │
│  ┌──────────────────┐  │
│  │ Name input field  │  │
│  └──────────────────┘  │
│   [That's perfect!]     │
└─────────────────────────┘
```

### Scene 3
```
┌─────────────────────────┐
│ 🌱 "What kind of        │
│    garden should we     │
│    grow together?"      │
│                         │
│  ┌─────────────────┐   │
│  │ 🧘 Peaceful     │   │
│  │ Garden          │   │
│  └─────────────────┘   │
│  ┌─────────────────┐   │
│  │ 🌺 Wild Bloom   │   │
│  └─────────────────┘   │
│  ┌─────────────────┐   │
│  │ 🏡 Cozy Cottage │   │
│  └─────────────────┘   │
│                         │
│    [Let's grow! 🌱]    │
└─────────────────────────┘
```

### Scene 4
```
┌─────────────────────────┐
│  Sunlight: 5 ☀️         │
│ ─────────────────────── │
│                         │
│    💬 "Ahh! Thank      │
│       you!"             │
│                         │
│         🌱✨           │  ← Happy Sprout
│       (garden)          │
│                         │
│                         │
│      [💧 Water]        │  ← Watering can button
│                         │
└─────────────────────────┘
```

---

## ⏱️ Timing Summary

| Scene | Minimum | Average | Maximum |
|-------|---------|---------|---------|
| 1. Seed | 5s | 8s | 20s |
| 2. Sprout | 10s | 18s | 60s |
| 3. Vibe | 8s | 12s | 40s |
| 4. Tutorial | 15s | 25s | 60s |
| **Total** | **38s** | **63s** | **180s** |

**Design Target**: 60-90 seconds for engaged users

---

## 🎯 Success Metrics

### Completion Rate Targets
- Scene 1 → 2: 95%+
- Scene 2 → 3: 90%+
- Scene 3 → 4: 95%+
- Scene 4 → Main: 85%+

### Engagement Indicators
- Average time in onboarding: 60-120s
- Name submission rate: 90%+
- Theme selection distribution: ~33% each (balanced)
- First task completion: 85%+

### Emotional Connection Signals
- User names Sprout (not "test" or gibberish): 80%+
- Returns after closing app mid-onboarding: 60%+
- Completes first session after onboarding: 70%+

---

## 🚀 Implementation Checklist

- [ ] Scene 1: Seed component with tap-and-hold
- [ ] Scene 2: Sprout emergence animation + naming
- [ ] Scene 3: Theme selection cards with previews
- [ ] Scene 4: Tutorial watering interaction
- [ ] Haptic feedback integration
- [ ] Particle systems (seed, emergence, water, rewards)
- [ ] Dialogue system with typewriter effect
- [ ] Onboarding state persistence (AsyncStorage)
- [ ] Edge case recovery logic
- [ ] Transitions between scenes
- [ ] Theme application system
- [ ] Currency reward animation
- [ ] Sound effects (optional)
- [ ] Analytics events tracking

---

**Last Updated**: 2025-11-22
**Version**: 1.0
**Status**: Ready for Implementation ✨
