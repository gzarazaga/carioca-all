package com.carioca.domain.usecase.juego.bajarformacion;

import com.carioca.domain.model.juego.TipoFormacion;
import lombok.Value;

import java.util.List;

/**
 * Comando para bajar una o más formaciones en una sola jugada.
 */
@Value
public class BajarFormacionCommand {

    String partidaId;
    String jugadorId;
    List<FormacionInput> formaciones;

    public static BajarFormacionCommand of(String partidaId, String jugadorId,
                                           List<FormacionInput> formaciones) {
        return new BajarFormacionCommand(partidaId, jugadorId, formaciones);
    }

    @Value
    public static class FormacionInput {
        TipoFormacion tipo;
        List<String> cartaIds;
    }
}