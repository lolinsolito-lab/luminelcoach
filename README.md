<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 🌸 Luminel Coach - Transformational AI Coaching

> Il tuo coach di trasformazione personale intelligente, con design luxury e tecnologia all'avanguardia.

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/yourusername/luminel-coach)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-19.2-61dafb.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646cff.svg)](https://vitejs.dev/)

---

## ✨ Features

### 🎯 Core Functionality
- **AI-Powered Coaching** - Gemini 2.5 Flash per coaching personalizzato
- **8 Intelligenze Artificiali** - Sistema proprietario multi-AI
- **Percorsi Personalizzati** - Ebook, piani, esercizi su misura
- **Valutazione Benessere** - Tracking scientifico dei progressi
- **Meditazione Guidata** - Sessioni personalizzate multi-livello

### 🎨 Luxury Design System
- **Glassmorphism Effects** - Backdrop blur e trasparenze eleganti
- **CSS Variables Theming** - Light/Dark mode con transizioni fluide
- **Inter Font** - Typography professionale e moderna
- **Sakura Petals Animation** - Canvas-based ambient effects
- **Micro-Animations** - Hover lifts, fade-ins, smooth transitions

### 🛠️ Technical Excellence
- **React 19.2** - Ultima versione per performance ottimali
- **Vite 6.2** - Build ultra-veloce e HMR istantaneo
- **TypeScript 5.8** - Type safety completo
- **Framer Motion 12** - Animazioni fluide 60fps
- **shadcn/ui Components** - Sistema componenti professionale

### 📱 User Experience
- **Fully Responsive** - Mobile-first design
- **Accessibility** - WCAG 2.1 AA compliant
- **Fast Loading** - Lighthouse score > 90
- **Offline Support** - Progressive Web App capabilities

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ 
- **npm** 8+
- **Gemini API Key** ([Get it here](https://aistudio.google.com/app/apikey))

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/luminel-coach.git

# Navigate to project
cd luminel-coach

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local and add your GEMINI_API_KEY

# Start development server
npm run dev
```

App will run on `http://localhost:3000` 🎉

---

## 📦 Build Commands

```bash
# Development server with HMR
npm run dev

# Production build with optimizations
npm run build:prod

# Preview production build locally
npm run preview

# Analyze bundle size
npm run analyze
```

---

## 🎨 Design System Overview

### Color Palette

```css
/* Primary Colors */
--primary: hsl(160 40% 50%)      /* Teal/Emerald */
--secondary: hsl(36 47% 90%)     /* Warm Beige */
--accent: hsl(21 100% 70%)       /* Orange Accent */

/* Semantic Colors */
--success: hsl(142 71% 45%)      /* Green */
--warning: hsl(43 96% 56%)       /* Amber */
--destructive: hsl(0 84% 60%)    /* Red */
```

### Typography Scale

```css
h1: 3xl (30px) → 4xl (36px)  /* Mobile → Desktop */
h2: 2xl (24px) → 3xl (30px)
h3: xl (20px) → 2xl (24px)
body: base (16px)
small: sm (14px)
```

### Component Library

- **Buttons** - 6 variants × 3 sizes = 18 combinations
- **Cards** - Full system with Header/Content/Footer
- **Badges** - 6 semantic variants
- **Glassmorphic Panels** - `.glass` utility class
- **Sakura Effect** - Reusable canvas animation

---

## 📁 Project Structure

```
luminel-coach /
├── components/
│   ├── ui/                    # shadcn/ui components
│   │   ├── button.tsx         # Button variants
│   │   ├── card.tsx           # Card system
│   │   └── badge.tsx          # Status badges
│   ├── Dashboard.tsx          # Main dashboard
│   ├── WelcomePage.tsx        # Onboarding flow
│   ├── ProfilePage.tsx        # User profile
│   └── SakuraEffect.tsx       # Ambient animation
├── contexts/
│   ├── AuthContext.tsx        # Authentication
│   └── ProgressContext.tsx    # User progress
├── lib/
│   └── utils.ts               # Utility functions
├── services/
│   └── geminiService.ts       # AI integration
├── index.css                  # Design system (600+ lines)
├── vite.config.ts             # Build configuration
└── package.json               # v1.0.0
```

---

## 🌐 Deployment

Deploy su Vercel, Netlify, Firebase o GitHub Pages.

**Guida completa:** [DEPLOYMENT.md](DEPLOYMENT.md)

### Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/luminel-coach)

1. Click button sopra
2. Configura `GEMINI_API_KEY` nelle environment variables
3. Deploy! ✨

---

## 🧪 Testing

```bash
# Type check
npm run typecheck

# Lint
npm run lint

# Build test
npm run build
```

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file.

---

## 🙏 Acknowledgments

- **Google Gemini** - AI coaching engine
- **shadcn/ui** - Component system inspiration
- **Vercel** - Hosting platform
- **Framer Motion** - Animation library

---

## 📞 Support

- 📧 Email: support@luminelcoach.app
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/luminel-coach/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/yourusername/luminel-coach/discussions)

---

<div align="center">

**Made with ❤️ and ☕ for transformational growth**

⭐ Star us on GitHub — it motivates us a lot!

[Website](https://luminelcoach.app) · [Documentation](https://docs.luminelcoach.app) · [Demo](https://demo.luminelcoach.app)

</div>
