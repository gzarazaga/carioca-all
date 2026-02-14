package com.carioca.domain.usecase.partida.unirse;

import lombok.Value;

/**
 * Comando para unirse a una partida existente.
 */
@Value
public class UnirsePartidaCommand {

    String partidaId;
    String nombreJugador;

    public static UnirsePartidaCommand of(String partidaId, String nombreJugador) {
        if (partidaId == null || partidaId.isBlank()) {
            throw new IllegalArgumentException("El ID de partida es requerido");
        }
        if (nombreJugador == null || nombreJugador.isBlank()) {
            throw new IllegalArgumentException("El nombre del jugador es requerido");
        }
        return new UnirsePartidaCommand(partidaId, nombreJugador);
    }
}
