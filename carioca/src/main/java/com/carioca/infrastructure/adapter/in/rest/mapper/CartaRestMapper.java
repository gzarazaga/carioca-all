package com.carioca.infrastructure.adapter.in.rest.mapper;

import com.carioca.domain.model.juego.Carta;
import com.carioca.infrastructure.adapter.in.rest.dto.response.CartaResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

/**
 * Mapper para convertir Carta a CartaResponse.
 */
@Mapper(componentModel = "spring")
public interface CartaRestMapper {

    @Mapping(target = "valor", expression = "java(carta.getValor().name())")
    @Mapping(target = "palo", expression = "java(carta.getPalo() != null ? carta.getPalo().name() : null)")
    @Mapping(target = "notacion", expression = "java(carta.toNotacion())")
    @Mapping(target = "puntos", expression = "java(carta.getPuntos())")
    CartaResponse toResponse(Carta carta);

    List<CartaResponse> toResponseList(List<Carta> cartas);
}
