package com.carioca.domain.usecase.juego.robarcarta;

import lombok.Value;

/**
 * Resultado de robar una carta.
 */
@Value
public class CartaRobada {

    String cartaId;
    String valor;
    String palo;
    String notacion;
    boolean delMazo;

    public static CartaRobada of(String cartaId, String valor, String palo, String notacion, boolean delMazo) {
        return new CartaRobada(cartaId, valor, palo, notacion, delMazo);
    }
}
