package com.carioca.infrastructure.adapter.in.rest.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

/**
 * Request para bajar una formación.
 */
@Data
public class BajarFormacionRequest {

    @NotBlank(message = "El ID del jugador es requerido")
    private String jugadorId;

    @NotNull(message = "El tipo de formación es requerido")
    private String tipo; // PIERNA o ESCALERA

    @NotEmpty(message = "Debe incluir al menos una carta")
    private List<String> cartaIds;
}
