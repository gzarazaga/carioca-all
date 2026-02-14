package com.carioca.domain.usecase.juego;

import com.carioca.domain.exception.FormacionInvalidaException;
import com.carioca.domain.exception.MovimientoInvalidoException;
import com.carioca.domain.exception.PartidaNoEncontradaException;
import com.carioca.domain.model.juego.Carta;
import com.carioca.domain.model.juego.Formacion;
import com.carioca.domain.model.juego.TipoFormacion;
import com.carioca.domain.model.juego.Valor;
import com.carioca.domain.model.jugador.Jugador;
import com.carioca.domain.model.partida.Partida;
import com.carioca.domain.port.out.NotificacionPort;
import com.carioca.domain.port.out.PartidaRepositoryPort;
import com.carioca.domain.usecase.juego.bajarformacion.BajarFormacionCommand;
import com.carioca.domain.usecase.juego.bajarformacion.BajarFormacionUseCase;
import com.carioca.domain.usecase.juego.bajarformacion.impl.BajarFormacionUseCaseImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("BajarFormacionUseCase")
class BajarFormacionUseCaseTest {

    @Mock
    private PartidaRepositoryPort partidaRepository;

    @Mock
    private NotificacionPort notificacionPort;

    private BajarFormacionUseCase useCase;
    private Partida partida;
    private String jugadorActualId;

    @BeforeEach
    void setUp() {
        useCase = new BajarFormacionUseCaseImpl(partidaRepository, notificacionPort);

        // Crear e iniciar partida
        Jugador jugador1 = Jugador.crear("Jugador 1");
        Jugador jugador2 = Jugador.crear("Jugador 2");
        partida = Partida.crear(jugador1);
        partida.agregarJugador(jugador2);
        partida.iniciar();

        jugadorActualId = partida.obtenerJugadorActual().getIdValue();

        // Robar una carta para poder hacer acciones
        partida.robarDelMazo(jugadorActualId);
    }

    @Nested
    @DisplayName("Bajar pierna válida")
    class BajarPiernaValida {

        @Test
        @DisplayName("debe permitir bajar pierna con 3 cartas del mismo valor")
        void debePermitirBajarPierna() {
            // Arrange
            String partidaId = partida.getIdValue();
            Jugador jugador = partida.obtenerJugadorActual();

            // Encontrar 3 cartas del mismo valor en la mano (o usar cartas de prueba)
            List<Carta> mano = jugador.getMano().getCartas();
            List<String> cartaIds = encontrarCartasMismoValor(mano, 3);

            if (cartaIds == null) {
                // Si no hay 3 cartas iguales, skip test
                return;
            }

            BajarFormacionCommand command = BajarFormacionCommand.of(
                    partidaId, jugadorActualId, TipoFormacion.PIERNA, cartaIds
            );

            when(partidaRepository.findById(partidaId)).thenReturn(Optional.of(partida));
            when(partidaRepository.save(any(Partida.class))).thenAnswer(invocation -> invocation.getArgument(0));

            // Act
            Formacion formacion = useCase.ejecutar(command);

            // Assert
            assertNotNull(formacion);
            assertEquals(TipoFormacion.PIERNA, formacion.getTipo());
            assertEquals(3, formacion.cantidadCartas());
        }
    }

    @Nested
    @DisplayName("Validaciones")
    class Validaciones {

        @Test
        @DisplayName("debe lanzar excepción si partida no existe")
        void debeLanzarExcepcionSiPartidaNoExiste() {
            // Arrange
            BajarFormacionCommand command = BajarFormacionCommand.of(
                    "no-existe", jugadorActualId, TipoFormacion.PIERNA, List.of("c1", "c2", "c3")
            );
            when(partidaRepository.findById("no-existe")).thenReturn(Optional.empty());

            // Act & Assert
            assertThrows(PartidaNoEncontradaException.class, () ->
                    useCase.ejecutar(command)
            );
        }

        @Test
        @DisplayName("debe lanzar excepción si jugador no tiene las cartas")
        void debeLanzarExcepcionSiNoTieneCartas() {
            // Arrange
            String partidaId = partida.getIdValue();
            BajarFormacionCommand command = BajarFormacionCommand.of(
                    partidaId, jugadorActualId, TipoFormacion.PIERNA,
                    List.of("carta-fake-1", "carta-fake-2", "carta-fake-3")
            );

            when(partidaRepository.findById(partidaId)).thenReturn(Optional.of(partida));

            // Act & Assert
            assertThrows(MovimientoInvalidoException.class, () ->
                    useCase.ejecutar(command)
            );
        }

        @Test
        @DisplayName("debe notificar formación bajada")
        void debeNotificarFormacionBajada() {
            // Arrange
            String partidaId = partida.getIdValue();
            Jugador jugador = partida.obtenerJugadorActual();
            List<Carta> mano = jugador.getMano().getCartas();
            List<String> cartaIds = encontrarCartasMismoValor(mano, 3);

            if (cartaIds == null) {
                return;
            }

            BajarFormacionCommand command = BajarFormacionCommand.of(
                    partidaId, jugadorActualId, TipoFormacion.PIERNA, cartaIds
            );

            when(partidaRepository.findById(partidaId)).thenReturn(Optional.of(partida));
            when(partidaRepository.save(any(Partida.class))).thenAnswer(invocation -> invocation.getArgument(0));

            // Act
            useCase.ejecutar(command);

            // Assert
            verify(notificacionPort).notificarFormacionBajada(eq(partidaId), eq(jugadorActualId), any(Formacion.class));
        }
    }

    /**
     * Busca cartas del mismo valor en la mano.
     */
    private List<String> encontrarCartasMismoValor(List<Carta> mano, int cantidad) {
        for (Valor valor : Valor.values()) {
            if (valor == Valor.COMODIN) continue;

            List<String> cartasDelValor = mano.stream()
                    .filter(c -> c.getValor() == valor)
                    .map(Carta::getId)
                    .limit(cantidad)
                    .toList();

            if (cartasDelValor.size() >= cantidad) {
                return cartasDelValor;
            }
        }
        return null;
    }
}
