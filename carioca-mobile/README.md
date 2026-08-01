# Carioca Mobile

UI mobile (Android + iOS) para Carioca, hecha con React Native + Expo. Consume el mismo backend (Render) y base de datos (Neon) que `carioca-fe/`.

## Stack

- Expo SDK 57 (React Native 0.86, React 19)
- Expo Router (navegación por archivos, mapea 1:1 con las rutas de `carioca-fe`)
- NativeWind (Tailwind para RN — mismas clases que usa `carioca-fe`)
- Zustand (mismo store que la web, portado sin cambios)
- AsyncStorage (persistencia de sesión, equivalente mobile de `localStorage`)

## Estructura

Mismo patrón que `carioca-fe/src/`: `types/`, `services/` (API REST + WebSocket), `stores/`, `hooks/`, `utils/`, `components/`. Las pantallas viven en `app/` (Expo Router) y son el equivalente de las `pages/` de la web.

## Correr en desarrollo

```bash
npm install
npx expo start
```

Escaneá el QR con la app **Expo Go** (Android/iOS) para probar en un dispositivo físico, o presioná `a`/`i` en la terminal para abrir un emulador/simulador si lo tenés configurado.

Por defecto apunta al backend ya deployado en Render (`.env`), así que no hace falta levantar nada local. Para apuntar a un backend local corriendo en tu máquina, necesitás la IP LAN de tu compu (no `localhost`, que en el celular apunta al propio celular):

```bash
# .env.local (no se commitea)
EXPO_PUBLIC_API_URL=http://<tu-ip-lan>:8080
EXPO_PUBLIC_WS_URL=ws://<tu-ip-lan>:8080/ws
```

## Build para las tiendas

Requiere cuenta de Expo (gratis) y, para publicar, cuenta de desarrollador en Google Play / Apple Developer Program.

```bash
npx eas build --platform android --profile preview
npx eas build --platform ios --profile preview
```
