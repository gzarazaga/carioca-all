package com.carioca.domain.model.partida;

import com.carioca.domain.model.jugador.Jugador;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

import static org.junit.jupiter.api.Assertions.assertEquals;

@DisplayName("Partida - Reparto de cartas")
class PartidaRepartoCartasTest {

    @Test
    @DisplayName("la constante CARTAS_INICIALES debe ser 7")
    void constanteCartasInicialesEsSiete() {
        assertEquals(7, Partida.CARTAS_INICIALES);
    }

    @ParameterizedTest(name = "ronda {0} → {1} cartas por jugador")
    @CsvSource({
            "1, 7",
            "2, 8",
            "3, 9",
            "4, 10",
            "5, 11",
            "6, 12",
            "7, 13"
    })
    @DisplayName("la fórmula CARTAS_INICIALES + (ronda - 1) debe dar el total correcto")
    void formulaCartasPorRonda(int ronda, int cartasEsperadas) {
        int resultado = Partida.CARTAS_INICIALES + (ronda - 1);
        assertEquals(cartasEsperadas, resultado);
    }

    @Test
    @DisplayName("ronda 1: debe repartir 7 cartas a cada jugador al iniciar")
    void ronda1ReparteSieteCartas() {
        Jugador j1 = Jugador.crear("J1");
        Jugador j2 = Jugador.crear("J2");
        Partida partida = Partida.crear(j1);
        partida.agregarJugador(j2);

        partida.iniciar();

        assertEquals(7, j1.cantidadCartasEnMano());
        assertEquals(7, j2.cantidadCartasEnMano());
    }

    @Test
    @DisplayName("ronda 1: debe repartir 7 cartas con 6 jugadores")
    void ronda1ReparteSieteCartasASeisJugadores() {
        Jugador j1 = Jugador.crear("J1");
        Partida partida = Partida.crear(j1);
        for (int i = 2; i <= 6; i++) {
            partida.agregarJugador(Jugador.crear("J" + i));
        }

        partida.iniciar();

        for (Jugador jugador : partida.getJugadores()) {
            assertEquals(7, jugador.cantidadCartasEnMano());
        }
    }

    @Test
    @DisplayName("ronda 1: los jugadores reciben cartas distintas del mismo mazo")
    void ronda1CartasDistintasPorJugador() {
        Jugador j1 = Jugador.crear("J1");
        Jugador j2 = Jugador.crear("J2");
        Partida partida = Partida.crear(j1);
        partida.agregarJugador(j2);

        partida.iniciar();

        // Las IDs de las cartas no deben solaparse entre jugadores
        var idsJ1 = j1.getMano().getCartas().stream()
                .map(c -> c.getId())
                .collect(java.util.stream.Collectors.toSet());
        var idsJ2 = j2.getMano().getCartas().stream()
                .map(c -> c.getId())
                .collect(java.util.stream.Collectors.toSet());

        idsJ1.retainAll(idsJ2);
        assertEquals(0, idsJ1.size(), "Los jugadores no deben compartir cartas");
    }

    @Test
    @DisplayName("ronda 1: se deposita una carta en el descarte al iniciar")
    void ronda1DepositaCartaEnDescarte() {
        Jugador j1 = Jugador.crear("J1");
        Jugador j2 = Jugador.crear("J2");
        Partida partida = Partida.crear(j1);
        partida.agregarJugador(j2);

        partida.iniciar();

        // La pila de descarte tiene exactamente 1 carta
        assertEquals(1, partida.getPilaDescarte().cantidadCartas());
    }

    @Test
    @DisplayName("ronda 1: el total de cartas repartidas más el mazo no supera el total del mazo")
    void ronda1TotalCartasConsistente() {
        Jugador j1 = Jugador.crear("J1");
        Jugador j2 = Jugador.crear("J2");
        Partida partida = Partida.crear(j1);
        partida.agregarJugador(j2);

        partida.iniciar();

        int enManos = partida.getJugadores().stream()
                .mapToInt(Jugador::cantidadCartasEnMano)
                .sum();
        int enMazo = partida.getMazo().cantidadCartas();
        int enDescarte = partida.getPilaDescarte().cantidadCartas();

        // 2 mazos de 52 cartas + 4 comodines = 108 cartas en total
        assertEquals(108, enManos + enMazo + enDescarte);
    }

    // -------------------------------------------------------------------------
    // Reparto en todas las rondas
    // -------------------------------------------------------------------------

    @Nested
    @DisplayName("Reparto en todas las rondas")
    class RepartoPorRonda {

        @ParameterizedTest(name = "ronda {0} → {1} cartas por jugador")
        @CsvSource({
                "1, 7",
                "2, 8",
                "3, 9",
                "4, 10",
                "5, 11",
                "6, 12",
                "7, 13"
        })
        @DisplayName("cada ronda reparte el número correcto de cartas a cada jugador")
        void cadaRondaReparteNCartas(int ronda, int cartasEsperadas) {
            Jugador j1 = Jugador.crear("J1");
            Jugador j2 = Jugador.crear("J2");
            Partida partida = Partida.crear(j1);
            partida.agregarJugador(j2);

            partida.iniciarRonda(ronda);

            assertEquals(cartasEsperadas, j1.cantidadCartasEnMano());
            assertEquals(cartasEsperadas, j2.cantidadCartasEnMano());
        }

        @ParameterizedTest(name = "ronda {0} con 6 jugadores → {1} cartas por jugador")
        @CsvSource({
                "1, 7",
                "2, 8",
                "3, 9",
                "4, 10",
                "5, 11",
                "6, 12",
                "7, 13"
        })
        @DisplayName("el reparto es correcto para el máximo de 6 jugadores en cada ronda")
        void cadaRondaReparteNCartasConSeisJugadores(int ronda, int cartasEsperadas) {
            Jugador j1 = Jugador.crear("J1");
            Partida partida = Partida.crear(j1);
            for (int i = 2; i <= 6; i++) {
                partida.agregarJugador(Jugador.crear("J" + i));
            }

            partida.iniciarRonda(ronda);

            for (Jugador jugador : partida.getJugadores()) {
                assertEquals(cartasEsperadas, jugador.cantidadCartasEnMano());
            }
        }

        @ParameterizedTest(name = "ronda {0}: 1 carta en el descarte al iniciar")
        @CsvSource({"1", "2", "3", "4", "5", "6", "7"})
        @DisplayName("se deposita exactamente 1 carta en el descarte al iniciar cada ronda")
        void descarteTieneUnaCartaAlIniciarCadaRonda(int ronda) {
            Jugador j1 = Jugador.crear("J1");
            Jugador j2 = Jugador.crear("J2");
            Partida partida = Partida.crear(j1);
            partida.agregarJugador(j2);

            partida.iniciarRonda(ronda);

            assertEquals(1, partida.getPilaDescarte().cantidadCartas());
        }

        @ParameterizedTest(name = "ronda {0}: 108 cartas en total")
        @CsvSource({"1", "2", "3", "4", "5", "6", "7"})
        @DisplayName("el total de 108 cartas se conserva al iniciar cualquier ronda")
        void totalCartasConservadoEnCadaRonda(int ronda) {
            Jugador j1 = Jugador.crear("J1");
            Jugador j2 = Jugador.crear("J2");
            Partida partida = Partida.crear(j1);
            partida.agregarJugador(j2);

            partida.iniciarRonda(ronda);

            int enManos = partida.getJugadores().stream()
                    .mapToInt(Jugador::cantidadCartasEnMano)
                    .sum();
            int enMazo = partida.getMazo().cantidadCartas();
            int enDescarte = partida.getPilaDescarte().cantidadCartas();

            assertEquals(108, enManos + enMazo + enDescarte);
        }
    }
}
