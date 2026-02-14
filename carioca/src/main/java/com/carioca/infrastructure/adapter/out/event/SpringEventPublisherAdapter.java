package com.carioca.infrastructure.adapter.out.event;

import com.carioca.domain.model.event.DomainEvent;
import com.carioca.domain.port.out.EventPublisherPort;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;

/**
 * Adaptador que publica eventos de dominio usando Spring Events.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class SpringEventPublisherAdapter implements EventPublisherPort {

    private final ApplicationEventPublisher eventPublisher;

    @Override
    public void publish(DomainEvent event) {
        log.debug("Publicando evento de dominio: {} - {}", event.getEventType(), event.getEventId());
        eventPublisher.publishEvent(event);
    }
}
