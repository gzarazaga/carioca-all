package com.carioca.domain.model.jugador;

import lombok.Value;

import java.util.UUID;

/**
 * Value Object que representa el identificador único de un jugador.
 */
@Value
public class JugadorId {

    String valor;

    private JugadorId(String valor) {
        this.valor = valor;
    }

    public static JugadorId generar() {
        return new JugadorId(UUID.randomUUID().toString());
    }

    public static JugadorId of(String valor) {
        if (valor == null || valor.isBlank()) {
            throw new IllegalArgumentException("El ID de jugador no puede ser vacío");
        }
        return new JugadorId(valor);
    }

    @Override
    public String toString() {
        return valor;
    }
}
