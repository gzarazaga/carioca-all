package com.carioca.domain.model.jugador;

import com.carioca.domain.model.juego.Carta;
import lombok.Getter;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * Representa la mano de cartas de un jugador.
 */
@Getter
public class Mano {

    private final List<Carta> cartas;

    private Mano(List<Carta> cartas) {
        this.cartas = new ArrayList<>(cartas);
    }

    public static Mano vacia() {
        return new Mano(new ArrayList<>());
    }

    public static Mano conCartas(List<Carta> cartas) {
        return new Mano(cartas);
    }

    /**
     * Agrega una carta a la mano.
     */
    public void agregar(Carta carta) {
        cartas.add(carta);
    }

    /**
     * Agrega múltiples cartas a la mano.
     */
    public void agregar(List<Carta> nuevasCartas) {
        cartas.addAll(nuevasCartas);
    }

    /**
     * Remueve una carta de la mano por su ID.
     */
    public Optional<Carta> remover(String cartaId) {
        for (int i = 0; i < cartas.size(); i++) {
            if (cartas.get(i).getId().equals(cartaId)) {
                return Optional.of(cartas.remove(i));
            }
        }
        return Optional.empty();
    }

    /**
     * Remueve múltiples cartas de la mano.
     */
    public List<Carta> remover(List<String> cartaIds) {
        List<Carta> removidas = new ArrayList<>();
        for (String id : cartaIds) {
            remover(id).ifPresent(removidas::add);
        }
        return removidas;
    }

    /**
     * Busca una carta en la mano por su ID.
     */
    public Optional<Carta> buscar(String cartaId) {
        return cartas.stream()
                .filter(c -> c.getId().equals(cartaId))
                .findFirst();
    }

    /**
     * Verifica si la mano contiene una carta específica.
     */
    public boolean contiene(String cartaId) {
        return cartas.stream().anyMatch(c -> c.getId().equals(cartaId));
    }

    /**
     * Calcula el total de puntos de las cartas en la mano.
     */
    public int calcularPuntos() {
        return cartas.stream()
                .mapToInt(Carta::getPuntos)
                .sum();
    }

    public boolean estaVacia() {
        return cartas.isEmpty();
    }

    public int cantidadCartas() {
        return cartas.size();
    }

    /**
     * Limpia todas las cartas de la mano.
     */
    public List<Carta> vaciar() {
        List<Carta> todas = new ArrayList<>(cartas);
        cartas.clear();
        return todas;
    }
}
