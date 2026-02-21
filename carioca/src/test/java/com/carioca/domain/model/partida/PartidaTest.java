package com.carioca.domain.model.partida;

import com.carioca.domain.exception.MovimientoInvalidoException;
import com.carioca.domain.exception.PartidaCompletaException;
import com.carioca.domain.exception.TurnoInvalidoException;
import com.carioca.domain.model.juego.Carta;
import com.carioca.domain.model.jugador.Jugador;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Partida")
class PartidaTest {

    private Jugador creador;
    private Partida partida;

    @BeforeEach
    void setUp() {
        creador = Jugador.crear("Jugador 1");
        partida = Partida.crear(creador);
    }

    @Nested
    @DisplayName("Creación de partida")
    class CreacionPartida {

        @Test
        @DisplayName("debe crear partida con estado ESPERANDO_JUGADORES")
        void debeCrearPartidaConEstadoEsperandoJugadores() {
            assertEquals(EstadoPartida.ESPERANDO_JUGADORES, partida.getEstado());
        }

        @Test
        @DisplayName("debe incluir al creador como primer jugador")
        void debeIncluirCreadorComoPrimerJugador() {
            assertEquals(1, partida.getJugadores().size());
            assertEquals(creador.getIdValue(), partida.getJugadores().get(0).getIdValue());
        }

        @Test
        @DisplayName("debe generar ID único")
        void debeGenerarIdUnico() {
            assertNotNull(partida.getId());
            assertFalse(partida.getIdValue().isEmpty());
        }

        @Test
        @DisplayName("debe tener fecha de creación")
        void debeTenerFechaCreacion() {
            assertNotNull(partida.getFechaCreacion());
        }
    }

    @Nested
    @DisplayName("Agregar jugadores")
    class AgregarJugadores {

        @Test
        @DisplayName("debe agregar jugador a partida")
        void debeAgregarJugador() {
            Jugador jugador2 = Jugador.crear("Jugador 2");

            partida.agregarJugador(jugador2);

            assertEquals(2, partida.getJugadores().size());
        }

        @Test
        @DisplayName("debe permitir hasta 6 jugadores")
        void debePermitirHasta6Jugadores() {
            for (int i = 2; i <= 6; i++) {
                partida.agregarJugador(Jugador.crear("Jugador " + i));
            }

            assertEquals(6, partida.getJugadores().size());
        }

        @Test
        @DisplayName("debe rechazar más de 6 jugadores")
        void debeRechazarMasDe6Jugadores() {
            for (int i = 2; i <= 6; i++) {
                partida.agregarJugador(Jugador.crear("Jugador " + i));
            }

            assertThrows(PartidaCompletaException.class, () ->
                    partida.agregarJugador(Jugador.crear("Jugador 7"))
            );
        }

        @Test
        @DisplayName("debe rechazar jugador duplicado")
        void debeRechazarJugadorDuplicado() {
            assertThrows(MovimientoInvalidoException.class, () ->
                    partida.agregarJugador(creador)
            );
        }

        @Test
        @DisplayName("no debe permitir agregar jugadores a partida en curso")
        void noDebePermitirAgregarJugadoresAPartidaEnCurso() {
            partida.agregarJugador(Jugador.crear("Jugador 2"));
            partida.iniciar();

            assertThrows(MovimientoInvalidoException.class, () ->
                    partida.agregarJugador(Jugador.crear("Jugador 3"))
            );
        }
    }

    @Nested
    @DisplayName("Iniciar partida")
    class IniciarPartida {

        @Test
        @DisplayName("debe iniciar partida con 2+ jugadores")
        void debeIniciarPartidaCon2Jugadores() {
            partida.agregarJugador(Jugador.crear("Jugador 2"));

            partida.iniciar();

            assertEquals(EstadoPartida.EN_CURSO, partida.getEstado());
            assertNotNull(partida.getFechaInicio());
        }

        @Test
        @DisplayName("debe repartir 7 cartas a cada jugador")
        void debeRepartir7CartasACadaJugador() {
            partida.agregarJugador(Jugador.crear("Jugador 2"));
            partida.iniciar();

            for (Jugador jugador : partida.getJugadores()) {
                assertEquals(7, jugador.cantidadCartasEnMano());
            }
        }

        @Test
        @DisplayName("debe iniciar en ronda 1")
        void debeIniciarEnRonda1() {
            partida.agregarJugador(Jugador.crear("Jugador 2"));
            partida.iniciar();

            assertEquals(1, partida.getNumeroRondaActual());
        }

        @Test
        @DisplayName("debe establecer estado de turno ESPERANDO_ROBAR")
        void debeEstablecerEstadoTurnoEsperandoRobar() {
            partida.agregarJugador(Jugador.crear("Jugador 2"));
            partida.iniciar();

            assertEquals(EstadoTurno.ESPERANDO_ROBAR, partida.getEstadoTurno());
        }

        @Test
        @DisplayName("no debe iniciar con menos de 2 jugadores")
        void noDebeIniciarConMenosDe2Jugadores() {
            assertThrows(MovimientoInvalidoException.class, () ->
                    partida.iniciar()
            );
        }

        @Test
        @DisplayName("no debe iniciar partida ya iniciada")
        void noDebeIniciarPartidaYaIniciada() {
            partida.agregarJugador(Jugador.crear("Jugador 2"));
            partida.iniciar();

            assertThrows(MovimientoInvalidoException.class, () ->
                    partida.iniciar()
            );
        }
    }

    @Nested
    @DisplayName("Robar carta")
    class RobarCarta {

        @BeforeEach
        void iniciarPartida() {
            partida.agregarJugador(Jugador.crear("Jugador 2"));
            partida.iniciar();
        }

        @Test
        @DisplayName("debe permitir robar del mazo al jugador actual")
        void debePermitirRobarDelMazo() {
            String jugadorActualId = partida.obtenerJugadorActual().getIdValue();

            Carta carta = partida.robarDelMazo(jugadorActualId);

            assertNotNull(carta);
            assertEquals(8, partida.obtenerJugadorActual().cantidadCartasEnMano());
            assertEquals(EstadoTurno.ESPERANDO_DESCARTAR, partida.getEstadoTurno());
        }

        @Test
        @DisplayName("debe permitir robar del descarte")
        void debePermitirRobarDelDescarte() {
            String jugadorActualId = partida.obtenerJugadorActual().getIdValue();

            Carta carta = partida.robarDelDescarte(jugadorActualId);

            assertNotNull(carta);
            assertEquals(EstadoTurno.ESPERANDO_DESCARTAR, partida.getEstadoTurno());
        }

        @Test
        @DisplayName("no debe permitir robar a jugador que no tiene el turno")
        void noDebePermitirRobarAJugadorSinTurno() {
            // El segundo jugador no tiene el turno
            String otroJugadorId = partida.getJugadores().get(1).getIdValue();

            assertThrows(TurnoInvalidoException.class, () ->
                    partida.robarDelMazo(otroJugadorId)
            );
        }

        @Test
        @DisplayName("no debe permitir robar dos veces")
        void noDebePermitirRobarDosVeces() {
            String jugadorActualId = partida.obtenerJugadorActual().getIdValue();
            partida.robarDelMazo(jugadorActualId);

            assertThrows(TurnoInvalidoException.class, () ->
                    partida.robarDelMazo(jugadorActualId)
            );
        }
    }

    @Nested
    @DisplayName("Descartar carta")
    class DescartarCarta {

        @BeforeEach
        void iniciarPartidaYRobar() {
            partida.agregarJugador(Jugador.crear("Jugador 2"));
            partida.iniciar();
            partida.robarDelMazo(partida.obtenerJugadorActual().getIdValue());
        }

        @Test
        @DisplayName("debe permitir descartar carta después de robar")
        void debePermitirDescartarDespuesDeRobar() {
            Jugador jugadorActual = partida.obtenerJugadorActual();
            String cartaId = jugadorActual.getMano().getCartas().get(0).getId();

            partida.descartarCarta(jugadorActual.getIdValue(), cartaId);

            assertEquals(7, jugadorActual.cantidadCartasEnMano());
        }

        @Test
        @DisplayName("debe pasar el turno al siguiente jugador")
        void debePasarTurnoAlSiguienteJugador() {
            Jugador jugadorActual = partida.obtenerJugadorActual();
            String primerJugadorId = jugadorActual.getIdValue();
            String cartaId = jugadorActual.getMano().getCartas().get(0).getId();

            partida.descartarCarta(primerJugadorId, cartaId);

            assertNotEquals(primerJugadorId, partida.obtenerJugadorActual().getIdValue());
            assertEquals(EstadoTurno.ESPERANDO_ROBAR, partida.getEstadoTurno());
        }

        @Test
        @DisplayName("no debe permitir descartar sin haber robado")
        void noDebePermitirDescartarSinRobar() {
            // Crear nueva partida sin robar
            Partida nuevaPartida = Partida.crear(Jugador.crear("J1"));
            nuevaPartida.agregarJugador(Jugador.crear("J2"));
            nuevaPartida.iniciar();

            Jugador jugador = nuevaPartida.obtenerJugadorActual();
            String cartaId = jugador.getMano().getCartas().get(0).getId();

            assertThrows(TurnoInvalidoException.class, () ->
                    nuevaPartida.descartarCarta(jugador.getIdValue(), cartaId)
            );
        }

        @Test
        @DisplayName("no debe permitir descartar carta que no se tiene")
        void noDebePermitirDescartarCartaQueNoSeTiene() {
            Jugador jugadorActual = partida.obtenerJugadorActual();

            assertThrows(MovimientoInvalidoException.class, () ->
                    partida.descartarCarta(jugadorActual.getIdValue(), "carta-inexistente")
            );
        }
    }

    @Nested
    @DisplayName("Estado de la partida")
    class EstadoDePartida {

        @Test
        @DisplayName("puedeIniciar debe retornar true con 2+ jugadores")
        void puedeIniciarConSuficientesJugadores() {
            assertFalse(partida.puedeIniciar());

            partida.agregarJugador(Jugador.crear("Jugador 2"));

            assertTrue(partida.puedeIniciar());
        }

        @Test
        @DisplayName("estaEnCurso debe retornar true después de iniciar")
        void estaEnCursoDespuesDeIniciar() {
            assertFalse(partida.estaEnCurso());

            partida.agregarJugador(Jugador.crear("Jugador 2"));
            partida.iniciar();

            assertTrue(partida.estaEnCurso());
        }
    }
}
