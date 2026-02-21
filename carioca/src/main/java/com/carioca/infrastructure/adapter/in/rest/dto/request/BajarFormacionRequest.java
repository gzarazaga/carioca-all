package com.carioca.infrastructure.adapter.in.rest.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

/**
 * Request para bajar una o más formaciones en una sola jugada.
 */
@Data
public class BajarFormacionRequest {

    @NotBlank(message = "El ID del jugador es requerido")
    private String jugadorId;

    @Valid
    @NotEmpty(message = "Debe incluir al menos una formación")
    private List<FormacionInput> formaciones;

    @Data
    public static class FormacionInput {

        @NotNull(message = "El tipo de formación es requerido")
        private String tipo; // PIERNA o ESCALERA

        @NotEmpty(message = "Debe incluir al menos una carta")
        private List<String> cartaIds;
    }
}