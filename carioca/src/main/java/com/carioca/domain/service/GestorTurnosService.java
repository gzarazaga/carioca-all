package com.carioca.domain.service;

import com.carioca.domain.model.jugador.Jugador;
import com.carioca.domain.model.partida.Partida;

/**
 * Servicio de dominio para gestionar los turnos del juego.
 */
public interface GestorTurnosService {

    /**
     * Obtiene el jugador que tiene el turno actual.
     */
    Jugador obtenerJugadorActual(Partida partida);

    /**
     * Verifica si es el turno de un jugador específico.
     */
    boolean esTurnoDeJugador(Partida partida, String jugadorId);

    /**
     * Verifica si el jugador puede robar en este momento.
     */
    boolean puedeRobar(Partida partida, String jugadorId);

    /**
     * Verifica si el jugador puede descartar en este momento.
     */
    boolean puedeDescartar(Partida partida, String jugadorId);

    /**
     * Verifica si el jugador puede bajar formaciones.
     */
    boolean puedeBajar(Partida partida, String jugadorId);

    /**
     * Verifica si el jugador puede pegar cartas a formaciones.
     */
    boolean puedePegar(Partida partida, String jugadorId);
}
