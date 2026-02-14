# Carioca Card Game

Juego de cartas Carioca multijugador implementado con **Clean Architecture** y **Spring Boot**.

## Sobre el juego

Carioca es un juego de cartas para 2-6 jugadores que consta de 7 rondas. En cada ronda, los jugadores deben cumplir requisitos especificos de formaciones (piernas y escaleras) para poder "bajar". El jugador con menos puntos acumulados al final de las 7 rondas gana.

### Rondas

| Ronda | Requisito |
|-------|-----------|
| 1 | 2 Piernas |
| 2 | 1 Pierna + 1 Escalera |
| 3 | 2 Escaleras |
| 4 | 3 Piernas |
| 5 | 2 Piernas + 1 Escalera |
| 6 | 1 Pierna + 2 Escaleras |
| 7 | 3 Escaleras |

### Formaciones

- **Pierna**: 3 o mas cartas del mismo valor
- **Escalera**: 3 o mas cartas consecutivas del mismo palo

### Puntos

| Carta | Puntos |
|-------|--------|
| 2 - 7 | 5 |
| 8 - K | 10 |
| As | 15 |
| Comodin | 25 |

## Tech Stack

- **Java 17**
- **Spring Boot 3.2.0** (Web, WebSocket, Data JPA, Validation)
- **PostgreSQL** (produccion) / **H2** (desarrollo)
- **MapStruct** para mapeo entre capas
- **Lombok**
- **Maven**

## Arquitectura

El proyecto sigue **Arquitectura Hexagonal (Ports & Adapters)** con Clean Architecture:

```
src/main/java/com/carioca/
├── domain/
│   ├── model/          # Entidades y value objects
│   │   ├── partida/    # Partida (aggregate root), EstadoPartida, EstadoTurno
│   │   ├── jugador/    # Jugador, Mano
│   │   ├── juego/      # Carta, Formacion, Mazo, PilaDescarte, Ronda, RondaConfig
│   │   └── event/      # Eventos de dominio
│   ├── exception/      # Excepciones de dominio
│   ├── service/        # Servicios de dominio (validacion, puntos, turnos, rondas)
│   ├── usecase/        # Casos de uso (crear, unirse, robar, descartar, bajar, pegar)
│   └── port/out/       # Puertos de salida (repositorios, eventos, notificaciones)
└── infrastructure/
    ├── adapter/
    │   ├── in/rest/       # Controllers REST + DTOs
    │   ├── in/websocket/  # WebSocket handler + mensajes
    │   └── out/           # Persistence, eventos Spring, notificaciones WebSocket
    ├── config/            # Configuracion de beans, WebSocket, CORS, JPA
    └── exception/         # Manejo global de errores REST
```

## API REST

### Partida

| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| `POST` | `/api/partidas` | Crear partida |
| `POST` | `/api/partidas/{id}/unirse` | Unirse a partida |
| `GET` | `/api/partidas/{id}` | Obtener estado de partida |
| `POST` | `/api/partidas/{id}/iniciar` | Iniciar partida |

### Juego

| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| `POST` | `/api/partidas/{id}/juego/robar` | Robar carta (mazo o descarte) |
| `POST` | `/api/partidas/{id}/juego/descartar` | Descartar carta |
| `POST` | `/api/partidas/{id}/juego/bajar` | Bajar formacion |
| `POST` | `/api/partidas/{id}/juego/pegar` | Pegar carta a formacion existente |

## WebSocket

Comunicacion en tiempo real para notificaciones de turno y movimientos.

**Mensajes soportados**: `JOIN`, `PING`, `PONG`, `JOIN_ACK`, `TURNO`, `MOVIMIENTO`, `ERROR`

## Requisitos

- Java 17+
- Maven 3.8+
- PostgreSQL (solo para produccion)

## Ejecutar

### Desarrollo (H2 en memoria)

```bash
mvn spring-boot:run
```

### Produccion (PostgreSQL)

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=prod
```

Variables de entorno necesarias para produccion:
- `DB_URL` - URL de conexion PostgreSQL
- `DB_USERNAME` - Usuario de base de datos
- `DB_PASSWORD` - Password de base de datos

## Tests

```bash
mvn test
```

El proyecto cuenta con 130 tests unitarios cubriendo:

- Modelo de dominio (Carta, Formacion, Mazo, RondaConfig, Partida)
- Servicios de dominio (ValidadorFormacionService)
- Casos de uso (crear, iniciar, unirse, robar, descartar, bajar, pegar)