package com.carioca.domain.model.juego;

import lombok.Value;

import java.util.List;

/**
 * Configuración de los requisitos para cada ronda del juego Carioca.
 * Define cuántas piernas y escaleras se necesitan para bajar.
 */
@Value
public class RondaConfig {

    int numeroRonda;
    int piernasRequeridas;
    int escalerasRequeridas;
    String descripcion;

    /**
     * Configuraciones para las 7 rondas del juego Carioca.
     */
    public static final List<RondaConfig> RONDAS_CARIOCA = List.of(
            new RondaConfig(1, 2, 0, "2 Piernas"),
            new RondaConfig(2, 1, 1, "1 Pierna + 1 Escalera"),
            new RondaConfig(3, 0, 2, "2 Escaleras"),
            new RondaConfig(4, 3, 0, "3 Piernas"),
            new RondaConfig(5, 2, 1, "2 Piernas + 1 Escalera"),
            new RondaConfig(6, 1, 2, "1 Pierna + 2 Escaleras"),
            new RondaConfig(7, 0, 3, "3 Escaleras")
    );

    /**
     * Obtiene la configuración de una ronda específica.
     */
    public static RondaConfig obtenerConfiguracion(int numeroRonda) {
        if (numeroRonda < 1 || numeroRonda > RONDAS_CARIOCA.size()) {
            throw new IllegalArgumentException("Número de ronda inválido: " + numeroRonda);
        }
        return RONDAS_CARIOCA.get(numeroRonda - 1);
    }

    /**
     * Valida si un conjunto de formaciones cumple con los requisitos de la ronda.
     */
    public boolean cumpleRequisitos(List<Formacion> formaciones) {
        long piernas = formaciones.stream()
                .filter(f -> f.getTipo() == TipoFormacion.PIERNA)
                .count();
        long escaleras = formaciones.stream()
                .filter(f -> f.getTipo() == TipoFormacion.ESCALERA)
                .count();

        return piernas >= piernasRequeridas && escaleras >= escalerasRequeridas;
    }

    public int getTotalFormacionesRequeridas() {
        return piernasRequeridas + escalerasRequeridas;
    }
}
