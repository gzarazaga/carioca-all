package com.carioca.domain.model.juego;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;

import java.util.UUID;

/**
 * Representa una carta del juego.
 * Cada carta tiene un identificador único, un valor y un palo.
 * Los comodines no tienen palo.
 */
@Getter
@EqualsAndHashCode(of = "id")
@ToString
public class Carta {

    private final String id;
    private final Valor valor;
    private final Palo palo;

    private Carta(String id, Valor valor, Palo palo) {
        this.id = id;
        this.valor = valor;
        this.palo = palo;
    }

    /**
     * Crea una carta normal con valor y palo.
     */
    public static Carta of(Valor valor, Palo palo) {
        if (valor == Valor.COMODIN) {
            throw new IllegalArgumentException("Usar crearComodin() para crear comodines");
        }
        return new Carta(UUID.randomUUID().toString(), valor, palo);
    }

    /**
     * Crea un comodín (sin palo).
     */
    public static Carta crearComodin() {
        return new Carta(UUID.randomUUID().toString(), Valor.COMODIN, null);
    }

    /**
     * Reconstruye una carta desde persistencia.
     */
    public static Carta reconstitute(String id, Valor valor, Palo palo) {
        return new Carta(id, valor, palo);
    }

    public boolean esComodin() {
        return valor == Valor.COMODIN;
    }

    public int getPuntos() {
        return valor.getPuntos();
    }

    /**
     * Verifica si esta carta puede seguir a otra en una escalera.
     */
    public boolean puedeSeguirA(Carta otra) {
        if (this.esComodin() || otra.esComodin()) {
            return true;
        }
        if (this.palo != otra.palo) {
            return false;
        }
        return this.valor == otra.valor.getSiguiente();
    }

    /**
     * Verifica si esta carta tiene el mismo valor que otra (para piernas).
     */
    public boolean mismoValorQue(Carta otra) {
        if (this.esComodin() || otra.esComodin()) {
            return true;
        }
        return this.valor == otra.valor;
    }

    public String toNotacion() {
        if (esComodin()) {
            return "🃏";
        }
        return valor.getSimbolo() + palo.getSimbolo();
    }
}
