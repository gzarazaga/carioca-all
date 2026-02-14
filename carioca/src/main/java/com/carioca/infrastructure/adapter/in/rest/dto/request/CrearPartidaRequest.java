package com.carioca.infrastructure.adapter.in.rest.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * Request para crear una nueva partida.
 */
@Data
public class CrearPartidaRequest {

    @NotBlank(message = "El nombre del jugador es requerido")
    @Size(min = 2, max = 50, message = "El nombre debe tener entre 2 y 50 caracteres")
    private String nombreJugador;
}
