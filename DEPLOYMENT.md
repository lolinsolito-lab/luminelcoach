# 🚀 LuminelCoach - Deployment Guide

Guida completa per il deployment di LuminelCoach in produzione.

---

## 📋 Pre-Deployment Checklist

Prima di effettuare il deployment, assicurati di aver completato questi passaggi:

- [ ] Build di produzione testato localmente
- [ ] Variabili d'ambiente configurate
- [ ] API Gemini key funzionante
- [ ] Test su Chrome, Firefox, Safari
- [ ] Test responsive (mobile/tablet/desktop)
- [ ] Lighthouse score > 90

---

## 🔑 Configurazione Variabili d'Ambiente

### Step 1: Crea file `.env.local`

Copia `.env.example` e rinomina in `.env.local`:

```bash
cp .env.example .env.local
```

### Step 2: Configura Gemini API Key

1. Vai su [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Crea una nuova API key
3. Copia la key in `.env.local`:

```env
GEMINI_API_KEY=your_actual_api_key_here
```

> **⚠️ IMPORTANTE**: Non committare `.env.local` su Git! È già in `.gitignore`.

---

## 🏗️ Build di Produzione

### Build Locale

```powershell
# Build production
npm run build:prod

# Output in cartella `dist/`
```

### Verifica Build

```powershell
# Testa il build localmente
npm run preview

# Apri browser su http://localhost:4173
```

### Analisi Bundle Size

```powershell
npm run analyze
# Genera report visivo dei chunks
```

**Target Sizes:**
- `vendor.js`: ~150KB (gzipped)
- `animations.js`: ~80KB (gzipped) 
- `ui.js`: ~20KB (gzipped)
- `ai.js`: ~50KB (gzipped)
- **Total**: < 500KB (gzipped)

---

## ☁️ Opzioni di Deployment

### Opzione 1: Vercel (Consigliato) ⚡

**Pro:** Deploy automatico, CDN globale, SSL gratis, zero configuration

#### Setup:

1. **Connetti GitHub**
   ```bash
   # Push codice su GitHub
   git init
   git add .
   git commit -m "Initial commit - v1.0.0"
   git remote add origin https://github.com/tuo-username/luminel-coach.git
   git push -u origin main
   ```

2. **Importa su Vercel**
   - Vai su [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Seleziona il tuo repository GitHub
   - Vercel rileva automaticamente Vite

3. **Configura Environment Variables**
   - Nel dashboard Vercel → Settings → Environment Variables
   - Aggiungi: `GEMINI_API_KEY` = `your_key_here`
   - Scope: Production, Preview, Development

4. **Deploy**
   - Click "Deploy"
   - Vercel esegue automaticamente `npm run build`
   - La tua app sarà live su `https://luminel-coach.vercel.app`

#### Auto-Deploy

Ogni push su `main` branch triggera un deploy automatico! 🚀

---

### Opzione 2: Netlify 🌐

**Pro:** Form handling, serverless functions, split testing

#### Setup:

1. **Build Settings**
   ```yaml
   # netlify.toml (opzionale)
   [build]
     command = "npm run build"
     publish = "dist"
   
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

2. **Deploy tramite CLI**
   ```bash
   # Installa Netlify CLI
   npm install -g netlify-cli
   
   # Login
   netlify login
   
   # Deploy
   netlify deploy --prod
   ```

3. **Deploy tramite UI**
   - Vai su [netlify.com](https://netlify.com)
   - Drag & drop la cartella `dist`
   - Oppure connetti GitHub per auto-deploy

4. **Environment Variables**
   - Site Settings → Build & Deploy → Environment
   - Aggiungi: `GEMINI_API_KEY`

---

### Opzione 3: Firebase Hosting 🔥

**Pro:** Integrazione con Firebase services, hosting veloce

#### Setup:

1. **Installa Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login e Init**
   ```bash
   firebase login
   firebase init hosting
   ```

3. **Configura `firebase.json`**
   ```json
   {
     "hosting": {
       "public": "dist",
       "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
       "rewrites": [{
         "source": "**",
         "destination": "/index.html"
       }]
     }
   }
   ```

4. **Build e Deploy**
   ```bash
   npm run build
   firebase deploy --only hosting
   ```

5. **Environment Variables**
   - Usa Firebase Environment Configuration
   - O gestisci tramite `.env.production`

---

### Opzione 4: GitHub Pages 📄

**Pro:** Hosting gratuito, facile per progetti open source

#### Setup:

1. **Install gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Aggiungi script in `package.json`**
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. **Deploy**
   ```bash
   npm run deploy
   ```

4. **Configura GitHub**
   - Repository Settings → Pages
   - Source: `gh-pages` branch
   - La tua app sarà su `https://username.github.io/repo-name`

> **Nota:** Per le variabili d'ambiente, dovrai embeddarle nel build o usare GitHub Secrets con GitHub Actions.

---

## 🔧 Troubleshooting

### Build Errors

**Error: "Cannot find module '@google/genai'"**
```bash
# Reinstalla dependencies
rm -rf node_modules package-lock.json
npm install
```

**Error: "Failed to resolve import"**
- Verifica che tutti i percorsi import usino gli alias corretti (`@/...`)
- Controlla `vite.config.ts` → `resolve.alias`

### Runtime Errors

**API Key Non Funziona**
- Verifica che l'env variable sia configurata correttamente
- Per Vite, le variabili DEVONO iniziare con `VITE_` per essere esposte client-side
- Aggiungi `VITE_GEMINI_API_KEY` e aggiorna il codice

**Routing Non Funziona**
- Se usi hash routing (`#/`), non serve configurazione
- Se usi history routing, configura redirect 404 → index.html sulla piattaforma

### Performance Issues

**Bundle Troppo Grande**
```bash
# Analizza il bundle
npm run analyze

# Considera lazy loading per route
const Dashboard = lazy(() => import('./components/Dashboard'));
```

**Tempo di Caricamento Lento**
- Abilita compression (gzip/brotli) sul server
- Usa CDN per assets statici
- Implementa service worker per caching

---

## 📊 Monitoring & Analytics

### Lighthouse CI

```bash
npm install -g @lhci/cli

lhci autorun --collect.url=https://your-app.vercel.app
```

### Sentry (Error Tracking)

```bash
npm install @sentry/react

# Configura in App.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: import.meta.env.MODE,
});
```

### Google Analytics (GA4)

Aggiungi in `index.html`:

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## ✅ Post-Deployment Checklist

Dopo il deploy, verifica:

- [ ] App accessibile all'URL di produzione
- [ ] SSL/HTTPS attivo (certificato valido)
- [ ] Tutte le route funzionano
- [ ] API Gemini risponde correttamente
- [ ] Form e interazioni funzionano
- [ ] Performance Lighthouse > 90
- [ ] Responsive su mobile/tablet
- [ ] Console senza errori
- [ ] Meta tags SEO visibili (View Source)

---

## 🔄 Continuous Deployment

### GitHub Actions Workflow

Crea `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build:prod
        env:
          GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

## 📞 Support

Problemi durante il deployment? 

1. Controlla i logs della piattaforma
2. Verifica [Common Issues](#troubleshooting)
3. Apri issue su GitHub con:
   - Platform usata (Vercel/Netlify/etc.)
   - Error message completo
   - Screenshot se applicabile

---

**Buon deploy! 🚀**
