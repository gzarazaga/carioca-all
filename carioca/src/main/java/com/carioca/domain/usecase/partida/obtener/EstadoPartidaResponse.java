package com.carioca.domain.usecase.partida.obtener;

import com.carioca.domain.model.partida.EstadoPartida;
import com.carioca.domain.model.partida.EstadoTurno;
import lombok.Builder;
import lombok.Value;

import java.time.Instant;
import java.util.List;

/**
 * Respuesta con el estado actual de una partida.
 */
@Value
@Builder
public class EstadoPartidaResponse {

    String partidaId;
    EstadoPartida estado;
    int numeroRonda;
    String descripcionRonda;
    EstadoTurno estadoTurno;
    String jugadorActualId;
    String jugadorActualNombre;
    int cartasEnMazo;
    CartaResponse cartaSuperiorDescarte;
    List<JugadorResumen> jugadores;
    List<FormacionResumen> formacionesEnMesa;
    Instant fechaCreacion;
    Instant fechaInicio;
    String ganadorId;

    @Value
    @Builder
    public static class JugadorResumen {
        String id;
        String nombre;
        int cartasEnMano;
        int puntosTotales;
        boolean haBajado;
        boolean conectado;
    }

    @Value
    @Builder
    public static class FormacionResumen {
        String id;
        String tipo;
        String propietarioId;
        List<CartaResponse> cartas;
    }

    @Value
    @Builder
    public static class CartaResponse {
        String id;
        String valor;
        String palo;
        String notacion;
    }
}
