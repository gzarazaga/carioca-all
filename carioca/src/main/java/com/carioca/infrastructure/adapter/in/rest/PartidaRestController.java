package com.carioca.infrastructure.adapter.in.rest;

import com.carioca.domain.usecase.partida.crear.CrearPartidaCommand;
import com.carioca.domain.usecase.partida.crear.CrearPartidaUseCase;
import com.carioca.domain.usecase.partida.crear.PartidaCreada;
import com.carioca.domain.usecase.partida.iniciar.IniciarPartidaUseCase;
import com.carioca.domain.usecase.partida.obtener.EstadoPartidaResponse;
import com.carioca.domain.usecase.partida.obtener.ObtenerEstadoPartidaUseCase;
import com.carioca.domain.usecase.partida.unirse.UnirsePartidaCommand;
import com.carioca.domain.usecase.partida.unirse.UnirsePartidaUseCase;
import com.carioca.infrastructure.adapter.in.rest.dto.request.CrearPartidaRequest;
import com.carioca.infrastructure.adapter.in.rest.dto.request.UnirsePartidaRequest;
import com.carioca.infrastructure.adapter.in.rest.dto.response.EstadoJuegoResponse;
import com.carioca.infrastructure.adapter.in.rest.dto.response.PartidaResponse;
import com.carioca.infrastructure.adapter.in.rest.mapper.PartidaRestMapper;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador REST para operaciones de partida.
 */
@RestController
@RequestMapping("/api/partidas")
@RequiredArgsConstructor
public class PartidaRestController {

    private final CrearPartidaUseCase crearPartidaUseCase;
    private final UnirsePartidaUseCase unirsePartidaUseCase;
    private final IniciarPartidaUseCase iniciarPartidaUseCase;
    private final ObtenerEstadoPartidaUseCase obtenerEstadoPartidaUseCase;
    private final PartidaRestMapper mapper;

    /**
     * Crea una nueva partida.
     */
    @PostMapping
    public ResponseEntity<PartidaResponse> crearPartida(@Valid @RequestBody CrearPartidaRequest request) {
        CrearPartidaCommand command = CrearPartidaCommand.of(request.getNombreJugador());
        PartidaCreada resultado = crearPartidaUseCase.ejecutar(command);

        PartidaResponse response = PartidaResponse.builder()
                .partidaId(resultado.getPartidaId())
                .jugadorId(resultado.getJugadorId())
                .nombreJugador(resultado.getNombreJugador())
                .mensaje("Partida creada exitosamente")
                .build();

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Une un jugador a una partida existente.
     */
    @PostMapping("/{partidaId}/unirse")
    public ResponseEntity<PartidaResponse> unirsePartida(
            @PathVariable String partidaId,
            @Valid @RequestBody UnirsePartidaRequest request) {

        UnirsePartidaCommand command = UnirsePartidaCommand.of(partidaId, request.getNombreJugador());
        PartidaCreada resultado = unirsePartidaUseCase.ejecutar(command);

        PartidaResponse response = PartidaResponse.builder()
                .partidaId(resultado.getPartidaId())
                .jugadorId(resultado.getJugadorId())
                .nombreJugador(resultado.getNombreJugador())
                .mensaje("Te has unido a la partida")
                .build();

        return ResponseEntity.ok(response);
    }

    /**
     * Obtiene el estado actual de una partida.
     */
    @GetMapping("/{partidaId}")
    public ResponseEntity<EstadoJuegoResponse> obtenerEstado(@PathVariable String partidaId) {
        EstadoPartidaResponse estado = obtenerEstadoPartidaUseCase.ejecutar(partidaId);
        EstadoJuegoResponse response = mapper.toEstadoJuegoResponse(estado);
        return ResponseEntity.ok(response);
    }

    /**
     * Inicia una partida (cuando hay suficientes jugadores).
     */
    @PostMapping("/{partidaId}/iniciar")
    public ResponseEntity<EstadoJuegoResponse> iniciarPartida(@PathVariable String partidaId) {
        iniciarPartidaUseCase.ejecutar(partidaId);
        EstadoPartidaResponse estado = obtenerEstadoPartidaUseCase.ejecutar(partidaId);
        EstadoJuegoResponse response = mapper.toEstadoJuegoResponse(estado);
        return ResponseEntity.ok(response);
    }
}
