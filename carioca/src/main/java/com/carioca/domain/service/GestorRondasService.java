package com.carioca.domain.service;

import com.carioca.domain.model.juego.RondaConfig;
import com.carioca.domain.model.partida.Partida;

/**
 * Servicio de dominio para gestionar las rondas del juego.
 */
public interface GestorRondasService {

    /**
     * Obtiene la configuración de la ronda actual.
     */
    RondaConfig obtenerConfiguracionRondaActual(Partida partida);

    /**
     * Verifica si la ronda actual ha terminado.
     */
    boolean rondaTerminada(Partida partida);

    /**
     * Verifica si es la última ronda del juego.
     */
    boolean esUltimaRonda(Partida partida);

    /**
     * Obtiene el número de rondas totales.
     */
    int getTotalRondas();

    /**
     * Obtiene la descripción de los requisitos de una ronda.
     */
    String getDescripcionRonda(int numeroRonda);
}
