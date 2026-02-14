package com.carioca.domain.usecase.juego.descartarcarta;

import lombok.Value;

/**
 * Comando para descartar una carta.
 */
@Value
public class DescartarCartaCommand {

    String partidaId;
    String jugadorId;
    String cartaId;

    public static DescartarCartaCommand of(String partidaId, String jugadorId, String cartaId) {
        return new DescartarCartaCommand(partidaId, jugadorId, cartaId);
    }
}
