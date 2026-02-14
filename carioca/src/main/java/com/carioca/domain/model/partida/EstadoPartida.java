package com.carioca.domain.model.partida;

/**
 * Estados posibles de una partida de Carioca.
 */
public enum EstadoPartida {
    /**
     * La partida está esperando que se unan más jugadores.
     */
    ESPERANDO_JUGADORES,

    /**
     * La partida está en curso.
     */
    EN_CURSO,

    /**
     * La partida ha finalizado.
     */
    FINALIZADA
}
