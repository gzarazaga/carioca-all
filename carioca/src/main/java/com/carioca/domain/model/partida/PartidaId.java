package com.carioca.domain.model.partida;

import lombok.Value;

import java.util.UUID;

/**
 * Value Object que representa el identificador único de una partida.
 */
@Value
public class PartidaId {

    String valor;

    private PartidaId(String valor) {
        this.valor = valor;
    }

    public static PartidaId generar() {
        return new PartidaId(UUID.randomUUID().toString());
    }

    public static PartidaId of(String valor) {
        if (valor == null || valor.isBlank()) {
            throw new IllegalArgumentException("El ID de partida no puede ser vacío");
        }
        return new PartidaId(valor);
    }

    @Override
    public String toString() {
        return valor;
    }
}
