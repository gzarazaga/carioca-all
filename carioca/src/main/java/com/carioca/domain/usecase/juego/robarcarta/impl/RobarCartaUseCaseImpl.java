package com.carioca.domain.usecase.juego.robarcarta.impl;

import com.carioca.domain.exception.PartidaNoEncontradaException;
import com.carioca.domain.model.juego.Carta;
import com.carioca.domain.model.partida.Partida;
import com.carioca.domain.port.out.NotificacionPort;
import com.carioca.domain.port.out.PartidaRepositoryPort;
import com.carioca.domain.usecase.juego.robarcarta.CartaRobada;
import com.carioca.domain.usecase.juego.robarcarta.RobarCartaCommand;
import com.carioca.domain.usecase.juego.robarcarta.RobarCartaUseCase;
import lombok.RequiredArgsConstructor;

/**
 * Implementación del caso de uso para robar carta.
 */
@RequiredArgsConstructor
public class RobarCartaUseCaseImpl implements RobarCartaUseCase {

    private final PartidaRepositoryPort partidaRepository;
    private final NotificacionPort notificacionPort;

    @Override
    public CartaRobada ejecutar(RobarCartaCommand command) {
        Partida partida = partidaRepository.findById(command.getPartidaId())
                .orElseThrow(() -> new PartidaNoEncontradaException(command.getPartidaId()));

        Carta carta;
        if (command.isDelMazo()) {
            carta = partida.robarDelMazo(command.getJugadorId());
        } else {
            carta = partida.robarDelDescarte(command.getJugadorId());
        }

        partidaRepository.save(partida);

        // Notificar a otros jugadores (sin revelar la carta si es del mazo)
        notificacionPort.notificarCartaRobada(
                command.getPartidaId(),
                command.getJugadorId(),
                command.isDelMazo()
        );

        return CartaRobada.of(
                carta.getId(),
                carta.getValor().name(),
                carta.getPalo() != null ? carta.getPalo().name() : null,
                carta.toNotacion(),
                command.isDelMazo()
        );
    }
}
