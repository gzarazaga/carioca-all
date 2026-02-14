package com.carioca.infrastructure.adapter.out.persistence.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * Entidad JPA para persistir estadísticas de jugadores.
 */
@Entity
@Table(name = "estadisticas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EstadisticaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "jugador_nombre", nullable = false)
    private String jugadorNombre;

    @Column(name = "partidas_jugadas")
    private int partidasJugadas;

    @Column(name = "partidas_ganadas")
    private int partidasGanadas;

    @Column(name = "rondas_ganadas")
    private int rondasGanadas;

    @Column(name = "puntos_totales_acumulados")
    private int puntosTotalesAcumulados;

    @Column(name = "mejor_puntuacion")
    private int mejorPuntuacion;
}
