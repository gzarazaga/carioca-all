package com.carioca.domain.port.out;

import com.carioca.domain.model.event.DomainEvent;

/**
 * Puerto de salida para publicar eventos de dominio.
 */
public interface EventPublisherPort {

    /**
     * Publica un evento de dominio.
     */
    void publish(DomainEvent event);
}
