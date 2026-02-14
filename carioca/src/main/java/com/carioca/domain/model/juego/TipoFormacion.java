package com.carioca.domain.model.juego;

/**
 * Tipos de formaciones válidas en el juego Carioca.
 */
public enum TipoFormacion {
    /**
     * Pierna: 3 o más cartas del mismo valor.
     */
    PIERNA("Pierna", 3),

    /**
     * Escalera: 3 o más cartas consecutivas del mismo palo.
     */
    ESCALERA("Escalera", 3);

    private final String nombre;
    private final int minimoCartas;

    TipoFormacion(String nombre, int minimoCartas) {
        this.nombre = nombre;
        this.minimoCartas = minimoCartas;
    }

    public String getNombre() {
        return nombre;
    }

    public int getMinimoCartas() {
        return minimoCartas;
    }
}
