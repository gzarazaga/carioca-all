package com.carioca.infrastructure.adapter.in.rest.mapper;

import com.carioca.domain.model.juego.Formacion;
import com.carioca.domain.model.partida.Partida;
import com.carioca.domain.usecase.partida.obtener.EstadoPartidaResponse;
import com.carioca.infrastructure.adapter.in.rest.dto.response.CartaResponse;
import com.carioca.infrastructure.adapter.in.rest.dto.response.EstadoJuegoResponse;
import com.carioca.infrastructure.adapter.in.rest.dto.response.JugadorResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Mapper para convertir entre objetos de dominio/usecase y DTOs REST.
 */
@Component
@RequiredArgsConstructor
public class PartidaRestMapper {

    private final CartaRestMapper cartaMapper;
    private final JugadorRestMapper jugadorMapper;

    public EstadoJuegoResponse toEstadoJuegoResponse(EstadoPartidaResponse estado) {
        return EstadoJuegoResponse.builder()
                .partidaId(estado.getPartidaId())
                .estado(estado.getEstado().name())
                .numeroRonda(estado.getNumeroRonda())
                .descripcionRonda(estado.getDescripcionRonda())
                .estadoTurno(estado.getEstadoTurno() != null ? estado.getEstadoTurno().name() : null)
                .jugadorActualId(estado.getJugadorActualId())
                .jugadorActualNombre(estado.getJugadorActualNombre())
                .cartasEnMazo(estado.getCartasEnMazo())
                .cartaSuperiorDescarte(convertirCarta(estado.getCartaSuperiorDescarte()))
                .jugadores(convertirJugadores(estado.getJugadores()))
                .formacionesEnMesa(convertirFormaciones(estado.getFormacionesEnMesa()))
                .fechaCreacion(estado.getFechaCreacion())
                .fechaInicio(estado.getFechaInicio())
                .ganadorId(estado.getGanadorId())
                .build();
    }

    private CartaResponse convertirCarta(EstadoPartidaResponse.CartaResponse carta) {
        if (carta == null) {
            return null;
        }
        return CartaResponse.builder()
                .id(carta.getId())
                .valor(carta.getValor())
                .palo(carta.getPalo())
                .notacion(carta.getNotacion())
                .build();
    }

    private List<JugadorResponse> convertirJugadores(List<EstadoPartidaResponse.JugadorResumen> jugadores) {
        if (jugadores == null) {
            return List.of();
        }
        return jugadores.stream()
                .map(j -> JugadorResponse.builder()
                        .id(j.getId())
                        .nombre(j.getNombre())
                        .cartasEnMano(j.getCartasEnMano())
                        .puntosTotales(j.getPuntosTotales())
                        .haBajado(j.isHaBajado())
                        .conectado(j.isConectado())
                        .build())
                .toList();
    }

    private List<EstadoJuegoResponse.FormacionResponse> convertirFormaciones(
            List<EstadoPartidaResponse.FormacionResumen> formaciones) {
        if (formaciones == null) {
            return List.of();
        }
        return formaciones.stream()
                .map(f -> EstadoJuegoResponse.FormacionResponse.builder()
                        .id(f.getId())
                        .tipo(f.getTipo())
                        .propietarioId(f.getPropietarioId())
                        .cartas(f.getCartas().stream()
                                .map(this::convertirCarta)
                                .toList())
                        .build())
                .toList();
    }

    public EstadoJuegoResponse.FormacionResponse toFormacionResponse(Formacion formacion) {
        return EstadoJuegoResponse.FormacionResponse.builder()
                .id(formacion.getId())
                .tipo(formacion.getTipo().name())
                .propietarioId(formacion.getJugadorPropietarioId())
                .cartas(cartaMapper.toResponseList(formacion.getCartas()))
                .build();
    }
}
