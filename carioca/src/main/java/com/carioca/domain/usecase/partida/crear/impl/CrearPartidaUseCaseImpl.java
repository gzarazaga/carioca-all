package com.carioca.domain.usecase.partida.crear.impl;

import com.carioca.domain.model.event.PartidaCreadaEvent;
import com.carioca.domain.model.jugador.Jugador;
import com.carioca.domain.model.partida.Partida;
import com.carioca.domain.port.out.EventPublisherPort;
import com.carioca.domain.port.out.PartidaRepositoryPort;
import com.carioca.domain.usecase.partida.crear.CrearPartidaCommand;
import com.carioca.domain.usecase.partida.crear.CrearPartidaUseCase;
import com.carioca.domain.usecase.partida.crear.PartidaCreada;
import lombok.RequiredArgsConstructor;

/**
 * Implementación del caso de uso para crear partidas.
 */
@RequiredArgsConstructor
public class CrearPartidaUseCaseImpl implements CrearPartidaUseCase {

    private final PartidaRepositoryPort partidaRepository;
    private final EventPublisherPort eventPublisher;

    @Override
    public PartidaCreada ejecutar(CrearPartidaCommand command) {
        // Crear el jugador inicial
        Jugador creador = Jugador.crear(command.getNombreJugador());

        // Crear la partida
        Partida partida = Partida.crear(creador);

        // Persistir
        Partida partidaGuardada = partidaRepository.save(partida);

        // Publicar evento
        eventPublisher.publish(PartidaCreadaEvent.of(
                partidaGuardada.getIdValue(),
                creador.getIdValue(),
                creador.getNombre()
        ));

        return PartidaCreada.of(
                partidaGuardada.getIdValue(),
                creador.getIdValue(),
                creador.getNombre()
        );
    }
}
