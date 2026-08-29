package com.carioca.domain.model.juego;

import lombok.Getter;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

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
        return new Mazo(generarCartasCompletas());
    }

    /**
     * Repone el mazo con un juego completo de cartas nuevas (2 mazos + 4 comodines),
     * descartando lo que hubiera. Pensado para el modo test, que reinicia el mazo en
     * cada ronda para garantizar cartas suficientes (p.ej. ases) sin depender de lo
     * que haya quedado repartido o descartado en la ronda anterior.
     */
    public void reponerCompleto() {
        cartas.clear();
        cartas.addAll(generarCartasCompletas());
    }

    private static List<Carta> generarCartasCompletas() {
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

        return cartas;
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
     * Extrae del mazo hasta {@code cantidad} cartas de un valor específico, de palos
     * distintos entre sí (sin importar su posición en el mazo). Devuelve menos cartas
     * si no hay suficientes palos disponibles para ese valor. Al garantizar palos
     * distintos, el resultado siempre forma una pierna válida.
     * Pensado para el modo test, donde se garantiza a cada jugador una pierna inicial.
     */
    public List<Carta> robarPorValorConPalosDistintos(Valor valor, int cantidad) {
        List<Carta> robadas = new ArrayList<>();
        Set<Palo> palosUsados = new HashSet<>();
        var iterador = cartas.iterator();
        while (iterador.hasNext() && robadas.size() < cantidad) {
            Carta carta = iterador.next();
            if (carta.getValor() == valor && palosUsados.add(carta.getPalo())) {
                robadas.add(carta);
                iterador.remove();
            }
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
