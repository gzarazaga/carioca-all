package com.carioca.infrastructure.adapter.in.rest.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * Request para descartar una carta.
 */
@Data
public class DescartarCartaRequest {

    @NotBlank(message = "El ID del jugador es requerido")
    private String jugadorId;

    @NotBlank(message = "El ID de la carta es requerido")
    private String cartaId;
}
