package com.carioca.domain.service.impl;

import com.carioca.domain.model.juego.Carta;
import com.carioca.domain.model.jugador.Jugador;
import com.carioca.domain.model.partida.Partida;
import com.carioca.domain.service.CalculadorPuntosService;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Implementación del servicio de cálculo de puntos.
 */
public class CalculadorPuntosServiceImpl implements CalculadorPuntosService {

    @Override
    public int calcularPuntos(List<Carta> cartas) {
        return cartas.stream()
                .mapToInt(Carta::getPuntos)
                .sum();
    }

    @Override
    public int calcularPuntosEnMano(Jugador jugador) {
        return jugador.calcularPuntosEnMano();
    }

    @Override
    public Map<String, Integer> calcularPuntosRonda(Partida partida, String ganadorRondaId) {
        Map<String, Integer> puntos = new HashMap<>();

        for (Jugador jugador : partida.getJugadores()) {
            if (jugador.getIdValue().equals(ganadorRondaId)) {
                puntos.put(jugador.getIdValue(), 0);
            } else {
                puntos.put(jugador.getIdValue(), jugador.calcularPuntosEnMano());
            }
        }

        return puntos;
    }

    @Override
    public List<Map.Entry<String, Integer>> obtenerRankingFinal(Partida partida) {
        Map<String, Integer> puntosTotales = new HashMap<>();

        for (Jugador jugador : partida.getJugadores()) {
            puntosTotales.put(jugador.getIdValue(), jugador.getPuntosTotales());
        }

        // Ordenar por puntos ascendente (menos puntos = mejor posición)
        return puntosTotales.entrySet().stream()
                .sorted(Map.Entry.comparingByValue())
                .collect(Collectors.toList());
    }
}
