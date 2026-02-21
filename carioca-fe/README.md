# Carioca Card Game - Frontend

Interfaz web del juego de cartas Carioca, construida con **React 19** y **TypeScript**.

---

## Requisitos previos

- **Node.js 18+** — verificar con `node -v`
- **npm 9+** — verificar con `npm -v`
- **Backend corriendo** en `http://localhost:8080` (ver [carioca/README.md](../carioca/README.md))

---

## Ejecución local

### 1. Instalar dependencias

```bash
cd carioca-fe
npm install
```

### 2. Iniciar el servidor de desarrollo

```bash
npm run dev
```

La app queda disponible en `http://localhost:5173`.

Las llamadas a `/api/*` se redirigen automáticamente al backend en `http://localhost:8080` (configurado en `vite.config.ts`), por lo que no es necesario configurar nada adicional para desarrollo local.

---

## Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo con hot reload |
| `npm run build` | Compila TypeScript y genera el build de producción en `dist/` |
| `npm run preview` | Sirve el build de producción localmente para revisión |
| `npm run lint` | Ejecuta ESLint sobre el código fuente |
| `npm run test` | Ejecuta los tests en modo watch |
| `npm run test:run` | Ejecuta los tests una sola vez |
| `npm run test:ui` | Ejecuta los tests con interfaz gráfica de Vitest |

---

## Build de producción

```bash
npm run build
```

El build queda en el directorio `dist/`. Para previsualizarlo localmente:

```bash
npm run preview
```

---

## Estructura del proyecto

```
src/
├── pages/          # HomePage, LobbyPage, GamePage, ResultsPage
├── components/
│   ├── card/       # Card, CardBack, CardHand
│   ├── game/       # GameBoard, RoundInfo, TurnIndicator, DrawPile, DiscardPile,
│   │               # FormationsArea, PlayerHand, OpponentRow
│   ├── actions/    # ActionBar, FormationBuilder, PegarDialog
│   ├── lobby/      # PlayerList, GameCode
│   └── common/     # Toast, Scoreboard
├── stores/         # gameStore.ts (Zustand)
├── services/       # api.ts (REST), websocket.ts (WS)
├── hooks/
├── types/
└── utils/
```

---

## Tech Stack

- **React 19** + **TypeScript 5.9**
- **Vite 7** — build tool y dev server
- **Tailwind CSS 4** — estilos
- **Zustand 5** — manejo de estado global
- **React Router DOM 7** — navegación
- **Vitest** + **React Testing Library** — testing
