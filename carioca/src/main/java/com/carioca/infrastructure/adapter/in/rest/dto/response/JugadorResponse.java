package com.carioca.infrastructure.adapter.in.rest.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

/**
 * Response con información de un jugador.
 */
@Data
@Builder
public class JugadorResponse {

    private String id;
    private String nombre;
    private int cartasEnMano;
    private int puntosTotales;
    private boolean haBajado;
    private boolean conectado;
    private List<CartaResponse> cartas; // Solo se llena para el jugador que hace la petición
}
