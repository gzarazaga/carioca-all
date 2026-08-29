package com.carioca.domain.model.juego;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Mazo")
class MazoTest {

    private Mazo mazo;

    @BeforeEach
    void setUp() {
        mazo = Mazo.crearMazoCompleto();
    }

    @Nested
    @DisplayName("Creación del mazo")
    class CreacionMazo {

        @Test
        @DisplayName("debe crear mazo con 108 cartas (2 mazos + 4 comodines)")
        void debeCrearMazoCon108Cartas() {
            assertEquals(108, mazo.cantidadCartas());
        }

        @Test
        @DisplayName("debe contener 4 comodines")
        void debeContener4Comodines() {
            long comodines = mazo.getCartas().stream()
                    .filter(Carta::esComodin)
                    .count();
            assertEquals(4, comodines);
        }

        @Test
        @DisplayName("debe contener 2 de cada carta normal")
        void debeContener2DeCadaCartaNormal() {
            long asesCorazones = mazo.getCartas().stream()
                    .filter(c -> c.getValor() == Valor.AS && c.getPalo() == Palo.CORAZONES)
                    .count();
            assertEquals(2, asesCorazones);
        }
    }

    @Nested
    @DisplayName("Robar cartas")
    class RobarCartas {

        @Test
        @DisplayName("debe robar una carta del tope")
        void debeRobarUnaCarta() {
            int cantidadInicial = mazo.cantidadCartas();

            Optional<Carta> carta = mazo.robar();

            assertTrue(carta.isPresent());
            assertEquals(cantidadInicial - 1, mazo.cantidadCartas());
        }

        @Test
        @DisplayName("debe robar múltiples cartas")
        void debeRobarMultiplesCartas() {
            List<Carta> cartas = mazo.robar(12);

            assertEquals(12, cartas.size());
            assertEquals(96, mazo.cantidadCartas());
        }

        @Test
        @DisplayName("debe retornar vacío cuando el mazo está vacío")
        void debeRetornarVacioCuandoMazoVacio() {
            // Vaciar el mazo
            mazo.robar(108);

            assertTrue(mazo.estaVacio());
            assertTrue(mazo.robar().isEmpty());
        }

        @Test
        @DisplayName("debe robar solo las cartas disponibles si se piden más")
        void debeRobarSoloCartasDisponibles() {
            mazo.robar(100); // Dejar solo 8 cartas

            List<Carta> cartas = mazo.robar(20);

            assertEquals(8, cartas.size());
            assertTrue(mazo.estaVacio());
        }
    }

    @Nested
    @DisplayName("Barajar")
    class Barajar {

        @Test
        @DisplayName("debe barajar el mazo aleatoriamente")
        void debeBarajarMazo() {
            Mazo mazo1 = Mazo.crearMazoCompleto();
            Mazo mazo2 = Mazo.crearMazoCompleto();

            mazo1.barajar();
            // El mazo2 no se baraja

            // Es muy improbable que queden iguales después de barajar
            boolean alMenosUnaDiferente = false;
            for (int i = 0; i < 10; i++) {
                if (!mazo1.getCartas().get(i).getId().equals(mazo2.getCartas().get(i).getId())) {
                    alMenosUnaDiferente = true;
                    break;
                }
            }
            assertTrue(alMenosUnaDiferente);
        }
    }

    @Nested
    @DisplayName("Robar por valor con palos distintos")
    class RobarPorValorConPalosDistintos {

        @Test
        @DisplayName("debe robar la cantidad pedida con palos distintos entre sí")
        void debeRobarConPalosDistintos() {
            List<Carta> ases = mazo.robarPorValorConPalosDistintos(Valor.AS, 3);

            assertEquals(3, ases.size());
            long palosDistintos = ases.stream().map(Carta::getPalo).distinct().count();
            assertEquals(3, palosDistintos);
            assertTrue(ases.stream().allMatch(c -> c.getValor() == Valor.AS));
        }

        @Test
        @DisplayName("las cartas robadas ya no están en el mazo")
        void lasCartasRobadasSalenDelMazo() {
            int cantidadInicial = mazo.cantidadCartas();

            List<Carta> ases = mazo.robarPorValorConPalosDistintos(Valor.AS, 3);

            assertEquals(cantidadInicial - 3, mazo.cantidadCartas());
            long asesRestantes = mazo.getCartas().stream()
                    .filter(c -> c.getValor() == Valor.AS)
                    .count();
            assertEquals(8 - 3, asesRestantes);
        }

        @Test
        @DisplayName("devuelve como máximo una carta por palo aunque se pidan más que palos existen")
        void noRepitePaloAunquePidaMas() {
            List<Carta> ases = mazo.robarPorValorConPalosDistintos(Valor.AS, 10);

            // Solo hay 4 palos posibles para el AS
            assertEquals(4, ases.size());
        }

        @Test
        @DisplayName("devuelve vacío si ya no quedan ases en el mazo (ambas copias)")
        void devuelveVacioSiNoQuedanAses() {
            mazo.robarPorValorConPalosDistintos(Valor.AS, 4); // 1era copia de cada palo
            mazo.robarPorValorConPalosDistintos(Valor.AS, 4); // 2da copia de cada palo

            List<Carta> ases = mazo.robarPorValorConPalosDistintos(Valor.AS, 3);

            assertTrue(ases.isEmpty());
        }
    }

    @Nested
    @DisplayName("Agregar cartas al fondo")
    class AgregarAlFondo {

        @Test
        @DisplayName("debe agregar cartas al fondo del mazo")
        void debeAgregarCartasAlFondo() {
            Carta carta1 = Carta.of(Valor.AS, Palo.CORAZONES);
            Carta carta2 = Carta.of(Valor.DOS, Palo.PICAS);

            int cantidadInicial = mazo.cantidadCartas();
            mazo.agregarAlFondo(List.of(carta1, carta2));

            assertEquals(cantidadInicial + 2, mazo.cantidadCartas());
            // Las cartas agregadas están al fondo, no afectan el tope
        }
    }
}
