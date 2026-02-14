package com.carioca.domain.model.event;

import java.time.Instant;

/**
 * Interfaz base para todos los eventos de dominio.
 */
public interface DomainEvent {

    /**
     * Identificador único del evento.
     */
    String getEventId();

    /**
     * Timestamp de cuando ocurrió el evento.
     */
    Instant getOccurredOn();

    /**
     * Nombre del tipo de evento.
     */
    String getEventType();
}
