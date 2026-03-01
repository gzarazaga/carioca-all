package com.carioca.infrastructure.adapter.out.persistence.entity;

import com.carioca.domain.model.partida.EstadoPartida;
import com.carioca.domain.model.partida.EstadoTurno;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

/**
 * Entidad JPA para persistir partidas.
 */
@Entity
@Table(name = "partidas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PartidaEntity {

    @Id
    @Column(name = "id", nullable = false, length = 36)
    private String id;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado", nullable = false)
    private EstadoPartida estado;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado_turno")
    private EstadoTurno estadoTurno;

    @Column(name = "numero_ronda")
    private int numeroRonda;

    @Column(name = "indice_jugador_actual")
    private int indiceJugadorActual;

    @Column(name = "numero_turno")
    private int numeroTurno;

    @Column(name = "fecha_creacion", nullable = false)
    private Instant fechaCreacion;

    @Column(name = "fecha_inicio")
    private Instant fechaInicio;

    @Column(name = "fecha_fin")
    private Instant fechaFin;

    @Column(name = "ganador_id", length = 36)
    private String ganadorId;

    @OneToMany(mappedBy = "partida", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @OrderColumn(name = "posicion")
    @Builder.Default
    private List<JugadorEntity> jugadores = new ArrayList<>();

    @Lob
    @Column(name = "mazo_json", columnDefinition = "TEXT")
    private String mazoJson;

    @Lob
    @Column(name = "descarte_json", columnDefinition = "TEXT")
    private String descarteJson;

    @Lob
    @Column(name = "ronda_json", columnDefinition = "TEXT")
    private String rondaJson;

    @Lob
    @Column(name = "historial_json", columnDefinition = "TEXT")
    private String historialJson;

    public void addJugador(JugadorEntity jugador) {
        jugadores.add(jugador);
        jugador.setPartida(this);
    }

    public void removeJugador(JugadorEntity jugador) {
        jugadores.remove(jugador);
        jugador.setPartida(null);
    }
}
