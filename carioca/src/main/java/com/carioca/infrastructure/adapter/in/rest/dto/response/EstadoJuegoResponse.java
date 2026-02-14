package com.carioca.infrastructure.adapter.in.rest.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.List;

/**
 * Response con el estado completo del juego.
 */
@Data
@Builder
public class EstadoJuegoResponse {

    private String partidaId;
    private String estado;
    private int numeroRonda;
    private String descripcionRonda;
    private String estadoTurno;
    private String jugadorActualId;
    private String jugadorActualNombre;
    private int cartasEnMazo;
    private CartaResponse cartaSuperiorDescarte;
    private List<JugadorResponse> jugadores;
    private List<FormacionResponse> formacionesEnMesa;
    private Instant fechaCreacion;
    private Instant fechaInicio;
    private String ganadorId;

    @Data
    @Builder
    public static class FormacionResponse {
        private String id;
        private String tipo;
        private String propietarioId;
        private List<CartaResponse> cartas;
    }
}
