package com.carioca.domain.model.juego;

import lombok.Getter;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * Representa la pila de descarte del juego.
 * Los jugadores pueden robar la carta superior del descarte.
 */
@Getter
public class PilaDescarte {

    private final List<Carta> cartas;

    private PilaDescarte(List<Carta> cartas) {
        this.cartas = new ArrayList<>(cartas);
    }

    public static PilaDescarte crear() {
        return new PilaDescarte(new ArrayList<>());
    }

    public static PilaDescarte reconstitute(List<Carta> cartas) {
        return new PilaDescarte(cartas);
    }

    /**
     * Descarta una carta en la pila.
     */
    public void descartar(Carta carta) {
        cartas.add(carta);
    }

    /**
     * Obtiene la carta superior sin removerla.
     */
    public Optional<Carta> verSuperior() {
        if (cartas.isEmpty()) {
            return Optional.empty();
        }
        return Optional.of(cartas.get(cartas.size() - 1));
    }

    /**
     * Toma la carta superior de la pila.
     */
    public Optional<Carta> tomarSuperior() {
        if (cartas.isEmpty()) {
            return Optional.empty();
        }
        return Optional.of(cartas.remove(cartas.size() - 1));
    }

    /**
     * Recoge todas las cartas excepto la superior (para reciclar al mazo).
     */
    public List<Carta> recogerExceptoSuperior() {
        if (cartas.size() <= 1) {
            return new ArrayList<>();
        }
        List<Carta> recogidas = new ArrayList<>(cartas.subList(0, cartas.size() - 1));
        Carta superior = cartas.get(cartas.size() - 1);
        cartas.clear();
        cartas.add(superior);
        return recogidas;
    }

    public boolean estaVacia() {
        return cartas.isEmpty();
    }

    public int cantidadCartas() {
        return cartas.size();
    }
}
