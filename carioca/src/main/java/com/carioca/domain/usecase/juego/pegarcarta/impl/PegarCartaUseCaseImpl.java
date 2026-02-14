package com.carioca.domain.usecase.juego.pegarcarta.impl;

import com.carioca.domain.exception.PartidaNoEncontradaException;
import com.carioca.domain.model.juego.Carta;
import com.carioca.domain.model.partida.Partida;
import com.carioca.domain.port.out.NotificacionPort;
import com.carioca.domain.port.out.PartidaRepositoryPort;
import com.carioca.domain.usecase.juego.pegarcarta.PegarCartaCommand;
import com.carioca.domain.usecase.juego.pegarcarta.PegarCartaUseCase;
import lombok.RequiredArgsConstructor;

/**
 * Implementación del caso de uso para pegar carta.
 */
@RequiredArgsConstructor
public class PegarCartaUseCaseImpl implements PegarCartaUseCase {

    private final PartidaRepositoryPort partidaRepository;
    private final NotificacionPort notificacionPort;

    @Override
    public void ejecutar(PegarCartaCommand command) {
        Partida partida = partidaRepository.findById(command.getPartidaId())
                .orElseThrow(() -> new PartidaNoEncontradaException(command.getPartidaId()));

        // Obtener la carta antes de pegarla
        Carta carta = partida.obtenerJugador(command.getJugadorId())
                .flatMap(j -> j.getMano().buscar(command.getCartaId()))
                .orElse(null);

        partida.pegarCarta(
                command.getJugadorId(),
                command.getCartaId(),
                command.getFormacionId(),
                command.isAlInicio()
        );

        partidaRepository.save(partida);

        if (carta != null) {
            notificacionPort.notificarCartaPegada(
                    command.getPartidaId(),
                    command.getJugadorId(),
                    command.getFormacionId(),
                    carta
            );
        }
    }
}
