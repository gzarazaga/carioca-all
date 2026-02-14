package com.carioca.infrastructure.adapter.in.rest.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * Request para pegar una carta a una formación.
 */
@Data
public class PegarCartaRequest {

    @NotBlank(message = "El ID del jugador es requerido")
    private String jugadorId;

    @NotBlank(message = "El ID de la carta es requerido")
    private String cartaId;

    @NotBlank(message = "El ID de la formación es requerido")
    private String formacionId;

    @NotNull(message = "Debe especificar si pega al inicio")
    private Boolean alInicio;
}
