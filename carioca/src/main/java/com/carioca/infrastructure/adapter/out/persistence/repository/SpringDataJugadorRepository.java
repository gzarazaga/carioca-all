package com.carioca.infrastructure.adapter.out.persistence.repository;

import com.carioca.infrastructure.adapter.out.persistence.entity.JugadorEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repositorio Spring Data JPA para jugadores.
 */
@Repository
public interface SpringDataJugadorRepository extends JpaRepository<JugadorEntity, String> {

    /**
     * Busca un jugador por nombre.
     */
    Optional<JugadorEntity> findByNombre(String nombre);
}
