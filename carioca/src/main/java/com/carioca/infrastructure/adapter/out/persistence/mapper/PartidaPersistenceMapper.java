package com.carioca.infrastructure.adapter.out.persistence.mapper;

import com.carioca.domain.model.juego.*;
import com.carioca.domain.model.jugador.Jugador;
import com.carioca.domain.model.partida.Partida;
import com.carioca.domain.model.partida.PartidaId;
import com.carioca.infrastructure.adapter.out.persistence.entity.*;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.*;

/**
 * Mapper para convertir entre Partida y PartidaEntity.
 */
@Component
@RequiredArgsConstructor
public class PartidaPersistenceMapper {

    private final JugadorPersistenceMapper jugadorMapper;
    private final CartaPersistenceMapper cartaMapper;
    private final ObjectMapper objectMapper;

    public PartidaEntity toEntity(Partida partida) {
        if (partida == null) {
            return null;
        }

        PartidaEntity entity = PartidaEntity.builder()
                .id(partida.getIdValue())
                .estado(partida.getEstado())
                .estadoTurno(partida.getEstadoTurno())
                .numeroRonda(partida.getNumeroRondaActual())
                .indiceJugadorActual(partida.getIndiceJugadorActual())
                .numeroTurno(partida.getNumeroTurno())
                .fechaCreacion(partida.getFechaCreacion())
                .fechaInicio(partida.getFechaInicio())
                .fechaFin(partida.getFechaFin())
                .ganadorId(partida.getGanadorId())
                .mazoJson(serializeCartas(partida.getMazo().getCartas()))
                .descarteJson(serializeCartas(partida.getPilaDescarte().getCartas()))
                .rondaJson(serializeRonda(partida.getRondaActual()))
                .historialJson(serializeHistorial(partida.getHistorialMovimientos()))
                .jugadores(new ArrayList<>())
                .build();

        for (Jugador jugador : partida.getJugadores()) {
            JugadorEntity jugadorEntity = jugadorMapper.toEntity(jugador);
            entity.addJugador(jugadorEntity);
        }

        return entity;
    }

    public Partida toDomain(PartidaEntity entity) {
        if (entity == null) {
            return null;
        }

        List<Jugador> jugadores = jugadorMapper.toDomainList(entity.getJugadores());
        List<Carta> cartasMazo = deserializeCartas(entity.getMazoJson());
        List<Carta> cartasDescarte = deserializeCartas(entity.getDescarteJson());
        Ronda ronda = deserializeRonda(entity.getRondaJson(), entity.getNumeroRonda());
        List<Movimiento> historial = deserializeHistorial(entity.getHistorialJson());

        Mazo mazo = Mazo.reconstitute(cartasMazo);
        PilaDescarte pilaDescarte = PilaDescarte.reconstitute(cartasDescarte);

        return Partida.reconstitute(
                PartidaId.of(entity.getId()),
                jugadores,
                mazo,
                pilaDescarte,
                ronda,
                entity.getEstado(),
                entity.getEstadoTurno(),
                entity.getIndiceJugadorActual(),
                entity.getNumeroTurno(),
                historial,
                entity.getFechaCreacion(),
                entity.getFechaInicio(),
                entity.getFechaFin(),
                entity.getGanadorId()
        );
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

    private String serializeRonda(Ronda ronda) {
        if (ronda == null) {
            return null;
        }
        try {
            Map<String, Object> rondaMap = new HashMap<>();
            rondaMap.put("numero", ronda.getNumero());
            rondaMap.put("finalizada", ronda.isFinalizada());
            rondaMap.put("ganadorId", ronda.getGanadorId());
            rondaMap.put("jugadoresQueBajaron", ronda.getJugadoresQueBajaron());

            // Serializar formaciones
            Map<String, List<FormacionEntity>> formacionesMap = new HashMap<>();
            for (Map.Entry<String, List<Formacion>> entry : ronda.getFormacionesPorJugador().entrySet()) {
                List<FormacionEntity> formacionesEntity = entry.getValue().stream()
                        .map(f -> FormacionEntity.builder()
                                .id(f.getId())
                                .tipo(f.getTipo().name())
                                .jugadorPropietarioId(f.getJugadorPropietarioId())
                                .cartas(cartaMapper.toEntityList(f.getCartas()))
                                .build())
                        .toList();
                formacionesMap.put(entry.getKey(), formacionesEntity);
            }
            rondaMap.put("formacionesPorJugador", formacionesMap);

            return objectMapper.writeValueAsString(rondaMap);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error serializando ronda", e);
        }
    }

    private Ronda deserializeRonda(String json, int numeroRonda) {
        if (json == null || json.isEmpty() || numeroRonda == 0) {
            return null;
        }
        try {
            Map<String, Object> rondaMap = objectMapper.readValue(json, new TypeReference<>() {});

            RondaConfig config = RondaConfig.obtenerConfiguracion(numeroRonda);
            boolean finalizada = (boolean) rondaMap.get("finalizada");
            String ganadorId = (String) rondaMap.get("ganadorId");

            @SuppressWarnings("unchecked")
            Map<String, Boolean> jugadoresQueBajaron = (Map<String, Boolean>) rondaMap.get("jugadoresQueBajaron");

            // Deserializar formaciones
            Map<String, List<Formacion>> formacionesPorJugador = new HashMap<>();
            @SuppressWarnings("unchecked")
            Map<String, List<Map<String, Object>>> formacionesMap =
                    (Map<String, List<Map<String, Object>>>) rondaMap.get("formacionesPorJugador");

            if (formacionesMap != null) {
                for (Map.Entry<String, List<Map<String, Object>>> entry : formacionesMap.entrySet()) {
                    List<Formacion> formaciones = entry.getValue().stream()
                            .map(this::deserializeFormacion)
                            .toList();
                    formacionesPorJugador.put(entry.getKey(), new ArrayList<>(formaciones));
                }
            }

            return Ronda.reconstitute(
                    numeroRonda,
                    config,
                    formacionesPorJugador,
                    jugadoresQueBajaron,
                    finalizada,
                    ganadorId
            );
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error deserializando ronda", e);
        }
    }

    private Formacion deserializeFormacion(Map<String, Object> map) {
        String id = (String) map.get("id");
        TipoFormacion tipo = TipoFormacion.valueOf((String) map.get("tipo"));
        String propietarioId = (String) map.get("jugadorPropietarioId");

        @SuppressWarnings("unchecked")
        List<Map<String, String>> cartasMap = (List<Map<String, String>>) map.get("cartas");
        List<Carta> cartas = cartasMap.stream()
                .map(c -> {
                    Valor valor = Valor.valueOf(c.get("valor"));
                    Palo palo = c.get("palo") != null ? Palo.valueOf(c.get("palo")) : null;
                    return Carta.reconstitute(c.get("id"), valor, palo);
                })
                .toList();

        return Formacion.reconstitute(id, tipo, new ArrayList<>(cartas), propietarioId);
    }

    private String serializeHistorial(List<Movimiento> historial) {
        try {
            return objectMapper.writeValueAsString(historial);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error serializando historial", e);
        }
    }

    private List<Movimiento> deserializeHistorial(String json) {
        if (json == null || json.isEmpty()) {
            return new ArrayList<>();
        }
        try {
            return objectMapper.readValue(json, new TypeReference<>() {});
        } catch (JsonProcessingException e) {
            // Si hay error, devolver lista vacía (el historial no es crítico)
            return new ArrayList<>();
        }
    }
}
