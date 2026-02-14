package com.carioca.domain.service.impl;

import com.carioca.domain.model.juego.*;
import com.carioca.domain.service.ValidadorFormacionService;

import java.util.ArrayList;
import java.util.List;

/**
 * Implementación del servicio de validación de formaciones.
 */
public class ValidadorFormacionServiceImpl implements ValidadorFormacionService {

    private static final int MINIMO_CARTAS = 3;

    @Override
    public boolean esPiernaValida(List<Carta> cartas) {
        if (cartas.size() < MINIMO_CARTAS) {
            return false;
        }

        Valor valorBase = null;
        for (Carta carta : cartas) {
            if (!carta.esComodin()) {
                if (valorBase == null) {
                    valorBase = carta.getValor();
                } else if (carta.getValor() != valorBase) {
                    return false;
                }
            }
        }

        // Al menos una carta debe no ser comodín
        return valorBase != null;
    }

    @Override
    public boolean esEscaleraValida(List<Carta> cartas) {
        if (cartas.size() < MINIMO_CARTAS) {
            return false;
        }

        // Encontrar el palo base
        Palo paloBase = null;
        for (Carta carta : cartas) {
            if (!carta.esComodin()) {
                paloBase = carta.getPalo();
                break;
            }
        }

        if (paloBase == null) {
            // Solo comodines - consideramos válido
            return true;
        }

        // Verificar secuencia
        List<Carta> cartasOrdenadas = new ArrayList<>(cartas);
        Valor valorActual = null;

        for (Carta carta : cartasOrdenadas) {
            if (!carta.esComodin()) {
                if (carta.getPalo() != paloBase) {
                    return false;
                }
                if (valorActual != null) {
                    Valor esperado = valorActual.getSiguiente();
                    if (carta.getValor() != esperado) {
                        return false;
                    }
                }
                valorActual = carta.getValor();
            } else {
                if (valorActual != null) {
                    valorActual = valorActual.getSiguiente();
                }
            }
        }

        return true;
    }

    @Override
    public boolean esFormacionValida(TipoFormacion tipo, List<Carta> cartas) {
        return switch (tipo) {
            case PIERNA -> esPiernaValida(cartas);
            case ESCALERA -> esEscaleraValida(cartas);
        };
    }

    @Override
    public boolean cumpleRequisitosRonda(List<Formacion> formaciones, RondaConfig config) {
        return config.cumpleRequisitos(formaciones);
    }

    @Override
    public boolean puedePegarAlInicio(Formacion formacion, Carta carta) {
        return formacion.puedeAgregarAlInicio(carta);
    }

    @Override
    public boolean puedePegarAlFinal(Formacion formacion, Carta carta) {
        return formacion.puedeAgregarAlFinal(carta);
    }
}
