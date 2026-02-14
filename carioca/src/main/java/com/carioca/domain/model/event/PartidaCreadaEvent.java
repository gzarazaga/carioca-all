package com.carioca.domain.model.event;

import lombok.Value;

import java.time.Instant;
import java.util.UUID;

/**
 * Evento emitido cuando se crea una nueva partida.
 */
@Value
public class PartidaCreadaEvent implements DomainEvent {

    String eventId;
    Instant occurredOn;
    String partidaId;
    String creadorId;
    String creadorNombre;

    public static PartidaCreadaEvent of(String partidaId, String creadorId, String creadorNombre) {
        return new PartidaCreadaEvent(
                UUID.randomUUID().toString(),
                Instant.now(),
                partidaId,
                creadorId,
                creadorNombre
        );
    }

    @Override
    public String getEventType() {
        return "PARTIDA_CREADA";
    }
}
