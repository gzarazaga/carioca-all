package com.carioca.infrastructure.adapter.in.websocket.message;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Mensaje de error enviado a los clientes.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ErrorMessage {

    private String codigo;
    private String mensaje;
    private String detalles;
}
