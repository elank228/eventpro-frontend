# EventPro — Frontend

Interface web React pour la plateforme de gestion d'événements d'entreprise.

## Stack

- React 18 + TypeScript
- Vite
- React Router v6
- Axios

## Prérequis

- [Node.js 18+](https://nodejs.org)
- L'API backend doit tourner sur `https://localhost:7202`

## Installation

```bash
# 1. Cloner le dépôt
git clone https://github.com/<votre-user>/eventpro-frontend.git
cd eventpro-frontend

# 2. Installer les dépendances
npm install

# 3. Lancer en développement
npm run dev
```

Application disponible sur : `http://localhost:3000`

## Structure

```
src/
├── api/          axios.ts (intercepteur JWT), events.ts (appels API)
├── components/   Navbar, EventCard, ProtectedRoute
├── context/      AuthContext (état global auth)
├── pages/        LoginPage, RegisterPage, EventsPage, EventDetailPage, EventFormPage
└── types/        index.ts (interfaces TypeScript)
```

## Configuration

Le proxy Vite redirige automatiquement `/api/*` vers `https://localhost:7202`.
Pour changer l'URL de l'API, modifier `vite.config.ts` :

```ts
proxy: {
  '/api': {
    target: 'https://votre-api.com',
    changeOrigin: true,
    secure: false,
  }
}
```

## Build production

```bash
npm run build
# Les fichiers sont générés dans dist/
```
