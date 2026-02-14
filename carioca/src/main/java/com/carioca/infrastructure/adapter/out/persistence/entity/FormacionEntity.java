package com.carioca.infrastructure.adapter.out.persistence.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Clase auxiliar para serializar formaciones a JSON.
 * No es una entidad JPA, se usa para serialización.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FormacionEntity {

    private String id;
    private String tipo;
    private String jugadorPropietarioId;
    private List<CartaEntity> cartas;
}
