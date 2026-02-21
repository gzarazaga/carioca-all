package com.carioca.domain.usecase.juego.bajarformacion.impl;

import com.carioca.domain.exception.PartidaNoEncontradaException;
import com.carioca.domain.model.juego.Formacion;
import com.carioca.domain.model.partida.Partida;
import com.carioca.domain.port.out.NotificacionPort;
import com.carioca.domain.port.out.PartidaRepositoryPort;
import com.carioca.domain.usecase.juego.bajarformacion.BajarFormacionCommand;
import com.carioca.domain.usecase.juego.bajarformacion.BajarFormacionUseCase;
import lombok.RequiredArgsConstructor;

import java.util.List;

/**
 * Implementación del caso de uso para bajar formaciones.
 */
@RequiredArgsConstructor
public class BajarFormacionUseCaseImpl implements BajarFormacionUseCase {

    private final PartidaRepositoryPort partidaRepository;
    private final NotificacionPort notificacionPort;

    @Override
    public List<Formacion> ejecutar(BajarFormacionCommand command) {
        Partida partida = partidaRepository.findById(command.getPartidaId())
                .orElseThrow(() -> new PartidaNoEncontradaException(command.getPartidaId()));

        List<Formacion> formaciones = partida.bajarFormacion(
                command.getJugadorId(),
                command.getFormaciones()
        );

        partidaRepository.save(partida);

        for (Formacion formacion : formaciones) {
            notificacionPort.notificarFormacionBajada(
                    command.getPartidaId(),
                    command.getJugadorId(),
                    formacion
            );
        }

        return formaciones;
    }
}