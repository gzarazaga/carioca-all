package com.carioca.infrastructure.adapter.out.persistence.mapper;

import com.carioca.domain.model.juego.Carta;
import com.carioca.domain.model.jugador.Jugador;
import com.carioca.domain.model.jugador.JugadorId;
import com.carioca.domain.model.jugador.Mano;
import com.carioca.infrastructure.adapter.out.persistence.entity.CartaEntity;
import com.carioca.infrastructure.adapter.out.persistence.entity.JugadorEntity;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/**
 * Mapper para convertir entre Jugador y JugadorEntity.
 */
@Component
public class JugadorPersistenceMapper {

    private final ObjectMapper objectMapper;
    private final CartaPersistenceMapper cartaMapper;

    public JugadorPersistenceMapper(CartaPersistenceMapper cartaMapper) {
        this.objectMapper = new ObjectMapper();
        this.cartaMapper = cartaMapper;
    }

    public JugadorEntity toEntity(Jugador jugador) {
        if (jugador == null) {
            return null;
        }

        String manoJson = serializeCartas(jugador.getMano().getCartas());

        return JugadorEntity.builder()
                .id(jugador.getIdValue())
                .nombre(jugador.getNombre())
                .puntosTotales(jugador.getPuntosTotales())
                .rondaActual(jugador.getRondaActual())
                .conectado(jugador.isConectado())
                .manoJson(manoJson)
                .build();
    }

    public Jugador toDomain(JugadorEntity entity) {
        if (entity == null) {
            return null;
        }

        List<Carta> cartas = deserializeCartas(entity.getManoJson());
        Mano mano = Mano.conCartas(cartas);

        return Jugador.reconstitute(
                JugadorId.of(entity.getId()),
                entity.getNombre(),
                mano,
                entity.getPuntosTotales(),
                entity.getRondaActual(),
                entity.isConectado()
        );
    }

    public List<Jugador> toDomainList(List<JugadorEntity> entities) {
        if (entities == null) {
            return new ArrayList<>();
        }
        return entities.stream().map(this::toDomain).toList();
    }

    private String serializeCartas(List<Carta> cartas) {
        try {
            List<CartaEntity> entities = cartaMapper.toEntityList(cartas);
            return objectMapper.writeValueAsString(entities);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error serializando cartas", e);
        }
    }

    private List<Carta> deserializeCartas(String json) {
        if (json == null || json.isEmpty()) {
            return new ArrayList<>();
        }
        try {
            List<CartaEntity> entities = objectMapper.readValue(json, new TypeReference<>() {});
            return cartaMapper.toDomainList(entities);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error deserializando cartas", e);
        }
    }
}
