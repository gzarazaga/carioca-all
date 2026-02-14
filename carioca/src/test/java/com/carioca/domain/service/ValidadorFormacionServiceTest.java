package com.carioca.domain.service;

import com.carioca.domain.model.juego.*;
import com.carioca.domain.service.impl.ValidadorFormacionServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("ValidadorFormacionService")
class ValidadorFormacionServiceTest {

    private ValidadorFormacionService validador;

    @BeforeEach
    void setUp() {
        validador = new ValidadorFormacionServiceImpl();
    }

    @Nested
    @DisplayName("Validar piernas")
    class ValidarPiernas {

        @Test
        @DisplayName("debe validar pierna con 3 cartas del mismo valor")
        void debeValidarPiernaValida() {
            List<Carta> cartas = List.of(
                    Carta.of(Valor.OCHO, Palo.CORAZONES),
                    Carta.of(Valor.OCHO, Palo.PICAS),
                    Carta.of(Valor.OCHO, Palo.DIAMANTES)
            );

            assertTrue(validador.esPiernaValida(cartas));
        }

        @Test
        @DisplayName("debe validar pierna con comodín")
        void debeValidarPiernaConComodin() {
            List<Carta> cartas = List.of(
                    Carta.of(Valor.K, Palo.CORAZONES),
                    Carta.of(Valor.K, Palo.PICAS),
                    Carta.crearComodin()
            );

            assertTrue(validador.esPiernaValida(cartas));
        }

        @Test
        @DisplayName("debe rechazar pierna con valores diferentes")
        void debeRechazarPiernaConValoresDiferentes() {
            List<Carta> cartas = List.of(
                    Carta.of(Valor.OCHO, Palo.CORAZONES),
                    Carta.of(Valor.NUEVE, Palo.PICAS),
                    Carta.of(Valor.OCHO, Palo.DIAMANTES)
            );

            assertFalse(validador.esPiernaValida(cartas));
        }

        @Test
        @DisplayName("debe rechazar pierna con menos de 3 cartas")
        void debeRechazarPiernaPequeña() {
            List<Carta> cartas = List.of(
                    Carta.of(Valor.OCHO, Palo.CORAZONES),
                    Carta.of(Valor.OCHO, Palo.PICAS)
            );

            assertFalse(validador.esPiernaValida(cartas));
        }

        @Test
        @DisplayName("debe validar pierna grande (4+ cartas)")
        void debeValidarPiernaGrande() {
            List<Carta> cartas = List.of(
                    Carta.of(Valor.SIETE, Palo.CORAZONES),
                    Carta.of(Valor.SIETE, Palo.PICAS),
                    Carta.of(Valor.SIETE, Palo.DIAMANTES),
                    Carta.of(Valor.SIETE, Palo.TREBOLES)
            );

            assertTrue(validador.esPiernaValida(cartas));
        }
    }

    @Nested
    @DisplayName("Validar escaleras")
    class ValidarEscaleras {

        @Test
        @DisplayName("debe validar escalera con 3 cartas consecutivas")
        void debeValidarEscaleraValida() {
            List<Carta> cartas = List.of(
                    Carta.of(Valor.CINCO, Palo.CORAZONES),
                    Carta.of(Valor.SEIS, Palo.CORAZONES),
                    Carta.of(Valor.SIETE, Palo.CORAZONES)
            );

            assertTrue(validador.esEscaleraValida(cartas));
        }

        @Test
        @DisplayName("debe validar escalera con comodín en medio")
        void debeValidarEscaleraConComodinEnMedio() {
            List<Carta> cartas = List.of(
                    Carta.of(Valor.CINCO, Palo.CORAZONES),
                    Carta.crearComodin(),
                    Carta.of(Valor.SIETE, Palo.CORAZONES)
            );

            assertTrue(validador.esEscaleraValida(cartas));
        }

        @Test
        @DisplayName("debe rechazar escalera con palos diferentes")
        void debeRechazarEscaleraConPalosDiferentes() {
            List<Carta> cartas = List.of(
                    Carta.of(Valor.CINCO, Palo.CORAZONES),
                    Carta.of(Valor.SEIS, Palo.PICAS),
                    Carta.of(Valor.SIETE, Palo.CORAZONES)
            );

            assertFalse(validador.esEscaleraValida(cartas));
        }

        @Test
        @DisplayName("debe rechazar escalera no consecutiva")
        void debeRechazarEscaleraNoConsecutiva() {
            List<Carta> cartas = List.of(
                    Carta.of(Valor.CINCO, Palo.CORAZONES),
                    Carta.of(Valor.SEIS, Palo.CORAZONES),
                    Carta.of(Valor.OCHO, Palo.CORAZONES)
            );

            assertFalse(validador.esEscaleraValida(cartas));
        }

        @Test
        @DisplayName("debe rechazar escalera con menos de 3 cartas")
        void debeRechazarEscaleraPequeña() {
            List<Carta> cartas = List.of(
                    Carta.of(Valor.CINCO, Palo.CORAZONES),
                    Carta.of(Valor.SEIS, Palo.CORAZONES)
            );

            assertFalse(validador.esEscaleraValida(cartas));
        }

        @Test
        @DisplayName("debe validar escalera larga")
        void debeValidarEscaleraLarga() {
            List<Carta> cartas = List.of(
                    Carta.of(Valor.TRES, Palo.PICAS),
                    Carta.of(Valor.CUATRO, Palo.PICAS),
                    Carta.of(Valor.CINCO, Palo.PICAS),
                    Carta.of(Valor.SEIS, Palo.PICAS),
                    Carta.of(Valor.SIETE, Palo.PICAS)
            );

            assertTrue(validador.esEscaleraValida(cartas));
        }
    }

    @Nested
    @DisplayName("Validar formación genérica")
    class ValidarFormacionGenerica {

        @Test
        @DisplayName("debe usar validación de pierna para tipo PIERNA")
        void debeUsarValidacionPierna() {
            List<Carta> cartas = List.of(
                    Carta.of(Valor.J, Palo.CORAZONES),
                    Carta.of(Valor.J, Palo.PICAS),
                    Carta.of(Valor.J, Palo.DIAMANTES)
            );

            assertTrue(validador.esFormacionValida(TipoFormacion.PIERNA, cartas));
        }

        @Test
        @DisplayName("debe usar validación de escalera para tipo ESCALERA")
        void debeUsarValidacionEscalera() {
            List<Carta> cartas = List.of(
                    Carta.of(Valor.DIEZ, Palo.TREBOLES),
                    Carta.of(Valor.J, Palo.TREBOLES),
                    Carta.of(Valor.Q, Palo.TREBOLES)
            );

            assertTrue(validador.esFormacionValida(TipoFormacion.ESCALERA, cartas));
        }
    }

    @Nested
    @DisplayName("Validar pegar cartas")
    class ValidarPegarCartas {

        @Test
        @DisplayName("debe permitir pegar carta válida al final de pierna")
        void debePermitirPegarAPierna() {
            List<Carta> cartas = List.of(
                    Carta.of(Valor.Q, Palo.CORAZONES),
                    Carta.of(Valor.Q, Palo.PICAS),
                    Carta.of(Valor.Q, Palo.DIAMANTES)
            );
            Formacion pierna = Formacion.crear(TipoFormacion.PIERNA, cartas, "jugador-1");

            Carta nuevaQ = Carta.of(Valor.Q, Palo.TREBOLES);
            assertTrue(validador.puedePegarAlFinal(pierna, nuevaQ));
        }

        @Test
        @DisplayName("debe permitir pegar carta válida al final de escalera")
        void debePermitirPegarAEscalera() {
            List<Carta> cartas = List.of(
                    Carta.of(Valor.SIETE, Palo.DIAMANTES),
                    Carta.of(Valor.OCHO, Palo.DIAMANTES),
                    Carta.of(Valor.NUEVE, Palo.DIAMANTES)
            );
            Formacion escalera = Formacion.crear(TipoFormacion.ESCALERA, cartas, "jugador-1");

            Carta diez = Carta.of(Valor.DIEZ, Palo.DIAMANTES);
            assertTrue(validador.puedePegarAlFinal(escalera, diez));
        }

        @Test
        @DisplayName("debe rechazar carta inválida para pierna")
        void debeRechazarCartaInvalidaParaPierna() {
            List<Carta> cartas = List.of(
                    Carta.of(Valor.Q, Palo.CORAZONES),
                    Carta.of(Valor.Q, Palo.PICAS),
                    Carta.of(Valor.Q, Palo.DIAMANTES)
            );
            Formacion pierna = Formacion.crear(TipoFormacion.PIERNA, cartas, "jugador-1");

            Carta rey = Carta.of(Valor.K, Palo.TREBOLES);
            assertFalse(validador.puedePegarAlFinal(pierna, rey));
        }
    }
}
