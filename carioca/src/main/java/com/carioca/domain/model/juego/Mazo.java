package com.carioca.domain.model.juego;

import lombok.Getter;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

/**
 * Representa el mazo de cartas del juego.
 * En Carioca se usan 2 mazos de 52 cartas + 4 comodines = 108 cartas.
 */
@Getter
public class Mazo {

    private final List<Carta> cartas;

    private Mazo(List<Carta> cartas) {
        this.cartas = new ArrayList<>(cartas);
    }

    /**
     * Crea un mazo completo para Carioca (2 mazos + 4 comodines).
     */
    public static Mazo crearMazoCompleto() {
        List<Carta> cartas = new ArrayList<>();

        // Crear 2 mazos completos
        for (int mazo = 0; mazo < 2; mazo++) {
            for (Palo palo : Palo.values()) {
                for (Valor valor : Valor.values()) {
                    if (!valor.esComodin()) {
                        cartas.add(Carta.of(valor, palo));
                    }
                }
            }
            // Añadir 2 comodines por mazo
            cartas.add(Carta.crearComodin());
            cartas.add(Carta.crearComodin());
        }

        return new Mazo(cartas);
    }

    /**
     * Reconstruye un mazo desde persistencia.
     */
    public static Mazo reconstitute(List<Carta> cartas) {
        return new Mazo(cartas);
    }

    /**
     * Baraja el mazo aleatoriamente.
     */
    public void barajar() {
        Collections.shuffle(cartas);
    }

    /**
     * Roba una carta del tope del mazo.
     */
    public Optional<Carta> robar() {
        if (cartas.isEmpty()) {
            return Optional.empty();
        }
        return Optional.of(cartas.remove(cartas.size() - 1));
    }

    /**
     * Roba múltiples cartas del mazo.
     */
    public List<Carta> robar(int cantidad) {
        List<Carta> robadas = new ArrayList<>();
        for (int i = 0; i < cantidad && !cartas.isEmpty(); i++) {
            robar().ifPresent(robadas::add);
        }
        return robadas;
    }

    /**
     * Añade cartas al fondo del mazo (para reciclar el descarte).
     */
    public void agregarAlFondo(List<Carta> nuevasCartas) {
        cartas.addAll(0, nuevasCartas);
    }

    public boolean estaVacio() {
        return cartas.isEmpty();
    }

    public int cantidadCartas() {
        return cartas.size();
    }
}
