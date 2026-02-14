package com.carioca.infrastructure.adapter.in.rest.mapper;

import com.carioca.domain.model.jugador.Jugador;
import com.carioca.infrastructure.adapter.in.rest.dto.response.JugadorResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

/**
 * Mapper para convertir Jugador a JugadorResponse.
 */
@Mapper(componentModel = "spring", uses = {CartaRestMapper.class})
public interface JugadorRestMapper {

    @Mapping(target = "id", expression = "java(jugador.getIdValue())")
    @Mapping(target = "cartasEnMano", expression = "java(jugador.cantidadCartasEnMano())")
    @Mapping(target = "cartas", ignore = true) // Se llena manualmente según permisos
    @Mapping(target = "haBajado", ignore = true) // Se llena con contexto de ronda
    JugadorResponse toResponse(Jugador jugador);

    List<JugadorResponse> toResponseList(List<Jugador> jugadores);
}
