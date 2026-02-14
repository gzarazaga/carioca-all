package com.carioca.domain.model.event;

import lombok.Value;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

/**
 * Evento emitido cuando una partida comienza.
 */
@Value
public class PartidaIniciadaEvent implements DomainEvent {

    String eventId;
    Instant occurredOn;
    String partidaId;
    List<String> jugadorIds;
    int numeroRonda;
    String primerJugadorId;

    public static PartidaIniciadaEvent of(String partidaId, List<String> jugadorIds,
                                          int numeroRonda, String primerJugadorId) {
        return new PartidaIniciadaEvent(
                UUID.randomUUID().toString(),
                Instant.now(),
                partidaId,
                jugadorIds,
                numeroRonda,
                primerJugadorId
        );
    }

    @Override
    public String getEventType() {
        return "PARTIDA_INICIADA";
    }
}
