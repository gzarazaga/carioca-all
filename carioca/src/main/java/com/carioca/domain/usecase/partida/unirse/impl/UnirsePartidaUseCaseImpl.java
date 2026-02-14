package com.carioca.domain.usecase.partida.unirse.impl;

import com.carioca.domain.exception.PartidaNoEncontradaException;
import com.carioca.domain.model.jugador.Jugador;
import com.carioca.domain.model.partida.Partida;
import com.carioca.domain.port.out.NotificacionPort;
import com.carioca.domain.port.out.PartidaRepositoryPort;
import com.carioca.domain.usecase.partida.crear.PartidaCreada;
import com.carioca.domain.usecase.partida.unirse.UnirsePartidaCommand;
import com.carioca.domain.usecase.partida.unirse.UnirsePartidaUseCase;
import lombok.RequiredArgsConstructor;

/**
 * Implementación del caso de uso para unirse a una partida.
 */
@RequiredArgsConstructor
public class UnirsePartidaUseCaseImpl implements UnirsePartidaUseCase {

    private final PartidaRepositoryPort partidaRepository;
    private final NotificacionPort notificacionPort;

    @Override
    public PartidaCreada ejecutar(UnirsePartidaCommand command) {
        // Buscar la partida
        Partida partida = partidaRepository.findById(command.getPartidaId())
                .orElseThrow(() -> new PartidaNoEncontradaException(command.getPartidaId()));

        // Crear el nuevo jugador
        Jugador nuevoJugador = Jugador.crear(command.getNombreJugador());

        // Agregar a la partida
        partida.agregarJugador(nuevoJugador);

        // Persistir
        partidaRepository.save(partida);

        // Notificar a los demás jugadores
        notificacionPort.notificarJugadorUnido(
                partida.getIdValue(),
                nuevoJugador.getIdValue(),
                nuevoJugador.getNombre()
        );

        return PartidaCreada.of(
                partida.getIdValue(),
                nuevoJugador.getIdValue(),
                nuevoJugador.getNombre()
        );
    }
}
