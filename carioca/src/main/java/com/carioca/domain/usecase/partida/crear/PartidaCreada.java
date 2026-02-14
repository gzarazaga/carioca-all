package com.carioca.domain.usecase.partida.crear;

import lombok.Value;

/**
 * Resultado de crear una partida exitosamente.
 */
@Value
public class PartidaCreada {

    String partidaId;
    String jugadorId;
    String nombreJugador;

    public static PartidaCreada of(String partidaId, String jugadorId, String nombreJugador) {
        return new PartidaCreada(partidaId, jugadorId, nombreJugador);
    }
}
