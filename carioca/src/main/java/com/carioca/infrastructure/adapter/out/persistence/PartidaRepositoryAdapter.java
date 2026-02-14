package com.carioca.infrastructure.adapter.out.persistence;

import com.carioca.domain.model.partida.Partida;
import com.carioca.domain.model.partida.PartidaId;
import com.carioca.domain.port.out.PartidaRepositoryPort;
import com.carioca.infrastructure.adapter.out.persistence.entity.PartidaEntity;
import com.carioca.infrastructure.adapter.out.persistence.mapper.PartidaPersistenceMapper;
import com.carioca.infrastructure.adapter.out.persistence.repository.SpringDataPartidaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

/**
 * Adaptador que implementa el puerto de repositorio de partidas.
 */
@Component
@RequiredArgsConstructor
public class PartidaRepositoryAdapter implements PartidaRepositoryPort {

    private final SpringDataPartidaRepository repository;
    private final PartidaPersistenceMapper mapper;

    @Override
    public Partida save(Partida partida) {
        PartidaEntity entity = mapper.toEntity(partida);
        PartidaEntity saved = repository.save(entity);
        return mapper.toDomain(saved);
    }

    @Override
    public Optional<Partida> findById(PartidaId id) {
        return repository.findById(id.getValor())
                .map(mapper::toDomain);
    }

    @Override
    public Optional<Partida> findById(String id) {
        return repository.findById(id)
                .map(mapper::toDomain);
    }

    @Override
    public List<Partida> findActivePartidas() {
        return repository.findActivePartidas().stream()
                .map(mapper::toDomain)
                .toList();
    }

    @Override
    public List<Partida> findByJugadorId(String jugadorId) {
        return repository.findByJugadorId(jugadorId).stream()
                .map(mapper::toDomain)
                .toList();
    }

    @Override
    public void delete(PartidaId id) {
        repository.deleteById(id.getValor());
    }

    @Override
    public boolean exists(PartidaId id) {
        return repository.existsById(id.getValor());
    }
}
