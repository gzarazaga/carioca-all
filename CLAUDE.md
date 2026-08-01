# Carioca Card Game - Monorepo

Juego de cartas Carioca (variante de Rummy) con backend en Java, frontend web en React y UI mobile en React Native.

## Estructura del proyecto

```
carioca-all/
├── carioca/          # Backend - Spring Boot (Java 17, Maven)
├── carioca-fe/       # Frontend web - React + TypeScript (Vite)
└── carioca-mobile/   # Frontend mobile - React Native + Expo
```

## Backend (`carioca/`)

### Stack
- Java 17, Spring Boot 3.2, Maven
- Spring Web, WebSocket, Data JPA, Validation
- Lombok, MapStruct
- H2 (dev) / PostgreSQL (prod)

### Arquitectura: Clean Architecture (Hexagonal)
```
com.carioca/
├── domain/
│   ├── model/          # Entidades: Partida, Jugador, Carta, Ronda, Formacion, Mazo
│   ├── exception/      # Excepciones de dominio
│   ├── port/out/       # Puertos de salida (repositorios, notificación, eventos)
│   ├── service/        # Servicios de dominio (validación, puntos, turnos, rondas)
│   │   └── impl/
│   └── usecase/        # Casos de uso organizados por contexto
│       ├── partida/    # crear, unirse, obtener
│       └── juego/      # robarcarta, descartarcarta, bajarformacion, pegarcarta
├── infrastructure/
│   └── adapter/
│       ├── in/rest/    # Controllers REST + DTOs (request/response) + Mappers
│       ├── in/websocket/ # WebSocket handler para tiempo real
│       └── out/        # Persistence adapters (JPA entities, repos, mappers), events, notifications
└── config/             # Configuración Spring (WebSocket, beans)
```

### Convenciones backend
- Los use cases siguen patrón Command → UseCase → Response
- Cada use case tiene su propio paquete con Command, UseCase (interface), impl/, y opcionalmente un Response
- Los mappers se implementan con MapStruct
- Los nombres de clases están en español (Partida, Jugador, Carta, Ronda, etc.)
- Las excepciones de dominio son específicas: MovimientoInvalidoException, TurnoInvalidoException, etc.

### Comandos backend
```bash
cd carioca
mvn spring-boot:run              # Iniciar en dev (H2, puerto 8080)
mvn test                         # Ejecutar tests
mvn clean package                # Build
```

### Perfiles
- `dev`: H2 en memoria, console H2 en `/h2-console`, SQL visible
- `prod`: PostgreSQL, sin H2 console

## Frontend (`carioca-fe/`)

### Stack
- React 19, TypeScript 5.9, Vite 7
- Tailwind CSS 4, PostCSS
- Zustand (state management)
- React Router DOM 7

### Estructura
```
src/
├── pages/          # HomePage, LobbyPage, GamePage, ResultsPage
├── components/
│   ├── card/       # Card, CardBack, CardHand
│   ├── game/       # GameBoard, RoundInfo, TurnIndicator, DrawPile, DiscardPile, FormationsArea, PlayerHand, OpponentRow
│   ├── actions/    # ActionBar, FormationBuilder, PegarDialog
│   ├── lobby/      # PlayerList, GameCode
│   └── common/     # Toast, Scoreboard
├── stores/         # gameStore.ts (Zustand)
├── services/       # api.ts (REST), websocket.ts (WS)
├── hooks/
├── types/
└── utils/
```

### Comandos frontend
```bash
cd carioca-fe
npm run dev          # Dev server en puerto 5173
npm run build        # Build producción (tsc + vite build)
npm run lint         # ESLint
npm run preview      # Preview del build
```

### Proxy (dev)
- `/api/*` → `http://localhost:8080`
- `/ws/*` → `ws://localhost:8080`

## Mobile (`carioca-mobile/`)

### Stack
- Expo SDK 57 (React Native 0.86, React 19), TypeScript
- Expo Router (navegación por archivos)
- NativeWind (Tailwind para RN)
- Zustand, AsyncStorage

### Estructura
Mismo patrón que `carioca-fe/src/` (types, services, stores, hooks, utils, components), portado a primitivas de React Native. Las pantallas están en `app/` (Expo Router) en vez de `pages/`. Ver `carioca-mobile/README.md` para el detalle de qué se portó tal cual y qué se reescribió.

### Comandos mobile
```bash
cd carioca-mobile
npm install
npx expo start       # Dev server; escanear QR con Expo Go
npx tsc --noEmit      # Type-check
```

Por defecto apunta al backend deployado en Render (`.env`), no a un backend local — ver README para cambiar esto.

## Idioma

El dominio del proyecto está en **español** (nombres de clases, variables de dominio, comentarios). Los nombres técnicos de frameworks (Controller, Service, Repository, etc.) se mantienen en inglés.
