package com.carioca.domain.service;

import com.carioca.domain.model.juego.Carta;
import com.carioca.domain.model.juego.Formacion;
import com.carioca.domain.model.juego.RondaConfig;
import com.carioca.domain.model.juego.TipoFormacion;

import java.util.List;

/**
 * Servicio de dominio para validar formaciones de cartas.
 */
public interface ValidadorFormacionService {

    /**
     * Valida si un conjunto de cartas forma una pierna válida.
     */
    boolean esPiernaValida(List<Carta> cartas);

    /**
     * Valida si un conjunto de cartas forma una escalera válida.
     */
    boolean esEscaleraValida(List<Carta> cartas);

    /**
     * Valida si una formación es válida.
     */
    boolean esFormacionValida(TipoFormacion tipo, List<Carta> cartas);

    /**
     * Valida si un conjunto de formaciones cumple los requisitos de una ronda.
     */
    boolean cumpleRequisitosRonda(List<Formacion> formaciones, RondaConfig config);

    /**
     * Valida si una carta puede ser pegada al inicio de una formación.
     */
    boolean puedePegarAlInicio(Formacion formacion, Carta carta);

    /**
     * Valida si una carta puede ser pegada al final de una formación.
     */
    boolean puedePegarAlFinal(Formacion formacion, Carta carta);
}
