package com.carioca.domain.service;

import com.carioca.domain.model.juego.Carta;
import com.carioca.domain.model.jugador.Jugador;
import com.carioca.domain.model.partida.Partida;

import java.util.List;
import java.util.Map;

/**
 * Servicio de dominio para calcular puntos.
 */
public interface CalculadorPuntosService {

    /**
     * Calcula los puntos de una lista de cartas.
     */
    int calcularPuntos(List<Carta> cartas);

    /**
     * Calcula los puntos en mano de un jugador.
     */
    int calcularPuntosEnMano(Jugador jugador);

    /**
     * Calcula los puntos de todos los jugadores al final de una ronda.
     */
    Map<String, Integer> calcularPuntosRonda(Partida partida, String ganadorRondaId);

    /**
     * Obtiene el ranking final de una partida.
     */
    List<Map.Entry<String, Integer>> obtenerRankingFinal(Partida partida);
}
