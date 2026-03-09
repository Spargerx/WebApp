# WebApp

A React Native app that turns any website into a standalone fullscreen app experience. Add your favorite websites and launch them like native apps — all from one place.

## Features

- **🌐 Website-to-App Container** — Add any website URL and run it in a fullscreen, app-like WebView
- **🏠 Home Screen Grid** — All your saved websites displayed as app icons in a clean grid layout
- **➕ Quick Add** — Bottom sheet modal to add new websites with name and URL
- **🗑️ Easy Remove** — Delete apps you no longer need with a single tap
- **🔙 Smart Back Navigation** — Hardware back button navigates within the website first, then exits to the home screen
- **💾 Persistent Storage** — Saved apps are stored locally using MMKV for instant, offline-ready loading
- **🎨 Dark Theme** — Premium dark UI with no white screen flash on startup
- **📱 Pull to Refresh** — Refresh any website with a native pull-down gesture

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native CLI |
| Navigation | React Navigation (Native Stack) |
| WebView | react-native-webview |
| State | Zustand |
| Storage | react-native-mmkv (Nitro) |
| Icons | Lucide React Native + react-native-svg |
| Language | TypeScript |

## Getting Started

### Prerequisites

- Node.js >= 22
- Android Studio with SDK & emulator (or a physical device)
- JDK 17+

### Installation

```bash
# Clone the repo
git clone https://github.com/Spargerx/WebApp.git
cd WebApp

# Install dependencies
npm install

# Start Metro bundler
npm run start

# Run on Android (in a separate terminal)
npm run android
```

## Project Structure

```
src/
├── navigation/
│   └── AppNavigator.tsx      # Stack navigator (Home → AppViewer)
├── screens/
│   ├── HomeScreen.tsx         # App grid + Add modal
│   └── AppViewerScreen.tsx    # Fullscreen WebView container
└── store/
    └── useAppStore.ts         # Zustand + MMKV persistent store
```

## License

MIT
