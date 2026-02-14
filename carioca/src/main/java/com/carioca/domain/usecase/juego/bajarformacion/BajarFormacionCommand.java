package com.carioca.domain.usecase.juego.bajarformacion;

import com.carioca.domain.model.juego.TipoFormacion;
import lombok.Value;

import java.util.List;

/**
 * Comando para bajar una formación.
 */
@Value
public class BajarFormacionCommand {

    String partidaId;
    String jugadorId;
    TipoFormacion tipo;
    List<String> cartaIds;

    public static BajarFormacionCommand of(String partidaId, String jugadorId,
                                           TipoFormacion tipo, List<String> cartaIds) {
        return new BajarFormacionCommand(partidaId, jugadorId, tipo, cartaIds);
    }
}
