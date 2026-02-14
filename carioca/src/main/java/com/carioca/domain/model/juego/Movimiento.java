package com.carioca.domain.model.juego;

import lombok.Value;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

/**
 * Representa un movimiento realizado en el juego.
 * Usado para el historial y sincronización con clientes.
 */
@Value
public class Movimiento {

    String id;
    TipoMovimiento tipo;
    String jugadorId;
    String partidaId;
    int numeroRonda;
    int numeroTurno;
    List<String> cartasInvolucradas;
    String formacionId;
    Instant timestamp;

    public enum TipoMovimiento {
        ROBAR_MAZO,
        ROBAR_DESCARTE,
        DESCARTAR,
        BAJAR_FORMACION,
        PEGAR_CARTA
    }

    public static Movimiento robarDeMazo(String jugadorId, String partidaId, int ronda, int turno, Carta carta) {
        return new Movimiento(
                UUID.randomUUID().toString(),
                TipoMovimiento.ROBAR_MAZO,
                jugadorId,
                partidaId,
                ronda,
                turno,
                List.of(carta.getId()),
                null,
                Instant.now()
        );
    }

    public static Movimiento robarDeDescarte(String jugadorId, String partidaId, int ronda, int turno, Carta carta) {
        return new Movimiento(
                UUID.randomUUID().toString(),
                TipoMovimiento.ROBAR_DESCARTE,
                jugadorId,
                partidaId,
                ronda,
                turno,
                List.of(carta.getId()),
                null,
                Instant.now()
        );
    }

    public static Movimiento descartar(String jugadorId, String partidaId, int ronda, int turno, Carta carta) {
        return new Movimiento(
                UUID.randomUUID().toString(),
                TipoMovimiento.DESCARTAR,
                jugadorId,
                partidaId,
                ronda,
                turno,
                List.of(carta.getId()),
                null,
                Instant.now()
        );
    }

    public static Movimiento bajarFormacion(String jugadorId, String partidaId, int ronda, int turno,
                                            Formacion formacion) {
        return new Movimiento(
                UUID.randomUUID().toString(),
                TipoMovimiento.BAJAR_FORMACION,
                jugadorId,
                partidaId,
                ronda,
                turno,
                formacion.getCartas().stream().map(Carta::getId).toList(),
                formacion.getId(),
                Instant.now()
        );
    }

    public static Movimiento pegarCarta(String jugadorId, String partidaId, int ronda, int turno,
                                        Carta carta, String formacionId) {
        return new Movimiento(
                UUID.randomUUID().toString(),
                TipoMovimiento.PEGAR_CARTA,
                jugadorId,
                partidaId,
                ronda,
                turno,
                List.of(carta.getId()),
                formacionId,
                Instant.now()
        );
    }
}
