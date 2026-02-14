package com.carioca.infrastructure.adapter.in.websocket.message;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

/**
 * Mensaje de movimiento enviado a los clientes.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MovimientoMessage {

    private String partidaId;
    private String tipo;
    private String jugadorId;
    private Map<String, Object> detalles;
}
