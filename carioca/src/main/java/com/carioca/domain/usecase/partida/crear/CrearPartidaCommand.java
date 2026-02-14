package com.carioca.domain.usecase.partida.crear;

import lombok.Value;

/**
 * Comando para crear una nueva partida.
 */
@Value
public class CrearPartidaCommand {

    String nombreJugador;

    public static CrearPartidaCommand of(String nombreJugador) {
        if (nombreJugador == null || nombreJugador.isBlank()) {
            throw new IllegalArgumentException("El nombre del jugador es requerido");
        }
        return new CrearPartidaCommand(nombreJugador);
    }
}
