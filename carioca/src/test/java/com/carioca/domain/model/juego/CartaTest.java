package com.carioca.domain.model.juego;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Carta")
class CartaTest {

    @Nested
    @DisplayName("Creación de cartas")
    class CreacionCartas {

        @Test
        @DisplayName("debe crear una carta normal con valor y palo")
        void debeCrearCartaNormal() {
            Carta carta = Carta.of(Valor.AS, Palo.CORAZONES);

            assertNotNull(carta.getId());
            assertEquals(Valor.AS, carta.getValor());
            assertEquals(Palo.CORAZONES, carta.getPalo());
            assertFalse(carta.esComodin());
        }

        @Test
        @DisplayName("debe crear un comodín sin palo")
        void debeCrearComodin() {
            Carta comodin = Carta.crearComodin();

            assertNotNull(comodin.getId());
            assertEquals(Valor.COMODIN, comodin.getValor());
            assertNull(comodin.getPalo());
            assertTrue(comodin.esComodin());
        }

        @Test
        @DisplayName("debe lanzar excepción al crear comodín con of()")
        void debeLanzarExcepcionParaComodinConOf() {
            assertThrows(IllegalArgumentException.class, () ->
                    Carta.of(Valor.COMODIN, Palo.CORAZONES)
            );
        }

        @Test
        @DisplayName("debe reconstruir carta desde persistencia")
        void debeReconstituirCarta() {
            Carta carta = Carta.reconstitute("test-id", Valor.K, Palo.PICAS);

            assertEquals("test-id", carta.getId());
            assertEquals(Valor.K, carta.getValor());
            assertEquals(Palo.PICAS, carta.getPalo());
        }
    }

    @Nested
    @DisplayName("Puntos")
    class Puntos {

        @Test
        @DisplayName("AS debe valer 15 puntos")
        void asDebeValer15Puntos() {
            Carta as = Carta.of(Valor.AS, Palo.CORAZONES);
            assertEquals(15, as.getPuntos());
        }

        @Test
        @DisplayName("cartas 2-7 deben valer 5 puntos")
        void cartasBajasDebenValer5Puntos() {
            assertEquals(5, Carta.of(Valor.DOS, Palo.CORAZONES).getPuntos());
            assertEquals(5, Carta.of(Valor.SIETE, Palo.CORAZONES).getPuntos());
        }

        @Test
        @DisplayName("cartas 8-K deben valer 10 puntos")
        void cartasAltasDebenValer10Puntos() {
            assertEquals(10, Carta.of(Valor.OCHO, Palo.CORAZONES).getPuntos());
            assertEquals(10, Carta.of(Valor.K, Palo.CORAZONES).getPuntos());
        }

        @Test
        @DisplayName("comodín debe valer 25 puntos")
        void comodinDebeValer25Puntos() {
            Carta comodin = Carta.crearComodin();
            assertEquals(25, comodin.getPuntos());
        }
    }

    @Nested
    @DisplayName("Secuencias para escaleras")
    class Secuencias {

        @Test
        @DisplayName("carta puede seguir a otra en escalera del mismo palo")
        void cartaPuedeSeguirEnEscalera() {
            Carta tres = Carta.of(Valor.TRES, Palo.CORAZONES);
            Carta dos = Carta.of(Valor.DOS, Palo.CORAZONES);

            assertTrue(tres.puedeSeguirA(dos));
        }

        @Test
        @DisplayName("carta no puede seguir si es diferente palo")
        void cartaNoPuedeSeguirDiferentePalo() {
            Carta tres = Carta.of(Valor.TRES, Palo.CORAZONES);
            Carta dos = Carta.of(Valor.DOS, Palo.PICAS);

            assertFalse(tres.puedeSeguirA(dos));
        }

        @Test
        @DisplayName("comodín puede seguir a cualquier carta")
        void comodinPuedeSeguirACualquiera() {
            Carta comodin = Carta.crearComodin();
            Carta carta = Carta.of(Valor.CINCO, Palo.DIAMANTES);

            assertTrue(comodin.puedeSeguirA(carta));
        }
    }

    @Nested
    @DisplayName("Mismo valor para piernas")
    class MismoValor {

        @Test
        @DisplayName("cartas con mismo valor son compatibles para pierna")
        void cartasMismoValorSonCompatibles() {
            Carta cinco1 = Carta.of(Valor.CINCO, Palo.CORAZONES);
            Carta cinco2 = Carta.of(Valor.CINCO, Palo.PICAS);

            assertTrue(cinco1.mismoValorQue(cinco2));
        }

        @Test
        @DisplayName("cartas con diferente valor no son compatibles")
        void cartasDiferenteValorNoSonCompatibles() {
            Carta cinco = Carta.of(Valor.CINCO, Palo.CORAZONES);
            Carta seis = Carta.of(Valor.SEIS, Palo.CORAZONES);

            assertFalse(cinco.mismoValorQue(seis));
        }

        @Test
        @DisplayName("comodín es compatible con cualquier valor")
        void comodinEsCompatibleConCualquierValor() {
            Carta comodin = Carta.crearComodin();
            Carta carta = Carta.of(Valor.J, Palo.TREBOLES);

            assertTrue(comodin.mismoValorQue(carta));
            assertTrue(carta.mismoValorQue(comodin));
        }
    }

    @Test
    @DisplayName("debe generar notación correcta")
    void debeGenerarNotacionCorrecta() {
        Carta carta = Carta.of(Valor.AS, Palo.CORAZONES);
        assertEquals("A♥", carta.toNotacion());

        Carta comodin = Carta.crearComodin();
        assertEquals("🃏", comodin.toNotacion());
    }
}
