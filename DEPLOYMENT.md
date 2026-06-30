# Deployment

Notas de evaluación de hosting gratuito para los dos componentes + base de datos. Pendiente: ejecutar el deploy con la combinación elegida.

## Decisión

**Render (backend) + Neon (base de datos) + Vercel (frontend).**

Por qué: el Postgres free de Render expira a los 90 días y hay que recrearlo a mano, así que conviene desacoplar la DB del host de la app — Neon (Postgres serverless) no tiene ese límite. Fly.io queda como alternativa solo si el cold-start de Render (~30-60s tras 15 min de inactividad) resulta molesto, pero exige tarjeta para verificar la cuenta, cosa que Render no pide.

## Restricciones conocidas
- Railway descartado: falló en un uso anterior.
- Backend (`carioca/`) usa WebSocket (`infrastructure/adapter/in/websocket/`), así que el host debe soportarlo.
- Backend usa PostgreSQL en perfil `prod` (`application.yml`, perfil `prod`), no incluido en el host de la app — requiere un Postgres gestionado aparte.

## Opciones evaluadas

### Frontend (`carioca-fe/`, build estático de Vite)
- **Vercel** — deploy directo desde GitHub, sin cold start, capa gratuita generosa. (Recomendado)
- **Cloudflare Pages** — alternativa equivalente a Vercel.

### Backend (`carioca/`, Spring Boot + WebSocket)
- **Render** — reemplazo más directo a Railway (free web service, soporta Docker y WebSockets). Contra: el tier gratis duerme tras 15 min de inactividad, cold-start de 30-60s. (Elegido)
- **Fly.io** — no duerme tanto, buen soporte de WebSockets. Contra: pide tarjeta para verificar la cuenta (no cobra en tier gratis).
- **Koyeb** — similar a Render, no pide tarjeta. Contra: free tier más limitado en recursos.

### Base de datos (PostgreSQL, perfil `prod`)
- **Neon** — Postgres serverless, free tier 0.5GB, se "duerme" tras inactividad pero despierta rápido. Sin expiración. (Elegido)
- **Supabase** — Postgres free tier 500MB, incluye dashboard. Contra: el proyecto se pausa tras 1 semana sin uso y requiere reactivación manual.
- **Postgres de Render** — gratis pero expira a los 90 días, hay que recrearlo.

## Combinaciones evaluadas
- Si el cold-start no molesta: **Render + Neon + Vercel**. (Elegida)
- Si se quiere evitar el sleep del backend: **Fly.io + Neon + Cloudflare Pages**.

## Plan de ejecución

Fases en orden — cada una depende de un dato que genera la anterior (DB → backend → frontend → CORS final).

### Fase 1 — Base de datos (Neon) ✅
- [x] Crear cuenta/proyecto en Neon, crear la base `cariocadb`.
- [x] Obtener el connection string y derivar las 3 env vars que ya espera `application.yml` (perfil `prod`, líneas 48-51):
  - `DB_URL=jdbc:postgresql://ep-red-sunset-athe7jvt-pooler.c-9.us-east-1.aws.neon.tech/cariocadb?sslmode=require`
  - `DB_USERNAME=neondb_owner`
  - `DB_PASSWORD=<guardada fuera del repo, lista para pegar en Render>`
- No requirió cambios de código: `hibernate.ddl-auto: update` en el perfil `prod` crea el schema solo en el primer arranque.

### Fase 2 — Cambios de código en el backend (requisitos de Render) ✅
- [x] **Bind de puerto dinámico**: `carioca/src/main/resources/application.yml:8` cambiado de `port: 8080` a `port: ${PORT:8080}`. Validado localmente con `mvn spring-boot:run` (cae a 8080 sin `PORT` seteada).
- [x] **Dockerfile** (`carioca/Dockerfile`): multi-stage, build con `maven:3.9-eclipse-temurin-17`, runtime con `eclipse-temurin:17-jre` (no `-alpine`: esa variante solo publica `amd64`, sin imagen `arm64` rompía el build local en Apple Silicon). Copia el jar (`target/carioca-game-1.0.0-SNAPSHOT.jar`), `ENTRYPOINT ["java","-jar","/app/app.jar"]`.
  - `.dockerignore` agregado (`target/`, `.git/`, `.idea/`, etc.).
  - Validado con `docker build` + `docker run -e PORT=9090`: imagen compila, Tomcat arranca en el puerto pasado por `PORT`, schema de Hibernate se crea sin errores.

### Fase 3 — Backend en Render
- [ ] Crear Web Service en Render conectado a `github.com/gzarazaga/carioca-all`, root directory `carioca/`, runtime Docker.
- [ ] Configurar env vars: `SPRING_PROFILES_ACTIVE=prod`, `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` (de la Fase 1). `CORS_ALLOWED_ORIGINS` se completa en la Fase 5.
- [ ] Deploy y verificar logs de arranque (conexión a Neon exitosa, sin errores de `ddl-auto`).
- [ ] Anotar la URL pública asignada (`https://<algo>.onrender.com`).

### Fase 4 — Frontend en Vercel
- [ ] Crear proyecto en Vercel conectado al mismo repo, root directory `carioca-fe/`, preset Vite (build command `npm run build`, output `dist/`).
- [ ] Configurar env vars de build: `VITE_API_URL=https://<render-domain>.onrender.com` y `VITE_WS_URL=wss://<render-domain>.onrender.com/ws`.
- [ ] Deploy y anotar la URL asignada (`https://<algo>.vercel.app`).

### Fase 5 — Cerrar el círculo: CORS
- [ ] En Render, actualizar `CORS_ALLOWED_ORIGINS=https://<vercel-domain>.vercel.app` (sin slash final) y redeployar.

### Fase 6 — Verificación end-to-end
- [ ] Crear una partida desde la URL de Vercel (ejercita REST vía `VITE_API_URL`).
- [ ] Unirse con un segundo jugador/pestaña y confirmar eventos en tiempo real (ejercita WebSocket `wss://` vía `VITE_WS_URL`).
- [ ] Revisar consola del navegador: sin errores de CORS, WS en estado `OPEN`.
- [ ] Revisar logs de Render: sin excepciones, queries a Neon respondiendo.
- [ ] Reemplazar esta sección con las URLs finales de Render/Vercel/Neon.

## Notas
- Las credenciales de Neon/Render/Vercel se configuran en los dashboards de cada servicio, nunca se commitean al repo.
- El Dockerfile y el cambio de `server.port` son los únicos cambios de código; todo lo demás es configuración de plataforma.
