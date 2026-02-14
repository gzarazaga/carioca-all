package com.carioca.domain.usecase.partida.iniciar.impl;

import com.carioca.domain.exception.PartidaNoEncontradaException;
import com.carioca.domain.model.event.PartidaIniciadaEvent;
import com.carioca.domain.model.partida.Partida;
import com.carioca.domain.port.out.EventPublisherPort;
import com.carioca.domain.port.out.NotificacionPort;
import com.carioca.domain.port.out.PartidaRepositoryPort;
import com.carioca.domain.usecase.partida.iniciar.IniciarPartidaUseCase;
import lombok.RequiredArgsConstructor;

import java.util.stream.Collectors;

/**
 * Implementación del caso de uso para iniciar partida.
 */
@RequiredArgsConstructor
public class IniciarPartidaUseCaseImpl implements IniciarPartidaUseCase {

    private final PartidaRepositoryPort partidaRepository;
    private final NotificacionPort notificacionPort;
    private final EventPublisherPort eventPublisher;

    @Override
    public void ejecutar(String partidaId) {
        Partida partida = partidaRepository.findById(partidaId)
                .orElseThrow(() -> new PartidaNoEncontradaException(partidaId));

        partida.iniciar();

        partidaRepository.save(partida);

        // Publicar evento
        eventPublisher.publish(PartidaIniciadaEvent.of(
                partida.getIdValue(),
                partida.getJugadores().stream()
                        .map(j -> j.getIdValue())
                        .collect(Collectors.toList()),
                partida.getNumeroRondaActual(),
                partida.obtenerJugadorActual().getIdValue()
        ));

        // Notificar a todos los jugadores
        notificacionPort.notificarEstadoPartida(partida);

        // Enviar cartas a cada jugador
        partida.getJugadores().forEach(jugador ->
                notificacionPort.notificarCartasJugador(
                        partida.getIdValue(),
                        jugador.getIdValue(),
                        jugador.getMano().getCartas()
                )
        );

        // Notificar turno inicial
        notificacionPort.notificarTurno(
                partida.getIdValue(),
                partida.obtenerJugadorActual().getIdValue()
        );
    }
}
