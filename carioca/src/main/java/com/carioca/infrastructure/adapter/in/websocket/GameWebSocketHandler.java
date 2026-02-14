package com.carioca.infrastructure.adapter.in.websocket;

import com.carioca.domain.port.out.NotificacionPort;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

/**
 * Handler de WebSocket para el juego.
 * Gestiona la conexión y mensajes de los clientes.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class GameWebSocketHandler extends TextWebSocketHandler {

    private final WebSocketSessionManager sessionManager;
    private final NotificacionPort notificacionPort;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        log.info("Nueva conexión WebSocket: {}", session.getId());
        // La sesión se registra cuando el cliente envía el mensaje de JOIN
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) {
        try {
            JsonNode json = objectMapper.readTree(message.getPayload());
            String tipo = json.get("tipo").asText();

            switch (tipo) {
                case "JOIN" -> handleJoin(session, json);
                case "PING" -> handlePing(session);
                default -> log.warn("Tipo de mensaje no reconocido: {}", tipo);
            }
        } catch (Exception e) {
            log.error("Error procesando mensaje WebSocket: {}", e.getMessage());
            enviarError(session, "Error procesando mensaje: " + e.getMessage());
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        WebSocketSessionManager.SessionInfo info = sessionManager.obtenerInfoSesion(session);
        if (info != null) {
            log.info("Conexión cerrada para jugador {} en partida {}: {}",
                    info.jugadorId(), info.partidaId(), status);
            // Notificar a otros jugadores que el jugador se desconectó
            notificacionPort.notificarError(info.partidaId(), null,
                    "Un jugador se ha desconectado");
        }
        sessionManager.eliminarSesion(session);
    }

    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) {
        log.error("Error de transporte en sesión {}: {}", session.getId(), exception.getMessage());
        sessionManager.eliminarSesion(session);
    }

    private void handleJoin(WebSocketSession session, JsonNode json) {
        String partidaId = json.get("partidaId").asText();
        String jugadorId = json.get("jugadorId").asText();

        sessionManager.registrarSesion(session, partidaId, jugadorId);

        // Enviar confirmación
        try {
            String confirmacion = objectMapper.writeValueAsString(new java.util.HashMap<String, Object>() {{
                put("tipo", "JOIN_ACK");
                put("mensaje", "Conectado a la partida");
                put("partidaId", partidaId);
                put("jugadorId", jugadorId);
            }});
            session.sendMessage(new TextMessage(confirmacion));
        } catch (Exception e) {
            log.error("Error enviando confirmación de JOIN: {}", e.getMessage());
        }
    }

    private void handlePing(WebSocketSession session) {
        try {
            String pong = objectMapper.writeValueAsString(new java.util.HashMap<String, Object>() {{
                put("tipo", "PONG");
                put("timestamp", System.currentTimeMillis());
            }});
            session.sendMessage(new TextMessage(pong));
        } catch (Exception e) {
            log.error("Error enviando PONG: {}", e.getMessage());
        }
    }

    private void enviarError(WebSocketSession session, String mensaje) {
        try {
            String error = objectMapper.writeValueAsString(new java.util.HashMap<String, Object>() {{
                put("tipo", "ERROR");
                put("mensaje", mensaje);
            }});
            session.sendMessage(new TextMessage(error));
        } catch (Exception e) {
            log.error("Error enviando mensaje de error: {}", e.getMessage());
        }
    }
}
