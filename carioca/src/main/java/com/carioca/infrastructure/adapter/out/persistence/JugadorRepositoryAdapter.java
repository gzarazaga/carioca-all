package com.carioca.infrastructure.adapter.out.persistence;

import com.carioca.domain.model.jugador.Jugador;
import com.carioca.domain.model.jugador.JugadorId;
import com.carioca.domain.port.out.JugadorRepositoryPort;
import com.carioca.infrastructure.adapter.out.persistence.mapper.JugadorPersistenceMapper;
import com.carioca.infrastructure.adapter.out.persistence.repository.SpringDataJugadorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;

/**
 * Adaptador que implementa el puerto de repositorio de jugadores.
 */
@Component
@RequiredArgsConstructor
public class JugadorRepositoryAdapter implements JugadorRepositoryPort {

    private final SpringDataJugadorRepository repository;
    private final JugadorPersistenceMapper mapper;

    @Override
    public Jugador save(Jugador jugador) {
        var entity = mapper.toEntity(jugador);
        var saved = repository.save(entity);
        return mapper.toDomain(saved);
    }

    @Override
    public Optional<Jugador> findById(JugadorId id) {
        return repository.findById(id.getValor())
                .map(mapper::toDomain);
    }

    @Override
    public Optional<Jugador> findById(String id) {
        return repository.findById(id)
                .map(mapper::toDomain);
    }

    @Override
    public Optional<Jugador> findByNombre(String nombre) {
        return repository.findByNombre(nombre)
                .map(mapper::toDomain);
    }

    @Override
    public void delete(JugadorId id) {
        repository.deleteById(id.getValor());
    }

    @Override
    public boolean exists(JugadorId id) {
        return repository.existsById(id.getValor());
    }
}
