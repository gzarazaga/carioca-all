package com.carioca.domain.usecase.partida.obtener.impl;

import com.carioca.domain.exception.PartidaNoEncontradaException;
import com.carioca.domain.model.juego.Carta;
import com.carioca.domain.model.juego.Formacion;
import com.carioca.domain.model.juego.RondaConfig;
import com.carioca.domain.model.jugador.Jugador;
import com.carioca.domain.model.partida.EstadoPartida;
import com.carioca.domain.model.partida.Partida;
import com.carioca.domain.port.out.PartidaRepositoryPort;
import com.carioca.domain.usecase.partida.obtener.EstadoPartidaResponse;
import com.carioca.domain.usecase.partida.obtener.EstadoPartidaResponse.*;
import com.carioca.domain.usecase.partida.obtener.ObtenerEstadoPartidaUseCase;
import lombok.RequiredArgsConstructor;

import java.util.ArrayList;
import java.util.List;

/**
 * Implementación del caso de uso para obtener el estado de una partida.
 */
@RequiredArgsConstructor
public class ObtenerEstadoPartidaUseCaseImpl implements ObtenerEstadoPartidaUseCase {

    private final PartidaRepositoryPort partidaRepository;

    @Override
    public EstadoPartidaResponse ejecutar(String partidaId) {
        Partida partida = partidaRepository.findById(partidaId)
                .orElseThrow(() -> new PartidaNoEncontradaException(partidaId));

        return construirResponse(partida);
    }

    private EstadoPartidaResponse construirResponse(Partida partida) {
        Jugador jugadorActual = partida.estaEnCurso() ? partida.obtenerJugadorActual() : null;

        return EstadoPartidaResponse.builder()
                .partidaId(partida.getIdValue())
                .estado(partida.getEstado())
                .numeroRonda(partida.getNumeroRondaActual())
                .descripcionRonda(obtenerDescripcionRonda(partida))
                .estadoTurno(partida.getEstadoTurno())
                .jugadorActualId(jugadorActual != null ? jugadorActual.getIdValue() : null)
                .jugadorActualNombre(jugadorActual != null ? jugadorActual.getNombre() : null)
                .cartasEnMazo(partida.getMazo().cantidadCartas())
                .cartaSuperiorDescarte(convertirCarta(partida.getPilaDescarte().verSuperior().orElse(null)))
                .jugadores(construirResumenJugadores(partida))
                .formacionesEnMesa(construirResumenFormaciones(partida))
                .fechaCreacion(partida.getFechaCreacion())
                .fechaInicio(partida.getFechaInicio())
                .ganadorId(partida.getGanadorId())
                .build();
    }

    private String obtenerDescripcionRonda(Partida partida) {
        if (partida.getRondaActual() == null) {
            return null;
        }
        return partida.getRondaActual().getConfig().getDescripcion();
    }

    private List<JugadorResumen> construirResumenJugadores(Partida partida) {
        return partida.getJugadores().stream()
                .map(j -> JugadorResumen.builder()
                        .id(j.getIdValue())
                        .nombre(j.getNombre())
                        .cartasEnMano(j.cantidadCartasEnMano())
                        .puntosTotales(j.getPuntosTotales())
                        .haBajado(partida.getRondaActual() != null &&
                                partida.getRondaActual().haBajado(j.getIdValue()))
                        .conectado(j.isConectado())
                        .build())
                .toList();
    }

    private List<FormacionResumen> construirResumenFormaciones(Partida partida) {
        if (partida.getRondaActual() == null) {
            return new ArrayList<>();
        }

        return partida.getRondaActual().obtenerTodasLasFormaciones().stream()
                .map(f -> FormacionResumen.builder()
                        .id(f.getId())
                        .tipo(f.getTipo().name())
                        .propietarioId(f.getJugadorPropietarioId())
                        .cartas(f.getCartas().stream().map(this::convertirCarta).toList())
                        .build())
                .toList();
    }

    private CartaResponse convertirCarta(Carta carta) {
        if (carta == null) {
            return null;
        }
        return CartaResponse.builder()
                .id(carta.getId())
                .valor(carta.getValor().name())
                .palo(carta.getPalo() != null ? carta.getPalo().name() : null)
                .notacion(carta.toNotacion())
                .build();
    }
}
