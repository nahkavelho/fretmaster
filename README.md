# FretMaster
 
 FretMaster is a mobile-first guitar fretboard training app built with **Expo + React Native**. It’s designed as a practice tool that helps you memorize note locations on the fretboard through quick, game-like sessions. User progress and stats are stored with **Firebase Authentication** and **Firestore**.
 
 ## Demo
 
 - **Video demo:** (add link)
 - **Try it:** (add link to EAS build / TestFlight / APK)
 
 ## Screenshots
 
 Add screenshots/GIFs here for the best portfolio impact:
 
 - `assets/screenshots/menu.png`
 - `assets/screenshots/game.png`
 - `assets/screenshots/profile.png`
 
 Example:
 
 ```md
 ![Menu](assets/screenshots/menu.png)
 ![Game](assets/screenshots/game.png)
 ![Profile](assets/screenshots/profile.png)
 ```
 
 ## Features
 
 - **Fretboard quiz gameplay** (practice mode)
 - **Campaign/progression** with unlockable levels
 - **Best scores per level**
 - **Training stats** (recent sessions, total time, best streak)
 - **Firebase Auth**
   - Login
   - Password reset
   - Account deletion
 - **Theme support** and responsive UI adjustments
 
 ## Tech stack
 
 - **Expo / React Native**
 - **Expo Router**
 - **NativeWind** (Tailwind-style utility classes for React Native)
 - **Firebase** (Auth + Firestore)
 - **Zustand** (state management)
 
 ## Getting started
 
 ### Prerequisites
 
 - Node.js (LTS recommended)
 - Expo Go (for running on a physical device), or Android Studio / Xcode simulator
 
 ### Install
 
 ```bash
 npm install
 ```
 
 ### Run (development)
 
 ```bash
 npm run dev
 ```
 
 Run specific targets:
 
 ```bash
 npm run dev:android
 npm run ios
 npm run dev:web
 ```
 
 ## Scripts
 
 - `npm run dev`: starts Expo with cache cleared (`expo start -c`)
 - `npm run dev:web`: starts web target
 - `npm run dev:android`: starts Android target
 - `npm run ios`: starts iOS target
 - `npm run clean`: removes `.expo` and `node_modules` (note: uses `rm -rf`)
 
 ## Firebase configuration
 
 Firebase is initialized in `firebase.js`.
 
 - The Firebase **client config** (web API key, project ID, etc.) is not a secret by itself.
 - What matters is that you **do not** commit any admin/service-account keys and that your **Firestore Security Rules** are properly configured.
 
 If you want, you can move the config into environment variables (`.env`) and commit a `.env.example` for a cleaner public repo.
 
 ## Project structure (high level)
 
 - `app/`
   - Main screens and routing (Expo Router)
 - `app/components/`
   - App-specific UI (game/menu/profile/etc.)
 - `components/`
   - Reusable UI components
 - `src/`
   - Theme, hooks, constants, shared styling
 - `firebase.js`
   - Firebase init + Firestore helper functions (progress, scores, stats)
 
 ## What I learned / why this project matters
 
 - Building a cross-platform mobile UI with React Native + Expo
 - Structuring a non-trivial app with multiple screens and shared state
 - Implementing user accounts with Firebase Auth
 - Designing a simple Firestore data model for progress, per-level scores, and recent sessions
 - Handling UX details (themes, responsiveness, feedback animations)
 
 ## Roadmap (optional)
 
 - Add more training modes (timed drills, interval training)
 - Improve onboarding/tutorial
 - Add offline-first caching for stats
 
 ## License
 
 Add a license if you want to make it explicit (MIT is common for portfolio repos).