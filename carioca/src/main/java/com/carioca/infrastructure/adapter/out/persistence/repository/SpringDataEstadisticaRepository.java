package com.carioca.infrastructure.adapter.out.persistence.repository;

import com.carioca.infrastructure.adapter.out.persistence.entity.EstadisticaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repositorio Spring Data JPA para estadísticas.
 */
@Repository
public interface SpringDataEstadisticaRepository extends JpaRepository<EstadisticaEntity, Long> {

    /**
     * Busca estadísticas por nombre de jugador.
     */
    Optional<EstadisticaEntity> findByJugadorNombre(String jugadorNombre);
}
