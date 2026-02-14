package com.carioca.domain.model.juego;

import com.carioca.domain.exception.FormacionInvalidaException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Formacion")
class FormacionTest {

    private static final String JUGADOR_ID = "jugador-1";

    @Nested
    @DisplayName("Piernas")
    class Piernas {

        @Test
        @DisplayName("debe crear pierna válida con 3 cartas del mismo valor")
        void debeCrearPiernaValida() {
            List<Carta> cartas = List.of(
                    Carta.of(Valor.CINCO, Palo.CORAZONES),
                    Carta.of(Valor.CINCO, Palo.PICAS),
                    Carta.of(Valor.CINCO, Palo.DIAMANTES)
            );

            Formacion pierna = Formacion.crear(TipoFormacion.PIERNA, cartas, JUGADOR_ID);

            assertNotNull(pierna.getId());
            assertEquals(TipoFormacion.PIERNA, pierna.getTipo());
            assertEquals(3, pierna.cantidadCartas());
            assertTrue(pierna.esValida());
        }

        @Test
        @DisplayName("debe crear pierna válida con comodín")
        void debeCrearPiernaConComodin() {
            List<Carta> cartas = List.of(
                    Carta.of(Valor.J, Palo.CORAZONES),
                    Carta.of(Valor.J, Palo.PICAS),
                    Carta.crearComodin()
            );

            Formacion pierna = Formacion.crear(TipoFormacion.PIERNA, cartas, JUGADOR_ID);

            assertTrue(pierna.esValida());
        }

        @Test
        @DisplayName("debe rechazar pierna con valores diferentes")
        void debeRechazarPiernaConValoresDiferentes() {
            List<Carta> cartas = List.of(
                    Carta.of(Valor.CINCO, Palo.CORAZONES),
                    Carta.of(Valor.SEIS, Palo.PICAS),
                    Carta.of(Valor.CINCO, Palo.DIAMANTES)
            );

            assertThrows(FormacionInvalidaException.class, () ->
                    Formacion.crear(TipoFormacion.PIERNA, cartas, JUGADOR_ID)
            );
        }

        @Test
        @DisplayName("debe rechazar pierna con menos de 3 cartas")
        void debeRechazarPiernaConMenosDe3Cartas() {
            List<Carta> cartas = List.of(
                    Carta.of(Valor.CINCO, Palo.CORAZONES),
                    Carta.of(Valor.CINCO, Palo.PICAS)
            );

            assertThrows(FormacionInvalidaException.class, () ->
                    Formacion.crear(TipoFormacion.PIERNA, cartas, JUGADOR_ID)
            );
        }
    }

    @Nested
    @DisplayName("Escaleras")
    class Escaleras {

        @Test
        @DisplayName("debe crear escalera válida con 3 cartas consecutivas")
        void debeCrearEscaleraValida() {
            List<Carta> cartas = List.of(
                    Carta.of(Valor.TRES, Palo.CORAZONES),
                    Carta.of(Valor.CUATRO, Palo.CORAZONES),
                    Carta.of(Valor.CINCO, Palo.CORAZONES)
            );

            Formacion escalera = Formacion.crear(TipoFormacion.ESCALERA, cartas, JUGADOR_ID);

            assertNotNull(escalera.getId());
            assertEquals(TipoFormacion.ESCALERA, escalera.getTipo());
            assertTrue(escalera.esValida());
        }

        @Test
        @DisplayName("debe crear escalera válida con comodín")
        void debeCrearEscaleraConComodin() {
            List<Carta> cartas = List.of(
                    Carta.of(Valor.TRES, Palo.CORAZONES),
                    Carta.crearComodin(),
                    Carta.of(Valor.CINCO, Palo.CORAZONES)
            );

            Formacion escalera = Formacion.crear(TipoFormacion.ESCALERA, cartas, JUGADOR_ID);

            assertTrue(escalera.esValida());
        }

        @Test
        @DisplayName("debe rechazar escalera con palos diferentes")
        void debeRechazarEscaleraConPalosDiferentes() {
            List<Carta> cartas = List.of(
                    Carta.of(Valor.TRES, Palo.CORAZONES),
                    Carta.of(Valor.CUATRO, Palo.PICAS),
                    Carta.of(Valor.CINCO, Palo.CORAZONES)
            );

            assertThrows(FormacionInvalidaException.class, () ->
                    Formacion.crear(TipoFormacion.ESCALERA, cartas, JUGADOR_ID)
            );
        }

        @Test
        @DisplayName("debe rechazar escalera no consecutiva")
        void debeRechazarEscaleraNoConsecutiva() {
            List<Carta> cartas = List.of(
                    Carta.of(Valor.TRES, Palo.CORAZONES),
                    Carta.of(Valor.CUATRO, Palo.CORAZONES),
                    Carta.of(Valor.SEIS, Palo.CORAZONES)
            );

            assertThrows(FormacionInvalidaException.class, () ->
                    Formacion.crear(TipoFormacion.ESCALERA, cartas, JUGADOR_ID)
            );
        }
    }

    @Nested
    @DisplayName("Pegar cartas")
    class PegarCartas {

        @Test
        @DisplayName("debe permitir pegar carta válida a pierna")
        void debePermitirPegarCartaAPierna() {
            List<Carta> cartas = List.of(
                    Carta.of(Valor.SIETE, Palo.CORAZONES),
                    Carta.of(Valor.SIETE, Palo.PICAS),
                    Carta.of(Valor.SIETE, Palo.DIAMANTES)
            );
            Formacion pierna = Formacion.crear(TipoFormacion.PIERNA, cartas, JUGADOR_ID);

            Carta nuevaCarta = Carta.of(Valor.SIETE, Palo.TREBOLES);
            assertTrue(pierna.puedeAgregarAlFinal(nuevaCarta));

            pierna.agregarAlFinal(nuevaCarta);
            assertEquals(4, pierna.cantidadCartas());
        }

        @Test
        @DisplayName("debe permitir pegar carta válida al final de escalera")
        void debePermitirPegarCartaAlFinalDeEscalera() {
            List<Carta> cartas = List.of(
                    Carta.of(Valor.TRES, Palo.CORAZONES),
                    Carta.of(Valor.CUATRO, Palo.CORAZONES),
                    Carta.of(Valor.CINCO, Palo.CORAZONES)
            );
            Formacion escalera = Formacion.crear(TipoFormacion.ESCALERA, cartas, JUGADOR_ID);

            Carta seis = Carta.of(Valor.SEIS, Palo.CORAZONES);
            assertTrue(escalera.puedeAgregarAlFinal(seis));

            escalera.agregarAlFinal(seis);
            assertEquals(4, escalera.cantidadCartas());
        }

        @Test
        @DisplayName("debe rechazar carta inválida para pierna")
        void debeRechazarCartaInvalidaParaPierna() {
            List<Carta> cartas = List.of(
                    Carta.of(Valor.SIETE, Palo.CORAZONES),
                    Carta.of(Valor.SIETE, Palo.PICAS),
                    Carta.of(Valor.SIETE, Palo.DIAMANTES)
            );
            Formacion pierna = Formacion.crear(TipoFormacion.PIERNA, cartas, JUGADOR_ID);

            Carta ocho = Carta.of(Valor.OCHO, Palo.TREBOLES);
            assertFalse(pierna.puedeAgregarAlFinal(ocho));
        }

        @Test
        @DisplayName("debe permitir pegar comodín a cualquier formación")
        void debePermitirPegarComodin() {
            List<Carta> cartas = List.of(
                    Carta.of(Valor.Q, Palo.DIAMANTES),
                    Carta.of(Valor.Q, Palo.PICAS),
                    Carta.of(Valor.Q, Palo.CORAZONES)
            );
            Formacion pierna = Formacion.crear(TipoFormacion.PIERNA, cartas, JUGADOR_ID);

            Carta comodin = Carta.crearComodin();
            assertTrue(pierna.puedeAgregarAlFinal(comodin));
        }
    }
}
