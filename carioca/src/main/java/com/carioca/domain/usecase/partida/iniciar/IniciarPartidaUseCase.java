package com.carioca.domain.usecase.partida.iniciar;

/**
 * Caso de uso para iniciar una partida.
 */
public interface IniciarPartidaUseCase {

    /**
     * Inicia una partida que está esperando jugadores.
     *
     * @param partidaId ID de la partida a iniciar
     */
    void ejecutar(String partidaId);
}
