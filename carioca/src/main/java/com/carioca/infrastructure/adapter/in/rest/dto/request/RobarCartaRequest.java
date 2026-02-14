package com.carioca.infrastructure.adapter.in.rest.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * Request para robar una carta.
 */
@Data
public class RobarCartaRequest {

    @NotBlank(message = "El ID del jugador es requerido")
    private String jugadorId;

    @NotNull(message = "Debe especificar si roba del mazo")
    private Boolean delMazo;
}
