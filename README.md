# JhimFit — Ghana Fitness Tracker

A progressive web app (PWA) for fitness and nutrition tracking, built specifically for Ghanaian users.

## Features

- **Nutrition tracking** — Log meals from a curated Ghanaian food database with accurate calorie and macro data
- **Guided workout plans** — Lose Weight and Build Muscle programmes with animated exercise guides
- **Live workout timer** — Session stopwatch, auto rest countdowns, set tracking
- **Progress stats** — Weekly calorie charts, weight log, streak tracking, XP levelling system
- **Spirit Animal system** — Personalised gamification based on your fitness goal
- **Cloud sync** — Supabase backend syncs data across all your devices
- **PWA** — Installable on Android and iOS, works offline

## Tech Stack

- **Frontend** — React 18, Vite
- **Backend** — Supabase (PostgreSQL, Auth, Row Level Security)
- **Hosting** — Vercel
- **Styling** — CSS-in-JS (inline styles), Bebas Neue + Georgia typography

## Project Structure

```
src/
  components/       # UI components (one per file)
    AuthScreen.jsx
    Cards.jsx
    EditProfile.jsx
    ExerciseDrillModal.jsx
    HelpContent.jsx
    JhimFitLogo.jsx
    LevelBadge.jsx
    Onboarding.jsx
    ProgressSprites.jsx
    SpiritAvatar.jsx
  data/             # Static data and constants
    constants.js
    meals.js
    workouts.js
  hooks/            # Custom React hooks
    index.js
  styles/           # Global styles
    global.js
  utils/            # Helper functions
    helpers.js
  App.jsx           # Root component and layout
  main.jsx          # Entry point
  supabase.js       # Supabase client and API helpers
```

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## Environment Variables

Create a `.env` file in the root:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Database Schema

See `supabase/migrations/` for the full schema. Tables:

- `profiles` — user profile data
- `food_logs` — daily meal entries
- `workout_logs` — completed workout sessions
- `weight_logs` — weight tracking entries
- `water_logs` — daily hydration tracking

## Contributing

Pull requests welcome. Please open an issue first to discuss major changes.

## License

MIT — built by Joachim Naakureh
