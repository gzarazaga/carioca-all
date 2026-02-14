package com.carioca.domain.service.impl;

import com.carioca.domain.model.jugador.Jugador;
import com.carioca.domain.model.partida.EstadoPartida;
import com.carioca.domain.model.partida.EstadoTurno;
import com.carioca.domain.model.partida.Partida;
import com.carioca.domain.service.GestorTurnosService;

/**
 * Implementación del servicio de gestión de turnos.
 */
public class GestorTurnosServiceImpl implements GestorTurnosService {

    @Override
    public Jugador obtenerJugadorActual(Partida partida) {
        return partida.obtenerJugadorActual();
    }

    @Override
    public boolean esTurnoDeJugador(Partida partida, String jugadorId) {
        if (partida.getEstado() != EstadoPartida.EN_CURSO) {
            return false;
        }
        return partida.obtenerJugadorActual().getIdValue().equals(jugadorId);
    }

    @Override
    public boolean puedeRobar(Partida partida, String jugadorId) {
        return esTurnoDeJugador(partida, jugadorId) &&
                partida.getEstadoTurno() == EstadoTurno.ESPERANDO_ROBAR;
    }

    @Override
    public boolean puedeDescartar(Partida partida, String jugadorId) {
        return esTurnoDeJugador(partida, jugadorId) &&
                partida.getEstadoTurno() == EstadoTurno.ESPERANDO_DESCARTAR;
    }

    @Override
    public boolean puedeBajar(Partida partida, String jugadorId) {
        // Solo puede bajar después de robar y antes de descartar
        return puedeDescartar(partida, jugadorId);
    }

    @Override
    public boolean puedePegar(Partida partida, String jugadorId) {
        // Solo puede pegar si ya bajó y es su turno para descartar
        if (!puedeDescartar(partida, jugadorId)) {
            return false;
        }
        return partida.getRondaActual().haBajado(jugadorId);
    }
}
