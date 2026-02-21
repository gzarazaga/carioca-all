# Carioca Card Game - Backend

Juego de cartas Carioca multijugador implementado con **Clean Architecture** y **Spring Boot**.

## Sobre el juego

Carioca es un juego de cartas para 2-6 jugadores que consta de 7 rondas. En cada ronda, los jugadores deben cumplir requisitos específicos de formaciones (piernas y escaleras) para poder "bajar". El jugador con menos puntos acumulados al final de las 7 rondas gana.

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

- **Pierna**: 3 o más cartas del mismo valor
- **Escalera**: 3 o más cartas consecutivas del mismo palo

### Puntos

| Carta | Puntos |
|-------|--------|
| 2 - 7 | 5 |
| 8 - K | 10 |
| As | 15 |
| Comodín | 25 |

---

## Requisitos previos

- **Java 17+** — verificar con `java -version`
- **Maven 3.8+** — verificar con `mvn -version`
- **PostgreSQL** solo para perfil de producción

---

## Ejecución local

### Desarrollo (H2 en memoria)

El perfil `dev` está activo por defecto. Usa base de datos H2 en memoria, por lo que no se requiere ninguna instalación adicional.

```bash
cd carioca
mvn spring-boot:run
```

El servidor queda disponible en `http://localhost:8080`.

#### Consola H2

Mientras corre en modo `dev`, podés acceder a la consola web de H2:

- URL: `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:mem:cariocadb`
- Usuario: `sa`
- Contraseña: *(dejar vacío)*

### Producción (PostgreSQL)

1. Crear la base de datos en PostgreSQL:

```sql
CREATE DATABASE cariocadb;
```

2. Ejecutar con el perfil `prod` y las variables de entorno correspondientes:

```bash
cd carioca
DB_URL=jdbc:postgresql://localhost:5432/cariocadb \
DB_USERNAME=tu_usuario \
DB_PASSWORD=tu_password \
mvn spring-boot:run -Dspring-boot.run.profiles=prod
```

O bien definir las variables de entorno en el sistema antes de ejecutar:

```bash
export DB_URL=jdbc:postgresql://localhost:5432/cariocadb
export DB_USERNAME=tu_usuario
export DB_PASSWORD=tu_password

mvn spring-boot:run -Dspring-boot.run.profiles=prod
```

---

## Build

```bash
mvn clean package
```

El artefacto generado queda en `target/carioca-*.jar`.

Para ejecutar el JAR directamente:

```bash
java -jar target/carioca-*.jar
# O con perfil de producción:
java -jar target/carioca-*.jar --spring.profiles.active=prod
```

---

## Tests

```bash
mvn test
```

El proyecto cuenta con 130 tests unitarios cubriendo:

- Modelo de dominio (Carta, Formacion, Mazo, RondaConfig, Partida)
- Servicios de dominio (ValidadorFormacionService)
- Casos de uso (crear, iniciar, unirse, robar, descartar, bajar, pegar)

---

## Tech Stack

- **Java 17**
- **Spring Boot 3.2.0** (Web, WebSocket, Data JPA, Validation)
- **PostgreSQL** (producción) / **H2** (desarrollo)
- **MapStruct** para mapeo entre capas
- **Lombok**
- **Maven**

---

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
│   ├── service/        # Servicios de dominio (validación, puntos, turnos, rondas)
│   ├── usecase/        # Casos de uso (crear, unirse, robar, descartar, bajar, pegar)
│   └── port/out/       # Puertos de salida (repositorios, eventos, notificaciones)
└── infrastructure/
    ├── adapter/
    │   ├── in/rest/       # Controllers REST + DTOs
    │   ├── in/websocket/  # WebSocket handler + mensajes
    │   └── out/           # Persistence, eventos Spring, notificaciones WebSocket
    ├── config/            # Configuración de beans, WebSocket, CORS, JPA
    └── exception/         # Manejo global de errores REST
```

---

## API REST

### Partida

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/api/partidas` | Crear partida |
| `POST` | `/api/partidas/{id}/unirse` | Unirse a partida |
| `GET` | `/api/partidas/{id}` | Obtener estado de partida |
| `POST` | `/api/partidas/{id}/iniciar` | Iniciar partida |

### Juego

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/api/partidas/{id}/juego/robar` | Robar carta (mazo o descarte) |
| `POST` | `/api/partidas/{id}/juego/descartar` | Descartar carta |
| `POST` | `/api/partidas/{id}/juego/bajar` | Bajar formación |
| `POST` | `/api/partidas/{id}/juego/pegar` | Pegar carta a formación existente |

---

## WebSocket

Comunicación en tiempo real para notificaciones de turno y movimientos.

- **Endpoint**: `ws://localhost:8080/ws/partida/{id}`
- **Mensajes soportados**: `JOIN`, `PING`, `PONG`, `JOIN_ACK`, `TURNO`, `MOVIMIENTO`, `ERROR`
