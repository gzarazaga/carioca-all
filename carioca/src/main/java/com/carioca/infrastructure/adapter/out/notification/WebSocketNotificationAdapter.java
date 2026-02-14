package com.carioca.infrastructure.adapter.out.notification;

import com.carioca.domain.model.juego.Carta;
import com.carioca.domain.model.juego.Formacion;
import com.carioca.domain.model.partida.Partida;
import com.carioca.domain.port.out.NotificacionPort;
import com.carioca.infrastructure.adapter.in.websocket.WebSocketSessionManager;
import com.carioca.infrastructure.adapter.in.websocket.message.WebSocketMessage;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Adaptador que implementa notificaciones vía WebSocket.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class WebSocketNotificationAdapter implements NotificacionPort {

    private final WebSocketSessionManager sessionManager;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void notificarEstadoPartida(Partida partida) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("partidaId", partida.getIdValue());
        payload.put("estado", partida.getEstado().name());
        payload.put("numeroRonda", partida.getNumeroRondaActual());
        payload.put("jugadorActualId", partida.estaEnCurso() ?
                partida.obtenerJugadorActual().getIdValue() : null);

        enviarAPartida(partida.getIdValue(), "ESTADO_PARTIDA", payload);
    }

    @Override
    public void notificarTurno(String partidaId, String jugadorId) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("jugadorId", jugadorId);

        enviarAPartida(partidaId, "TURNO", payload);
    }

    @Override
    public void notificarCartaRobada(String partidaId, String jugadorId, boolean delMazo) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("jugadorId", jugadorId);
        payload.put("delMazo", delMazo);

        enviarAPartida(partidaId, "CARTA_ROBADA", payload);
    }

    @Override
    public void notificarCartaDescartada(String partidaId, String jugadorId, Carta carta) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("jugadorId", jugadorId);
        payload.put("carta", convertirCarta(carta));

        enviarAPartida(partidaId, "CARTA_DESCARTADA", payload);
    }

    @Override
    public void notificarFormacionBajada(String partidaId, String jugadorId, Formacion formacion) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("jugadorId", jugadorId);
        payload.put("formacion", convertirFormacion(formacion));

        enviarAPartida(partidaId, "FORMACION_BAJADA", payload);
    }

    @Override
    public void notificarCartaPegada(String partidaId, String jugadorId, String formacionId, Carta carta) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("jugadorId", jugadorId);
        payload.put("formacionId", formacionId);
        payload.put("carta", convertirCarta(carta));

        enviarAPartida(partidaId, "CARTA_PEGADA", payload);
    }

    @Override
    public void notificarFinRonda(String partidaId, int numeroRonda, String ganadorId, Map<String, Integer> puntos) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("numeroRonda", numeroRonda);
        payload.put("ganadorId", ganadorId);
        payload.put("puntos", puntos);

        enviarAPartida(partidaId, "FIN_RONDA", payload);
    }

    @Override
    public void notificarFinPartida(String partidaId, String ganadorId, Map<String, Integer> puntosTotales) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("ganadorId", ganadorId);
        payload.put("puntosTotales", puntosTotales);

        enviarAPartida(partidaId, "FIN_PARTIDA", payload);
    }

    @Override
    public void notificarCartasJugador(String partidaId, String jugadorId, List<Carta> cartas) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("cartas", cartas.stream().map(this::convertirCarta).toList());

        enviarAJugador(partidaId, jugadorId, "TUS_CARTAS", payload);
    }

    @Override
    public void notificarJugadorUnido(String partidaId, String jugadorId, String nombreJugador) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("jugadorId", jugadorId);
        payload.put("nombreJugador", nombreJugador);

        enviarAPartida(partidaId, "JUGADOR_UNIDO", payload);
    }

    @Override
    public void notificarError(String partidaId, String jugadorId, String mensaje) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("mensaje", mensaje);

        enviarAJugador(partidaId, jugadorId, "ERROR", payload);
    }

    private void enviarAPartida(String partidaId, String tipo, Map<String, Object> payload) {
        try {
            WebSocketMessage message = WebSocketMessage.builder()
                    .tipo(tipo)
                    .partidaId(partidaId)
                    .payload(payload)
                    .timestamp(System.currentTimeMillis())
                    .build();

            String json = objectMapper.writeValueAsString(message);
            sessionManager.enviarAPartida(partidaId, json);
        } catch (Exception e) {
            log.error("Error enviando mensaje a partida {}: {}", partidaId, e.getMessage());
        }
    }

    private void enviarAJugador(String partidaId, String jugadorId, String tipo, Map<String, Object> payload) {
        try {
            WebSocketMessage message = WebSocketMessage.builder()
                    .tipo(tipo)
                    .partidaId(partidaId)
                    .payload(payload)
                    .timestamp(System.currentTimeMillis())
                    .build();

            String json = objectMapper.writeValueAsString(message);
            sessionManager.enviarAJugador(partidaId, jugadorId, json);
        } catch (Exception e) {
            log.error("Error enviando mensaje a jugador {} en partida {}: {}", jugadorId, partidaId, e.getMessage());
        }
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
