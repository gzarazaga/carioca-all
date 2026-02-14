package com.carioca.domain.model.event;

import lombok.Value;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

/**
 * Evento emitido cuando finaliza una ronda.
 */
@Value
public class RondaFinalizadaEvent implements DomainEvent {

    String eventId;
    Instant occurredOn;
    String partidaId;
    int numeroRonda;
    String ganadorRondaId;
    Map<String, Integer> puntosPorJugador;
    boolean esUltimaRonda;

    public static RondaFinalizadaEvent of(String partidaId, int numeroRonda,
                                          String ganadorRondaId,
                                          Map<String, Integer> puntosPorJugador,
                                          boolean esUltimaRonda) {
        return new RondaFinalizadaEvent(
                UUID.randomUUID().toString(),
                Instant.now(),
                partidaId,
                numeroRonda,
                ganadorRondaId,
                puntosPorJugador,
                esUltimaRonda
        );
    }

    @Override
    public String getEventType() {
        return "RONDA_FINALIZADA";
    }
}
