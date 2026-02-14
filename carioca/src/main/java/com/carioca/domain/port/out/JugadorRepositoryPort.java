package com.carioca.domain.port.out;

import com.carioca.domain.model.jugador.Jugador;
import com.carioca.domain.model.jugador.JugadorId;

import java.util.Optional;

/**
 * Puerto de salida para la persistencia de jugadores.
 */
public interface JugadorRepositoryPort {

    /**
     * Guarda un jugador.
     */
    Jugador save(Jugador jugador);

    /**
     * Busca un jugador por su ID.
     */
    Optional<Jugador> findById(JugadorId id);

    /**
     * Busca un jugador por su ID (string).
     */
    Optional<Jugador> findById(String id);

    /**
     * Busca un jugador por su nombre.
     */
    Optional<Jugador> findByNombre(String nombre);

    /**
     * Elimina un jugador.
     */
    void delete(JugadorId id);

    /**
     * Verifica si existe un jugador.
     */
    boolean exists(JugadorId id);
}
