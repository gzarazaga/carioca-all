package com.carioca.domain.usecase.partida.unirse;

import com.carioca.domain.usecase.partida.crear.PartidaCreada;

/**
 * Caso de uso para unirse a una partida existente.
 */
public interface UnirsePartidaUseCase {

    /**
     * Une un nuevo jugador a una partida existente.
     *
     * @param command Datos para unirse a la partida
     * @return Información del jugador unido
     */
    PartidaCreada ejecutar(UnirsePartidaCommand command);
}
