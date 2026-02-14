package com.carioca.domain.port.out;

import com.carioca.domain.model.partida.Partida;
import com.carioca.domain.model.partida.PartidaId;

import java.util.List;
import java.util.Optional;

/**
 * Puerto de salida para la persistencia de partidas.
 */
public interface PartidaRepositoryPort {

    /**
     * Guarda una partida.
     */
    Partida save(Partida partida);

    /**
     * Busca una partida por su ID.
     */
    Optional<Partida> findById(PartidaId id);

    /**
     * Busca una partida por su ID (string).
     */
    Optional<Partida> findById(String id);

    /**
     * Obtiene todas las partidas activas (esperando jugadores o en curso).
     */
    List<Partida> findActivePartidas();

    /**
     * Obtiene las partidas en las que participa un jugador.
     */
    List<Partida> findByJugadorId(String jugadorId);

    /**
     * Elimina una partida.
     */
    void delete(PartidaId id);

    /**
     * Verifica si existe una partida.
     */
    boolean exists(PartidaId id);
}
