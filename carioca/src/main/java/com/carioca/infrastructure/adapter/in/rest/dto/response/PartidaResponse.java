package com.carioca.infrastructure.adapter.in.rest.dto.response;

import lombok.Builder;
import lombok.Data;

/**
 * Response para operaciones de partida (crear, unirse).
 */
@Data
@Builder
public class PartidaResponse {

    private String partidaId;
    private String jugadorId;
    private String nombreJugador;
    private String mensaje;
}
