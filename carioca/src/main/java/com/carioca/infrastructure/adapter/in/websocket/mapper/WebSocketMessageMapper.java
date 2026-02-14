package com.carioca.infrastructure.adapter.in.websocket.mapper;

import com.carioca.domain.model.juego.Carta;
import com.carioca.domain.model.juego.Formacion;
import com.carioca.infrastructure.adapter.in.websocket.message.WebSocketMessage;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

/**
 * Mapper para convertir objetos de dominio a mensajes WebSocket.
 */
@Component
public class WebSocketMessageMapper {

    public WebSocketMessage crearMensajeTurno(String partidaId, String jugadorId) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("jugadorId", jugadorId);

        return WebSocketMessage.builder()
                .tipo("TURNO")
                .partidaId(partidaId)
                .payload(payload)
                .timestamp(System.currentTimeMillis())
                .build();
    }

    public WebSocketMessage crearMensajeCartaRobada(String partidaId, String jugadorId, boolean delMazo) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("jugadorId", jugadorId);
        payload.put("delMazo", delMazo);

        return WebSocketMessage.builder()
                .tipo("CARTA_ROBADA")
                .partidaId(partidaId)
                .payload(payload)
                .timestamp(System.currentTimeMillis())
                .build();
    }

    public WebSocketMessage crearMensajeCartaDescartada(String partidaId, String jugadorId, Carta carta) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("jugadorId", jugadorId);
        payload.put("carta", convertirCarta(carta));

        return WebSocketMessage.builder()
                .tipo("CARTA_DESCARTADA")
                .partidaId(partidaId)
                .payload(payload)
                .timestamp(System.currentTimeMillis())
                .build();
    }

    public WebSocketMessage crearMensajeFormacionBajada(String partidaId, String jugadorId, Formacion formacion) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("jugadorId", jugadorId);
        payload.put("formacion", convertirFormacion(formacion));

        return WebSocketMessage.builder()
                .tipo("FORMACION_BAJADA")
                .partidaId(partidaId)
                .payload(payload)
                .timestamp(System.currentTimeMillis())
                .build();
    }

    private Map<String, Object> convertirCarta(Carta carta) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", carta.getId());
        map.put("valor", carta.getValor().name());
        map.put("palo", carta.getPalo() != null ? carta.getPalo().name() : null);
        map.put("notacion", carta.toNotacion());
        return map;
    }

    private Map<String, Object> convertirFormacion(Formacion formacion) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", formacion.getId());
        map.put("tipo", formacion.getTipo().name());
        map.put("propietarioId", formacion.getJugadorPropietarioId());
        map.put("cartas", formacion.getCartas().stream().map(this::convertirCarta).toList());
        return map;
    }
}
