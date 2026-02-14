package com.carioca.infrastructure.adapter.in.rest.dto.response;

import lombok.Builder;
import lombok.Data;

/**
 * Response para movimientos (robar, descartar, etc.).
 */
@Data
@Builder
public class MovimientoResponse {

    private String tipo;
    private boolean exito;
    private String mensaje;
    private CartaResponse carta;
    private FormacionResponse formacion;

    @Data
    @Builder
    public static class FormacionResponse {
        private String id;
        private String tipo;
    }
}
