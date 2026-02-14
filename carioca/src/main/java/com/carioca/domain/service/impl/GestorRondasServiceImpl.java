package com.carioca.domain.service.impl;

import com.carioca.domain.model.juego.RondaConfig;
import com.carioca.domain.model.partida.Partida;
import com.carioca.domain.service.GestorRondasService;

/**
 * Implementación del servicio de gestión de rondas.
 */
public class GestorRondasServiceImpl implements GestorRondasService {

    @Override
    public RondaConfig obtenerConfiguracionRondaActual(Partida partida) {
        if (partida.getRondaActual() == null) {
            return null;
        }
        return partida.getRondaActual().getConfig();
    }

    @Override
    public boolean rondaTerminada(Partida partida) {
        return partida.getRondaActual() != null && partida.getRondaActual().isFinalizada();
    }

    @Override
    public boolean esUltimaRonda(Partida partida) {
        return partida.getRondaActual() != null && partida.getRondaActual().esUltimaRonda();
    }

    @Override
    public int getTotalRondas() {
        return RondaConfig.RONDAS_CARIOCA.size();
    }

    @Override
    public String getDescripcionRonda(int numeroRonda) {
        RondaConfig config = RondaConfig.obtenerConfiguracion(numeroRonda);
        return config.getDescripcion();
    }
}
