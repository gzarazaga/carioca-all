package com.carioca.domain.usecase.juego.descartarcarta.impl;

import com.carioca.domain.exception.PartidaNoEncontradaException;
import com.carioca.domain.model.partida.EstadoPartida;
import com.carioca.domain.model.partida.Partida;
import com.carioca.domain.port.out.NotificacionPort;
import com.carioca.domain.port.out.PartidaRepositoryPort;
import com.carioca.domain.usecase.juego.descartarcarta.DescartarCartaCommand;
import com.carioca.domain.usecase.juego.descartarcarta.DescartarCartaUseCase;
import lombok.RequiredArgsConstructor;

/**
 * Implementación del caso de uso para descartar carta.
 */
@RequiredArgsConstructor
public class DescartarCartaUseCaseImpl implements DescartarCartaUseCase {

    private final PartidaRepositoryPort partidaRepository;
    private final NotificacionPort notificacionPort;

    @Override
    public void ejecutar(DescartarCartaCommand command) {
        Partida partida = partidaRepository.findById(command.getPartidaId())
                .orElseThrow(() -> new PartidaNoEncontradaException(command.getPartidaId()));

        // Guardar estado previo para detectar cambios
        int rondaAntes = partida.getNumeroRondaActual();
        EstadoPartida estadoAntes = partida.getEstado();

        // Ejecutar el descarte
        partida.descartarCarta(command.getJugadorId(), command.getCartaId());

        // Persistir
        partidaRepository.save(partida);

        // Notificar el descarte
        partida.getPilaDescarte().verSuperior().ifPresent(carta ->
                notificacionPort.notificarCartaDescartada(
                        command.getPartidaId(),
                        command.getJugadorId(),
                        carta
                )
        );

        // Verificar si hubo cambio de estado
        if (partida.getEstado() == EstadoPartida.FINALIZADA && estadoAntes != EstadoPartida.FINALIZADA) {
            // Partida terminó
            notificacionPort.notificarFinPartida(
                    command.getPartidaId(),
                    partida.getGanadorId(),
                    null // Se podría calcular los puntos aquí
            );
        } else if (partida.getNumeroRondaActual() != rondaAntes) {
            // Cambió la ronda
            notificacionPort.notificarFinRonda(
                    command.getPartidaId(),
                    rondaAntes,
                    command.getJugadorId(),
                    null
            );
        }

        // Notificar turno al siguiente jugador
        if (partida.estaEnCurso()) {
            notificacionPort.notificarTurno(
                    command.getPartidaId(),
                    partida.obtenerJugadorActual().getIdValue()
            );
        }
    }
}
