package com.carioca.domain.usecase.partida.obtener;

/**
 * Caso de uso para obtener el estado actual de una partida.
 */
public interface ObtenerEstadoPartidaUseCase {

    /**
     * Obtiene el estado actual de una partida.
     *
     * @param partidaId ID de la partida
     * @return Estado actual de la partida
     */
    EstadoPartidaResponse ejecutar(String partidaId);
}
