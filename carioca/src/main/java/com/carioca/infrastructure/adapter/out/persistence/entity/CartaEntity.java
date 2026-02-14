package com.carioca.infrastructure.adapter.out.persistence.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Clase auxiliar para serializar cartas a JSON.
 * No es una entidad JPA, se usa para serialización.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartaEntity {

    private String id;
    private String valor;
    private String palo;
}
