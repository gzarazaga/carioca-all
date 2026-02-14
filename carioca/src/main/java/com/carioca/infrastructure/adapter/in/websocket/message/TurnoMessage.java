package com.carioca.infrastructure.adapter.in.websocket.message;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Mensaje de turno enviado a los clientes.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TurnoMessage {

    private String partidaId;
    private String jugadorActualId;
    private String jugadorActualNombre;
    private String estadoTurno;
    private int numeroTurno;
    private int numeroRonda;
}
