package com.carioca.infrastructure.adapter.out.persistence.repository;

import com.carioca.domain.model.partida.EstadoPartida;
import com.carioca.infrastructure.adapter.out.persistence.entity.PartidaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositorio Spring Data JPA para partidas.
 */
@Repository
public interface SpringDataPartidaRepository extends JpaRepository<PartidaEntity, String> {

    /**
     * Encuentra partidas por estado.
     */
    List<PartidaEntity> findByEstado(EstadoPartida estado);

    /**
     * Encuentra partidas activas (esperando jugadores o en curso).
     */
    @Query("SELECT p FROM PartidaEntity p WHERE p.estado IN ('ESPERANDO_JUGADORES', 'EN_CURSO')")
    List<PartidaEntity> findActivePartidas();

    /**
     * Encuentra partidas donde participa un jugador.
     */
    @Query("SELECT p FROM PartidaEntity p JOIN p.jugadores j WHERE j.id = :jugadorId")
    List<PartidaEntity> findByJugadorId(@Param("jugadorId") String jugadorId);
}
