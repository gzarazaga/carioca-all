package com.carioca.infrastructure.adapter.in.rest;

import com.carioca.domain.model.juego.Formacion;
import com.carioca.domain.model.juego.TipoFormacion;
import com.carioca.domain.usecase.juego.bajarformacion.BajarFormacionCommand;
import com.carioca.domain.usecase.juego.bajarformacion.BajarFormacionUseCase;
import com.carioca.domain.usecase.juego.descartarcarta.DescartarCartaCommand;
import com.carioca.domain.usecase.juego.descartarcarta.DescartarCartaUseCase;
import com.carioca.domain.usecase.juego.pegarcarta.PegarCartaCommand;
import com.carioca.domain.usecase.juego.pegarcarta.PegarCartaUseCase;
import com.carioca.domain.usecase.juego.robarcarta.CartaRobada;
import com.carioca.domain.usecase.juego.robarcarta.RobarCartaCommand;
import com.carioca.domain.usecase.juego.robarcarta.RobarCartaUseCase;
import com.carioca.infrastructure.adapter.in.rest.dto.request.*;
import com.carioca.infrastructure.adapter.in.rest.dto.response.CartaResponse;
import com.carioca.infrastructure.adapter.in.rest.dto.response.EstadoJuegoResponse;
import com.carioca.infrastructure.adapter.in.rest.dto.response.MovimientoResponse;
import com.carioca.infrastructure.adapter.in.rest.mapper.PartidaRestMapper;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador REST para operaciones de juego (movimientos).
 */
@RestController
@RequestMapping("/api/partidas/{partidaId}/juego")
@RequiredArgsConstructor
public class JuegoRestController {

    private final RobarCartaUseCase robarCartaUseCase;
    private final DescartarCartaUseCase descartarCartaUseCase;
    private final BajarFormacionUseCase bajarFormacionUseCase;
    private final PegarCartaUseCase pegarCartaUseCase;
    private final PartidaRestMapper mapper;

    /**
     * Roba una carta del mazo o descarte.
     */
    @PostMapping("/robar")
    public ResponseEntity<MovimientoResponse> robarCarta(
            @PathVariable String partidaId,
            @Valid @RequestBody RobarCartaRequest request) {

        RobarCartaCommand command = request.getDelMazo()
                ? RobarCartaCommand.delMazo(partidaId, request.getJugadorId())
                : RobarCartaCommand.delDescarte(partidaId, request.getJugadorId());

        CartaRobada resultado = robarCartaUseCase.ejecutar(command);

        CartaResponse carta = CartaResponse.builder()
                .id(resultado.getCartaId())
                .valor(resultado.getValor())
                .palo(resultado.getPalo())
                .notacion(resultado.getNotacion())
                .build();

        MovimientoResponse response = MovimientoResponse.builder()
                .tipo("ROBAR")
                .exito(true)
                .mensaje(resultado.isDelMazo() ? "Carta robada del mazo" : "Carta robada del descarte")
                .carta(carta)
                .build();

        return ResponseEntity.ok(response);
    }

    /**
     * Descarta una carta.
     */
    @PostMapping("/descartar")
    public ResponseEntity<MovimientoResponse> descartarCarta(
            @PathVariable String partidaId,
            @Valid @RequestBody DescartarCartaRequest request) {

        DescartarCartaCommand command = DescartarCartaCommand.of(
                partidaId,
                request.getJugadorId(),
                request.getCartaId()
        );

        descartarCartaUseCase.ejecutar(command);

        MovimientoResponse response = MovimientoResponse.builder()
                .tipo("DESCARTAR")
                .exito(true)
                .mensaje("Carta descartada, turno terminado")
                .build();

        return ResponseEntity.ok(response);
    }

    /**
     * Baja una formación (pierna o escalera).
     */
    @PostMapping("/bajar")
    public ResponseEntity<MovimientoResponse> bajarFormacion(
            @PathVariable String partidaId,
            @Valid @RequestBody BajarFormacionRequest request) {

        TipoFormacion tipo = TipoFormacion.valueOf(request.getTipo().toUpperCase());

        BajarFormacionCommand command = BajarFormacionCommand.of(
                partidaId,
                request.getJugadorId(),
                tipo,
                request.getCartaIds()
        );

        Formacion formacion = bajarFormacionUseCase.ejecutar(command);

        EstadoJuegoResponse.FormacionResponse formacionResponse = mapper.toFormacionResponse(formacion);

        MovimientoResponse response = MovimientoResponse.builder()
                .tipo("BAJAR")
                .exito(true)
                .mensaje("Formación bajada: " + tipo.getNombre())
                .formacion(MovimientoResponse.FormacionResponse.builder()
                        .id(formacion.getId())
                        .tipo(formacion.getTipo().name())
                        .build())
                .build();

        return ResponseEntity.ok(response);
    }

    /**
     * Pega una carta a una formación existente.
     */
    @PostMapping("/pegar")
    public ResponseEntity<MovimientoResponse> pegarCarta(
            @PathVariable String partidaId,
            @Valid @RequestBody PegarCartaRequest request) {

        PegarCartaCommand command = request.getAlInicio()
                ? PegarCartaCommand.alInicio(partidaId, request.getJugadorId(),
                        request.getCartaId(), request.getFormacionId())
                : PegarCartaCommand.alFinal(partidaId, request.getJugadorId(),
                        request.getCartaId(), request.getFormacionId());

        pegarCartaUseCase.ejecutar(command);

        MovimientoResponse response = MovimientoResponse.builder()
                .tipo("PEGAR")
                .exito(true)
                .mensaje("Carta pegada a la formación")
                .build();

        return ResponseEntity.ok(response);
    }
}
