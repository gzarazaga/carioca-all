package com.carioca.domain.port.out;

import com.carioca.domain.model.juego.Carta;
import com.carioca.domain.model.juego.Formacion;
import com.carioca.domain.model.partida.Partida;

import java.util.List;
import java.util.Map;

/**
 * Puerto de salida para notificaciones a los clientes.
 */
public interface NotificacionPort {

    /**
     * Notifica a todos los jugadores de una partida sobre un cambio de estado.
     */
    void notificarEstadoPartida(Partida partida);

    /**
     * Notifica que es el turno de un jugador.
     */
    void notificarTurno(String partidaId, String jugadorId);

    /**
     * Notifica que un jugador robó una carta.
     */
    void notificarCartaRobada(String partidaId, String jugadorId, boolean delMazo);

    /**
     * Notifica que un jugador descartó una carta.
     */
    void notificarCartaDescartada(String partidaId, String jugadorId, Carta carta);

    /**
     * Notifica que un jugador bajó una formación.
     */
    void notificarFormacionBajada(String partidaId, String jugadorId, Formacion formacion);

    /**
     * Notifica que un jugador pegó una carta.
     */
    void notificarCartaPegada(String partidaId, String jugadorId, String formacionId, Carta carta);

    /**
     * Notifica el fin de una ronda.
     */
    void notificarFinRonda(String partidaId, int numeroRonda, String ganadorId, Map<String, Integer> puntos);

    /**
     * Notifica el fin de la partida.
     */
    void notificarFinPartida(String partidaId, String ganadorId, Map<String, Integer> puntosTotales);

    /**
     * Notifica a un jugador específico sus cartas.
     */
    void notificarCartasJugador(String partidaId, String jugadorId, List<Carta> cartas);

    /**
     * Notifica que un jugador se unió a la partida.
     */
    void notificarJugadorUnido(String partidaId, String jugadorId, String nombreJugador);

    /**
     * Notifica un error a un jugador.
     */
    void notificarError(String partidaId, String jugadorId, String mensaje);
}
