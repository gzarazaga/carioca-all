package com.carioca.domain.usecase.juego.bajarformacion;

import com.carioca.domain.model.juego.Formacion;

/**
 * Caso de uso para bajar una formación de cartas.
 */
public interface BajarFormacionUseCase {

    /**
     * Baja una formación (pierna o escalera) a la mesa.
     *
     * @param command Datos del comando
     * @return La formación creada
     */
    Formacion ejecutar(BajarFormacionCommand command);
}
