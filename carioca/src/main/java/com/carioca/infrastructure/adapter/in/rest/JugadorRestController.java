package com.carioca.infrastructure.adapter.in.rest;

import com.carioca.domain.exception.JugadorNoEncontradoException;
import com.carioca.domain.exception.PartidaNoEncontradaException;
import com.carioca.domain.model.jugador.Jugador;
import com.carioca.domain.model.partida.Partida;
import com.carioca.domain.port.out.PartidaRepositoryPort;
import com.carioca.infrastructure.adapter.in.rest.dto.response.CartaResponse;
import com.carioca.infrastructure.adapter.in.rest.dto.response.JugadorResponse;
import com.carioca.infrastructure.adapter.in.rest.mapper.CartaRestMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST para operaciones de jugador.
 */
@RestController
@RequestMapping("/api/partidas/{partidaId}/jugadores")
@RequiredArgsConstructor
public class JugadorRestController {

    private final PartidaRepositoryPort partidaRepository;
    private final CartaRestMapper cartaMapper;

    /**
     * Obtiene la información de un jugador específico incluyendo sus cartas.
     */
    @GetMapping("/{jugadorId}")
    public ResponseEntity<JugadorResponse> obtenerJugador(
            @PathVariable String partidaId,
            @PathVariable String jugadorId) {

        Partida partida = partidaRepository.findById(partidaId)
                .orElseThrow(() -> new PartidaNoEncontradaException(partidaId));

        Jugador jugador = partida.obtenerJugador(jugadorId)
                .orElseThrow(() -> new JugadorNoEncontradoException(jugadorId));

        boolean haBajado = partida.getRondaActual() != null &&
                partida.getRondaActual().haBajado(jugadorId);

        List<CartaResponse> cartas = cartaMapper.toResponseList(jugador.getMano().getCartas());

        JugadorResponse response = JugadorResponse.builder()
                .id(jugador.getIdValue())
                .nombre(jugador.getNombre())
                .cartasEnMano(jugador.cantidadCartasEnMano())
                .puntosTotales(jugador.getPuntosTotales())
                .haBajado(haBajado)
                .conectado(jugador.isConectado())
                .cartas(cartas)
                .build();

        return ResponseEntity.ok(response);
    }

    /**
     * Obtiene solo las cartas de un jugador.
     */
    @GetMapping("/{jugadorId}/cartas")
    public ResponseEntity<List<CartaResponse>> obtenerCartas(
            @PathVariable String partidaId,
            @PathVariable String jugadorId) {

        Partida partida = partidaRepository.findById(partidaId)
                .orElseThrow(() -> new PartidaNoEncontradaException(partidaId));

        Jugador jugador = partida.obtenerJugador(jugadorId)
                .orElseThrow(() -> new JugadorNoEncontradoException(jugadorId));

        List<CartaResponse> cartas = cartaMapper.toResponseList(jugador.getMano().getCartas());

        return ResponseEntity.ok(cartas);
    }
}
