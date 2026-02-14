package com.carioca.domain.usecase.juego.robarcarta;

import lombok.Value;

/**
 * Comando para robar una carta.
 */
@Value
public class RobarCartaCommand {

    String partidaId;
    String jugadorId;
    boolean delMazo; // true = mazo, false = descarte

    public static RobarCartaCommand delMazo(String partidaId, String jugadorId) {
        return new RobarCartaCommand(partidaId, jugadorId, true);
    }

    public static RobarCartaCommand delDescarte(String partidaId, String jugadorId) {
        return new RobarCartaCommand(partidaId, jugadorId, false);
    }
}
