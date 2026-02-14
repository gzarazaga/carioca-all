package com.carioca.domain.usecase.juego.bajarformacion.impl;

import com.carioca.domain.exception.PartidaNoEncontradaException;
import com.carioca.domain.model.juego.Formacion;
import com.carioca.domain.model.partida.Partida;
import com.carioca.domain.port.out.NotificacionPort;
import com.carioca.domain.port.out.PartidaRepositoryPort;
import com.carioca.domain.usecase.juego.bajarformacion.BajarFormacionCommand;
import com.carioca.domain.usecase.juego.bajarformacion.BajarFormacionUseCase;
import lombok.RequiredArgsConstructor;

/**
 * Implementación del caso de uso para bajar formación.
 */
@RequiredArgsConstructor
public class BajarFormacionUseCaseImpl implements BajarFormacionUseCase {

    private final PartidaRepositoryPort partidaRepository;
    private final NotificacionPort notificacionPort;

    @Override
    public Formacion ejecutar(BajarFormacionCommand command) {
        Partida partida = partidaRepository.findById(command.getPartidaId())
                .orElseThrow(() -> new PartidaNoEncontradaException(command.getPartidaId()));

        Formacion formacion = partida.bajarFormacion(
                command.getJugadorId(),
                command.getTipo(),
                command.getCartaIds()
        );

        partidaRepository.save(partida);

        notificacionPort.notificarFormacionBajada(
                command.getPartidaId(),
                command.getJugadorId(),
                formacion
        );

        return formacion;
    }
}
