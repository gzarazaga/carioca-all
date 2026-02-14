package com.carioca.domain.model.juego;

/**
 * Representa los valores posibles de una carta, incluyendo el comodín.
 */
public enum Valor {
    AS(1, "A", 15),
    DOS(2, "2", 5),
    TRES(3, "3", 5),
    CUATRO(4, "4", 5),
    CINCO(5, "5", 5),
    SEIS(6, "6", 5),
    SIETE(7, "7", 5),
    OCHO(8, "8", 10),
    NUEVE(9, "9", 10),
    DIEZ(10, "10", 10),
    J(11, "J", 10),
    Q(12, "Q", 10),
    K(13, "K", 10),
    COMODIN(0, "🃏", 25);

    private final int orden;
    private final String simbolo;
    private final int puntos;

    Valor(int orden, String simbolo, int puntos) {
        this.orden = orden;
        this.simbolo = simbolo;
        this.puntos = puntos;
    }

    public int getOrden() {
        return orden;
    }

    public String getSimbolo() {
        return simbolo;
    }

    public int getPuntos() {
        return puntos;
    }

    public boolean esComodin() {
        return this == COMODIN;
    }

    /**
     * Obtiene el valor siguiente en la secuencia (para escaleras).
     * El AS puede ir antes del 2 o después del K.
     */
    public Valor getSiguiente() {
        if (this == COMODIN) {
            return null;
        }
        if (this == K) {
            return AS;
        }
        Valor[] valores = Valor.values();
        return valores[this.ordinal() + 1];
    }

    /**
     * Obtiene el valor anterior en la secuencia (para escaleras).
     */
    public Valor getAnterior() {
        if (this == COMODIN) {
            return null;
        }
        if (this == AS) {
            return K;
        }
        Valor[] valores = Valor.values();
        return valores[this.ordinal() - 1];
    }
}
