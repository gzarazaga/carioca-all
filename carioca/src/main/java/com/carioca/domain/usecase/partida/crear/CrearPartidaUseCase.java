package com.carioca.domain.usecase.partida.crear;

/**
 * Caso de uso para crear una nueva partida.
 */
public interface CrearPartidaUseCase {

    /**
     * Crea una nueva partida con un jugador inicial.
     *
     * @param command Datos para crear la partida
     * @return Información de la partida creada
     */
    PartidaCreada ejecutar(CrearPartidaCommand command);
}
