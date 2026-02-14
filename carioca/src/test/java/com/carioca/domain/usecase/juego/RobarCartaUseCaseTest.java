package com.carioca.domain.usecase.juego;

import com.carioca.domain.exception.PartidaNoEncontradaException;
import com.carioca.domain.exception.TurnoInvalidoException;
import com.carioca.domain.model.jugador.Jugador;
import com.carioca.domain.model.partida.EstadoTurno;
import com.carioca.domain.model.partida.Partida;
import com.carioca.domain.port.out.NotificacionPort;
import com.carioca.domain.port.out.PartidaRepositoryPort;
import com.carioca.domain.usecase.juego.robarcarta.CartaRobada;
import com.carioca.domain.usecase.juego.robarcarta.RobarCartaCommand;
import com.carioca.domain.usecase.juego.robarcarta.RobarCartaUseCase;
import com.carioca.domain.usecase.juego.robarcarta.impl.RobarCartaUseCaseImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("RobarCartaUseCase")
class RobarCartaUseCaseTest {

    @Mock
    private PartidaRepositoryPort partidaRepository;

    @Mock
    private NotificacionPort notificacionPort;

    private RobarCartaUseCase useCase;
    private Partida partida;
    private String jugadorActualId;

    @BeforeEach
    void setUp() {
        useCase = new RobarCartaUseCaseImpl(partidaRepository, notificacionPort);

        // Crear e iniciar partida
        Jugador jugador1 = Jugador.crear("Jugador 1");
        Jugador jugador2 = Jugador.crear("Jugador 2");
        partida = Partida.crear(jugador1);
        partida.agregarJugador(jugador2);
        partida.iniciar();

        jugadorActualId = partida.obtenerJugadorActual().getIdValue();
    }

    @Nested
    @DisplayName("Robar del mazo")
    class RobarDelMazo {

        @Test
        @DisplayName("debe permitir robar del mazo al jugador actual")
        void debePermitirRobarDelMazo() {
            // Arrange
            String partidaId = partida.getIdValue();
            RobarCartaCommand command = RobarCartaCommand.delMazo(partidaId, jugadorActualId);

            when(partidaRepository.findById(partidaId)).thenReturn(Optional.of(partida));
            when(partidaRepository.save(any(Partida.class))).thenAnswer(invocation -> invocation.getArgument(0));

            // Act
            CartaRobada resultado = useCase.ejecutar(command);

            // Assert
            assertNotNull(resultado);
            assertNotNull(resultado.getCartaId());
            assertTrue(resultado.isDelMazo());
            assertNotNull(resultado.getValor());
        }

        @Test
        @DisplayName("debe agregar carta a la mano del jugador")
        void debeAgregarCartaAManoDelJugador() {
            // Arrange
            String partidaId = partida.getIdValue();
            RobarCartaCommand command = RobarCartaCommand.delMazo(partidaId, jugadorActualId);
            int cartasAntes = partida.obtenerJugadorActual().cantidadCartasEnMano();

            when(partidaRepository.findById(partidaId)).thenReturn(Optional.of(partida));
            when(partidaRepository.save(any(Partida.class))).thenAnswer(invocation -> invocation.getArgument(0));

            // Act
            useCase.ejecutar(command);

            // Assert
            ArgumentCaptor<Partida> partidaCaptor = ArgumentCaptor.forClass(Partida.class);
            verify(partidaRepository).save(partidaCaptor.capture());

            Partida partidaGuardada = partidaCaptor.getValue();
            assertEquals(cartasAntes + 1, partidaGuardada.obtenerJugadorActual().cantidadCartasEnMano());
        }

        @Test
        @DisplayName("debe cambiar estado de turno a ESPERANDO_DESCARTAR")
        void debeCambiarEstadoTurno() {
            // Arrange
            String partidaId = partida.getIdValue();
            RobarCartaCommand command = RobarCartaCommand.delMazo(partidaId, jugadorActualId);

            when(partidaRepository.findById(partidaId)).thenReturn(Optional.of(partida));
            when(partidaRepository.save(any(Partida.class))).thenAnswer(invocation -> invocation.getArgument(0));

            // Act
            useCase.ejecutar(command);

            // Assert
            ArgumentCaptor<Partida> partidaCaptor = ArgumentCaptor.forClass(Partida.class);
            verify(partidaRepository).save(partidaCaptor.capture());

            assertEquals(EstadoTurno.ESPERANDO_DESCARTAR, partidaCaptor.getValue().getEstadoTurno());
        }

        @Test
        @DisplayName("debe notificar carta robada")
        void debeNotificarCartaRobada() {
            // Arrange
            String partidaId = partida.getIdValue();
            RobarCartaCommand command = RobarCartaCommand.delMazo(partidaId, jugadorActualId);

            when(partidaRepository.findById(partidaId)).thenReturn(Optional.of(partida));
            when(partidaRepository.save(any(Partida.class))).thenAnswer(invocation -> invocation.getArgument(0));

            // Act
            useCase.ejecutar(command);

            // Assert
            verify(notificacionPort).notificarCartaRobada(partidaId, jugadorActualId, true);
        }
    }

    @Nested
    @DisplayName("Robar del descarte")
    class RobarDelDescarte {

        @Test
        @DisplayName("debe permitir robar del descarte")
        void debePermitirRobarDelDescarte() {
            // Arrange
            String partidaId = partida.getIdValue();
            RobarCartaCommand command = RobarCartaCommand.delDescarte(partidaId, jugadorActualId);

            when(partidaRepository.findById(partidaId)).thenReturn(Optional.of(partida));
            when(partidaRepository.save(any(Partida.class))).thenAnswer(invocation -> invocation.getArgument(0));

            // Act
            CartaRobada resultado = useCase.ejecutar(command);

            // Assert
            assertNotNull(resultado);
            assertFalse(resultado.isDelMazo());
        }
    }

    @Nested
    @DisplayName("Validaciones")
    class Validaciones {

        @Test
        @DisplayName("debe lanzar excepción si partida no existe")
        void debeLanzarExcepcionSiPartidaNoExiste() {
            // Arrange
            RobarCartaCommand command = RobarCartaCommand.delMazo("no-existe", jugadorActualId);
            when(partidaRepository.findById("no-existe")).thenReturn(Optional.empty());

            // Act & Assert
            assertThrows(PartidaNoEncontradaException.class, () ->
                    useCase.ejecutar(command)
            );
        }

        @Test
        @DisplayName("debe lanzar excepción si no es el turno del jugador")
        void debeLanzarExcepcionSiNoEsTurno() {
            // Arrange
            String partidaId = partida.getIdValue();
            String otroJugadorId = partida.getJugadores().get(1).getIdValue();
            RobarCartaCommand command = RobarCartaCommand.delMazo(partidaId, otroJugadorId);

            when(partidaRepository.findById(partidaId)).thenReturn(Optional.of(partida));

            // Act & Assert
            assertThrows(TurnoInvalidoException.class, () ->
                    useCase.ejecutar(command)
            );
        }
    }
}
