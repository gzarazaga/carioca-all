package com.carioca.domain.model.juego;

import com.carioca.domain.exception.FormacionInvalidaException;
import lombok.Getter;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Representa una formación de cartas (pierna o escalera) en la mesa.
 * Una vez bajada, otros jugadores pueden pegar cartas adicionales.
 */
@Getter
public class Formacion {

    private final String id;
    private final TipoFormacion tipo;
    private final List<Carta> cartas;
    private final String jugadorPropietarioId;

    private Formacion(String id, TipoFormacion tipo, List<Carta> cartas, String jugadorPropietarioId) {
        this.id = id;
        this.tipo = tipo;
        this.cartas = new ArrayList<>(cartas);
        this.jugadorPropietarioId = jugadorPropietarioId;
    }

    /**
     * Crea una nueva formación validando que sea correcta.
     */
    public static Formacion crear(TipoFormacion tipo, List<Carta> cartas, String jugadorPropietarioId) {
        if (cartas.size() < tipo.getMinimoCartas()) {
            throw new FormacionInvalidaException(
                    String.format("Una %s requiere al menos %d cartas", tipo.getNombre(), tipo.getMinimoCartas())
            );
        }

        Formacion formacion = new Formacion(UUID.randomUUID().toString(), tipo, cartas, jugadorPropietarioId);

        if (!formacion.esValida()) {
            throw new FormacionInvalidaException("La formación no es válida para el tipo " + tipo.getNombre());
        }

        return formacion;
    }

    /**
     * Reconstruye una formación desde persistencia.
     */
    public static Formacion reconstitute(String id, TipoFormacion tipo, List<Carta> cartas, String jugadorPropietarioId) {
        return new Formacion(id, tipo, cartas, jugadorPropietarioId);
    }

    /**
     * Verifica si la formación es válida según su tipo.
     */
    public boolean esValida() {
        return switch (tipo) {
            case PIERNA -> esValidaPierna();
            case ESCALERA -> esValidaEscalera();
        };
    }

    private boolean esValidaPierna() {
        // Todas las cartas deben tener el mismo valor (o ser comodín)
        Valor valorBase = null;
        int comodines = 0;

        for (Carta carta : cartas) {
            if (carta.esComodin()) {
                comodines++;
            } else if (valorBase == null) {
                valorBase = carta.getValor();
            } else if (carta.getValor() != valorBase) {
                return false;
            }
        }

        // No puede ser solo comodines
        return valorBase != null || comodines >= tipo.getMinimoCartas();
    }

    private boolean esValidaEscalera() {
        if (cartas.size() < tipo.getMinimoCartas()) {
            return false;
        }

        // Encontrar el palo base (ignorando comodines)
        Palo paloBase = null;
        for (Carta carta : cartas) {
            if (!carta.esComodin()) {
                paloBase = carta.getPalo();
                break;
            }
        }

        if (paloBase == null) {
            // Solo comodines - válido
            return true;
        }

        // Verificar que las cartas formen una secuencia válida
        List<Valor> valoresEsperados = new ArrayList<>();
        Valor valorActual = null;

        for (Carta carta : cartas) {
            if (!carta.esComodin()) {
                if (carta.getPalo() != paloBase) {
                    return false;
                }
                if (valorActual == null) {
                    valorActual = carta.getValor();
                } else {
                    Valor esperado = valorActual.getSiguiente();
                    if (carta.getValor() != esperado) {
                        return false;
                    }
                    valorActual = carta.getValor();
                }
            } else {
                if (valorActual != null) {
                    valorActual = valorActual.getSiguiente();
                }
            }
        }

        return true;
    }

    /**
     * Intenta pegar una carta al inicio de la formación.
     */
    public boolean puedeAgregarAlInicio(Carta carta) {
        if (tipo == TipoFormacion.PIERNA) {
            return carta.esComodin() || cartasNoComodin().stream()
                    .findFirst()
                    .map(c -> c.getValor() == carta.getValor())
                    .orElse(true);
        } else {
            // Escalera
            Carta primera = cartas.get(0);
            if (primera.esComodin()) {
                return true;
            }
            if (!carta.esComodin() && carta.getPalo() != primera.getPalo()) {
                return false;
            }
            return carta.esComodin() || carta.getValor().getSiguiente() == primera.getValor();
        }
    }

    /**
     * Intenta pegar una carta al final de la formación.
     */
    public boolean puedeAgregarAlFinal(Carta carta) {
        if (tipo == TipoFormacion.PIERNA) {
            return carta.esComodin() || cartasNoComodin().stream()
                    .findFirst()
                    .map(c -> c.getValor() == carta.getValor())
                    .orElse(true);
        } else {
            // Escalera
            Carta ultima = cartas.get(cartas.size() - 1);
            if (ultima.esComodin()) {
                return true;
            }
            if (!carta.esComodin() && carta.getPalo() != ultima.getPalo()) {
                return false;
            }
            return carta.esComodin() || ultima.getValor().getSiguiente() == carta.getValor();
        }
    }

    /**
     * Agrega una carta al inicio de la formación.
     */
    public void agregarAlInicio(Carta carta) {
        if (!puedeAgregarAlInicio(carta)) {
            throw new FormacionInvalidaException("No se puede agregar la carta al inicio de esta formación");
        }
        cartas.add(0, carta);
    }

    /**
     * Agrega una carta al final de la formación.
     */
    public void agregarAlFinal(Carta carta) {
        if (!puedeAgregarAlFinal(carta)) {
            throw new FormacionInvalidaException("No se puede agregar la carta al final de esta formación");
        }
        cartas.add(carta);
    }

    private List<Carta> cartasNoComodin() {
        return cartas.stream()
                .filter(c -> !c.esComodin())
                .toList();
    }

    public int cantidadCartas() {
        return cartas.size();
    }
}
