package com.carioca.domain.model.jugador;

import com.carioca.domain.model.juego.Carta;
import lombok.Getter;

import java.util.List;
import java.util.Optional;

/**
 * Representa un jugador en una partida de Carioca.
 */
@Getter
public class Jugador {

    private final JugadorId id;
    private final String nombre;
    private final Mano mano;
    private int puntosTotales;
    private int rondaActual;
    private boolean conectado;

    private Jugador(JugadorId id, String nombre, Mano mano, int puntosTotales, int rondaActual, boolean conectado) {
        this.id = id;
        this.nombre = nombre;
        this.mano = mano;
        this.puntosTotales = puntosTotales;
        this.rondaActual = rondaActual;
        this.conectado = conectado;
    }

    /**
     * Crea un nuevo jugador.
     */
    public static Jugador crear(String nombre) {
        return new Jugador(
                JugadorId.generar(),
                nombre,
                Mano.vacia(),
                0,
                1,
                true
        );
    }

    /**
     * Reconstruye un jugador desde persistencia.
     */
    public static Jugador reconstitute(JugadorId id, String nombre, Mano mano,
                                       int puntosTotales, int rondaActual, boolean conectado) {
        return new Jugador(id, nombre, mano, puntosTotales, rondaActual, conectado);
    }

    /**
     * Recibe cartas iniciales para una ronda.
     */
    public void recibirCartas(List<Carta> cartas) {
        mano.agregar(cartas);
    }

    /**
     * Agrega una carta a la mano (al robar).
     */
    public void agregarCarta(Carta carta) {
        mano.agregar(carta);
    }

    /**
     * Descarta una carta de la mano.
     */
    public Optional<Carta> descartarCarta(String cartaId) {
        return mano.remover(cartaId);
    }

    /**
     * Remueve múltiples cartas de la mano (al bajar formación).
     */
    public List<Carta> removerCartas(List<String> cartaIds) {
        return mano.remover(cartaIds);
    }

    /**
     * Verifica si el jugador tiene una carta específica.
     */
    public boolean tieneCarta(String cartaId) {
        return mano.contiene(cartaId);
    }

    /**
     * Suma puntos al total del jugador (al final de cada ronda).
     */
    public void sumarPuntos(int puntos) {
        this.puntosTotales += puntos;
    }

    /**
     * Calcula los puntos de las cartas restantes en mano.
     */
    public int calcularPuntosEnMano() {
        return mano.calcularPuntos();
    }

    /**
     * Avanza a la siguiente ronda.
     */
    public void avanzarRonda() {
        this.rondaActual++;
    }

    /**
     * Prepara al jugador para una nueva ronda (vacía la mano).
     */
    public void prepararNuevaRonda() {
        mano.vaciar();
    }

    /**
     * Marca al jugador como desconectado.
     */
    public void desconectar() {
        this.conectado = false;
    }

    /**
     * Marca al jugador como conectado.
     */
    public void reconectar() {
        this.conectado = true;
    }

    public boolean tieneCartasEnMano() {
        return !mano.estaVacia();
    }

    public int cantidadCartasEnMano() {
        return mano.cantidadCartas();
    }

    public String getIdValue() {
        return id.getValor();
    }
}
