package com.carioca.domain.model.juego;

import lombok.Getter;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Representa una ronda del juego Carioca.
 * Cada ronda tiene requisitos específicos de formaciones para bajar.
 */
@Getter
public class Ronda {

    private final int numero;
    private final RondaConfig config;
    private final Map<String, List<Formacion>> formacionesPorJugador;
    private final Map<String, Boolean> jugadoresQueBajaron;
    private boolean finalizada;
    private String ganadorId;

    private Ronda(int numero, RondaConfig config) {
        this.numero = numero;
        this.config = config;
        this.formacionesPorJugador = new HashMap<>();
        this.jugadoresQueBajaron = new HashMap<>();
        this.finalizada = false;
        this.ganadorId = null;
    }

    public static Ronda iniciar(int numeroRonda) {
        RondaConfig config = RondaConfig.obtenerConfiguracion(numeroRonda);
        return new Ronda(numeroRonda, config);
    }

    public static Ronda reconstitute(int numero, RondaConfig config,
                                     Map<String, List<Formacion>> formacionesPorJugador,
                                     Map<String, Boolean> jugadoresQueBajaron,
                                     boolean finalizada, String ganadorId) {
        Ronda ronda = new Ronda(numero, config);
        ronda.formacionesPorJugador.putAll(formacionesPorJugador);
        ronda.jugadoresQueBajaron.putAll(jugadoresQueBajaron);
        ronda.finalizada = finalizada;
        ronda.ganadorId = ganadorId;
        return ronda;
    }

    /**
     * Registra que un jugador ha bajado sus formaciones.
     */
    public void registrarBajada(String jugadorId, List<Formacion> formaciones) {
        if (!config.cumpleRequisitos(formaciones)) {
            throw new IllegalArgumentException("Las formaciones no cumplen los requisitos de la ronda");
        }
        formacionesPorJugador.put(jugadorId, new ArrayList<>(formaciones));
        jugadoresQueBajaron.put(jugadorId, true);
    }

    /**
     * Verifica si un jugador ya bajó en esta ronda.
     */
    public boolean haBajado(String jugadorId) {
        return jugadoresQueBajaron.getOrDefault(jugadorId, false);
    }

    /**
     * Obtiene todas las formaciones en la mesa (de todos los jugadores).
     */
    public List<Formacion> obtenerTodasLasFormaciones() {
        return formacionesPorJugador.values().stream()
                .flatMap(List::stream)
                .toList();
    }

    /**
     * Obtiene las formaciones de un jugador específico.
     */
    public List<Formacion> obtenerFormacionesJugador(String jugadorId) {
        return formacionesPorJugador.getOrDefault(jugadorId, new ArrayList<>());
    }

    /**
     * Agrega una carta a una formación existente (pegar).
     */
    public void agregarCartaAFormacion(String formacionId, Carta carta, boolean alInicio) {
        for (List<Formacion> formaciones : formacionesPorJugador.values()) {
            for (Formacion formacion : formaciones) {
                if (formacion.getId().equals(formacionId)) {
                    if (alInicio) {
                        formacion.agregarAlInicio(carta);
                    } else {
                        formacion.agregarAlFinal(carta);
                    }
                    return;
                }
            }
        }
        throw new IllegalArgumentException("Formación no encontrada: " + formacionId);
    }

    /**
     * Busca una formación por su ID.
     */
    public Formacion buscarFormacion(String formacionId) {
        return formacionesPorJugador.values().stream()
                .flatMap(List::stream)
                .filter(f -> f.getId().equals(formacionId))
                .findFirst()
                .orElse(null);
    }

    /**
     * Finaliza la ronda con un ganador.
     */
    public void finalizar(String ganadorId) {
        this.finalizada = true;
        this.ganadorId = ganadorId;
    }

    public boolean esUltimaRonda() {
        return numero == RondaConfig.RONDAS_CARIOCA.size();
    }
}
