package com.carioca.infrastructure.adapter.in.rest.dto.response;

import lombok.Builder;
import lombok.Data;

/**
 * Response con información de una carta.
 */
@Data
@Builder
public class CartaResponse {

    private String id;
    private String valor;
    private String palo;
    private String notacion;
    private int puntos;
}
