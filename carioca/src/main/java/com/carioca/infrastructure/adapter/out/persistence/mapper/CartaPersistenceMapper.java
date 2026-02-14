package com.carioca.infrastructure.adapter.out.persistence.mapper;

import com.carioca.domain.model.juego.Carta;
import com.carioca.domain.model.juego.Palo;
import com.carioca.domain.model.juego.Valor;
import com.carioca.infrastructure.adapter.out.persistence.entity.CartaEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.List;

/**
 * Mapper para convertir entre Carta y CartaEntity.
 */
@Mapper(componentModel = "spring")
public interface CartaPersistenceMapper {

    @Mapping(target = "valor", source = "valor", qualifiedByName = "valorToString")
    @Mapping(target = "palo", source = "palo", qualifiedByName = "paloToString")
    CartaEntity toEntity(Carta carta);

    List<CartaEntity> toEntityList(List<Carta> cartas);

    default Carta toDomain(CartaEntity entity) {
        if (entity == null) {
            return null;
        }
        Valor valor = Valor.valueOf(entity.getValor());
        Palo palo = entity.getPalo() != null ? Palo.valueOf(entity.getPalo()) : null;
        return Carta.reconstitute(entity.getId(), valor, palo);
    }

    default List<Carta> toDomainList(List<CartaEntity> entities) {
        if (entities == null) {
            return null;
        }
        return entities.stream().map(this::toDomain).toList();
    }

    @Named("valorToString")
    default String valorToString(Valor valor) {
        return valor != null ? valor.name() : null;
    }

    @Named("paloToString")
    default String paloToString(Palo palo) {
        return palo != null ? palo.name() : null;
    }
}
