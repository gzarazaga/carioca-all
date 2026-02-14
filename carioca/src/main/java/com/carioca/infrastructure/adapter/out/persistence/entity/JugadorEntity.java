package com.carioca.infrastructure.adapter.out.persistence.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * Entidad JPA para persistir jugadores dentro de una partida.
 */
@Entity
@Table(name = "jugadores")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JugadorEntity {

    @Id
    @Column(name = "id", nullable = false, length = 36)
    private String id;

    @Column(name = "nombre", nullable = false)
    private String nombre;

    @Column(name = "puntos_totales")
    private int puntosTotales;

    @Column(name = "ronda_actual")
    private int rondaActual;

    @Column(name = "conectado")
    private boolean conectado;

    @Lob
    @Column(name = "mano_json", columnDefinition = "TEXT")
    private String manoJson;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "partida_id")
    private PartidaEntity partida;
}
