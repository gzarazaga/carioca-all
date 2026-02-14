package com.carioca.domain.usecase.juego.pegarcarta;

import lombok.Value;

/**
 * Comando para pegar una carta a una formación existente.
 */
@Value
public class PegarCartaCommand {

    String partidaId;
    String jugadorId;
    String cartaId;
    String formacionId;
    boolean alInicio;

    public static PegarCartaCommand alInicio(String partidaId, String jugadorId,
                                              String cartaId, String formacionId) {
        return new PegarCartaCommand(partidaId, jugadorId, cartaId, formacionId, true);
    }

    public static PegarCartaCommand alFinal(String partidaId, String jugadorId,
                                             String cartaId, String formacionId) {
        return new PegarCartaCommand(partidaId, jugadorId, cartaId, formacionId, false);
    }
}
