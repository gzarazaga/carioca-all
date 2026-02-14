package com.carioca.infrastructure.adapter.in.websocket;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArraySet;

/**
 * Gestor de sesiones WebSocket.
 * Mantiene el mapeo entre partidas, jugadores y sus sesiones.
 */
@Component
@Slf4j
public class WebSocketSessionManager {

    // partidaId -> Set<WebSocketSession>
    private final Map<String, Set<WebSocketSession>> partidaSessions = new ConcurrentHashMap<>();

    // sessionId -> {partidaId, jugadorId}
    private final Map<String, SessionInfo> sessionInfoMap = new ConcurrentHashMap<>();

    /**
     * Registra una sesión para una partida y jugador.
     */
    public void registrarSesion(WebSocketSession session, String partidaId, String jugadorId) {
        partidaSessions.computeIfAbsent(partidaId, k -> new CopyOnWriteArraySet<>()).add(session);
        sessionInfoMap.put(session.getId(), new SessionInfo(partidaId, jugadorId));
        log.info("Sesión {} registrada para partida {} y jugador {}", session.getId(), partidaId, jugadorId);
    }

    /**
     * Elimina una sesión.
     */
    public void eliminarSesion(WebSocketSession session) {
        SessionInfo info = sessionInfoMap.remove(session.getId());
        if (info != null) {
            Set<WebSocketSession> sessions = partidaSessions.get(info.partidaId);
            if (sessions != null) {
                sessions.remove(session);
                if (sessions.isEmpty()) {
                    partidaSessions.remove(info.partidaId);
                }
            }
            log.info("Sesión {} eliminada de partida {}", session.getId(), info.partidaId);
        }
    }

    /**
     * Envía un mensaje a todos los jugadores de una partida.
     */
    public void enviarAPartida(String partidaId, String mensaje) {
        Set<WebSocketSession> sessions = partidaSessions.get(partidaId);
        if (sessions != null) {
            for (WebSocketSession session : sessions) {
                enviarMensaje(session, mensaje);
            }
        }
    }

    /**
     * Envía un mensaje a un jugador específico en una partida.
     */
    public void enviarAJugador(String partidaId, String jugadorId, String mensaje) {
        Set<WebSocketSession> sessions = partidaSessions.get(partidaId);
        if (sessions != null) {
            for (WebSocketSession session : sessions) {
                SessionInfo info = sessionInfoMap.get(session.getId());
                if (info != null && info.jugadorId.equals(jugadorId)) {
                    enviarMensaje(session, mensaje);
                    break;
                }
            }
        }
    }

    /**
     * Envía un mensaje a todos excepto a un jugador.
     */
    public void enviarATodosExcepto(String partidaId, String jugadorIdExcluido, String mensaje) {
        Set<WebSocketSession> sessions = partidaSessions.get(partidaId);
        if (sessions != null) {
            for (WebSocketSession session : sessions) {
                SessionInfo info = sessionInfoMap.get(session.getId());
                if (info != null && !info.jugadorId.equals(jugadorIdExcluido)) {
                    enviarMensaje(session, mensaje);
                }
            }
        }
    }

    /**
     * Obtiene la información de una sesión.
     */
    public SessionInfo obtenerInfoSesion(WebSocketSession session) {
        return sessionInfoMap.get(session.getId());
    }

    /**
     * Verifica si una sesión está registrada.
     */
    public boolean estaRegistrada(WebSocketSession session) {
        return sessionInfoMap.containsKey(session.getId());
    }

    private void enviarMensaje(WebSocketSession session, String mensaje) {
        try {
            if (session.isOpen()) {
                session.sendMessage(new TextMessage(mensaje));
            }
        } catch (IOException e) {
            log.error("Error enviando mensaje a sesión {}: {}", session.getId(), e.getMessage());
        }
    }

    /**
     * Información de una sesión.
     */
    public record SessionInfo(String partidaId, String jugadorId) {}
}
