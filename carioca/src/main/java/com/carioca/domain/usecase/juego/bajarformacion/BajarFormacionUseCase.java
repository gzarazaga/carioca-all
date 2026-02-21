package com.carioca.domain.usecase.juego.bajarformacion;

import com.carioca.domain.model.juego.Formacion;

import java.util.List;

/**
 * Caso de uso para bajar formaciones de cartas.
 */
public interface BajarFormacionUseCase {

    /**
     * Baja una o más formaciones (piernas o escaleras) a la mesa en una sola jugada.
     *
     * @param command Datos del comando
     * @return Las formaciones creadas
     */
    List<Formacion> ejecutar(BajarFormacionCommand command);
}
