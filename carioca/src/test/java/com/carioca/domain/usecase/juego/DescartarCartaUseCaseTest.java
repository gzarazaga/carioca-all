package com.carioca.domain.usecase.juego;

import com.carioca.domain.exception.MovimientoInvalidoException;
import com.carioca.domain.exception.PartidaNoEncontradaException;
import com.carioca.domain.exception.TurnoInvalidoException;
import com.carioca.domain.model.jugador.Jugador;
import com.carioca.domain.model.partida.EstadoTurno;
import com.carioca.domain.model.partida.Partida;
import com.carioca.domain.port.out.NotificacionPort;
import com.carioca.domain.port.out.PartidaRepositoryPort;
import com.carioca.domain.usecase.juego.descartarcarta.DescartarCartaCommand;
import com.carioca.domain.usecase.juego.descartarcarta.DescartarCartaUseCase;
import com.carioca.domain.usecase.juego.descartarcarta.impl.DescartarCartaUseCaseImpl;
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
@DisplayName("DescartarCartaUseCase")
class DescartarCartaUseCaseTest {

    @Mock
    private PartidaRepositoryPort partidaRepository;

    @Mock
    private NotificacionPort notificacionPort;

    private DescartarCartaUseCase useCase;
    private Partida partida;
    private String jugadorActualId;
    private String cartaId;

    @BeforeEach
    void setUp() {
        useCase = new DescartarCartaUseCaseImpl(partidaRepository, notificacionPort);

        // Crear e iniciar partida
        Jugador jugador1 = Jugador.crear("Jugador 1");
        Jugador jugador2 = Jugador.crear("Jugador 2");
        partida = Partida.crear(jugador1);
        partida.agregarJugador(jugador2);
        partida.iniciar();

        jugadorActualId = partida.obtenerJugadorActual().getIdValue();

        // Robar una carta para poder descartar
        partida.robarDelMazo(jugadorActualId);

        // Obtener ID de una carta para descartar
        cartaId = partida.obtenerJugadorActual().getMano().getCartas().get(0).getId();
    }

    @Nested
    @DisplayName("Descartar válido")
    class DescartarValido {

        @Test
        @DisplayName("debe permitir descartar carta después de robar")
        void debePermitirDescartarDespuesDeRobar() {
            // Arrange
            String partidaId = partida.getIdValue();
            DescartarCartaCommand command = DescartarCartaCommand.of(partidaId, jugadorActualId, cartaId);

            when(partidaRepository.findById(partidaId)).thenReturn(Optional.of(partida));
            when(partidaRepository.save(any(Partida.class))).thenAnswer(invocation -> invocation.getArgument(0));

            // Act
            assertDoesNotThrow(() -> useCase.ejecutar(command));

            // Assert
            verify(partidaRepository).save(any(Partida.class));
        }

        @Test
        @DisplayName("debe remover carta de la mano del jugador")
        void debeRemoverCartaDeMano() {
            // Arrange
            String partidaId = partida.getIdValue();
            DescartarCartaCommand command = DescartarCartaCommand.of(partidaId, jugadorActualId, cartaId);
            int cartasAntes = partida.obtenerJugadorActual().cantidadCartasEnMano();

            when(partidaRepository.findById(partidaId)).thenReturn(Optional.of(partida));
            when(partidaRepository.save(any(Partida.class))).thenAnswer(invocation -> invocation.getArgument(0));

            // Act
            useCase.ejecutar(command);

            // Assert
            ArgumentCaptor<Partida> partidaCaptor = ArgumentCaptor.forClass(Partida.class);
            verify(partidaRepository).save(partidaCaptor.capture());

            // El jugador actual cambió, verificamos que la cantidad de cartas se redujo
            assertEquals(cartasAntes - 1, partidaCaptor.getValue().getJugadores().get(0).cantidadCartasEnMano());
        }

        @Test
        @DisplayName("debe pasar turno al siguiente jugador")
        void debePasarTurnoAlSiguiente() {
            // Arrange
            String partidaId = partida.getIdValue();
            DescartarCartaCommand command = DescartarCartaCommand.of(partidaId, jugadorActualId, cartaId);

            when(partidaRepository.findById(partidaId)).thenReturn(Optional.of(partida));
            when(partidaRepository.save(any(Partida.class))).thenAnswer(invocation -> invocation.getArgument(0));

            // Act
            useCase.ejecutar(command);

            // Assert
            ArgumentCaptor<Partida> partidaCaptor = ArgumentCaptor.forClass(Partida.class);
            verify(partidaRepository).save(partidaCaptor.capture());

            Partida partidaGuardada = partidaCaptor.getValue();
            assertNotEquals(jugadorActualId, partidaGuardada.obtenerJugadorActual().getIdValue());
            assertEquals(EstadoTurno.ESPERANDO_ROBAR, partidaGuardada.getEstadoTurno());
        }

        @Test
        @DisplayName("debe notificar carta descartada")
        void debeNotificarCartaDescartada() {
            // Arrange
            String partidaId = partida.getIdValue();
            DescartarCartaCommand command = DescartarCartaCommand.of(partidaId, jugadorActualId, cartaId);

            when(partidaRepository.findById(partidaId)).thenReturn(Optional.of(partida));
            when(partidaRepository.save(any(Partida.class))).thenAnswer(invocation -> invocation.getArgument(0));

            // Act
            useCase.ejecutar(command);

            // Assert
            verify(notificacionPort).notificarCartaDescartada(eq(partidaId), eq(jugadorActualId), any());
        }

        @Test
        @DisplayName("debe notificar turno al siguiente jugador")
        void debeNotificarTurnoAlSiguiente() {
            // Arrange
            String partidaId = partida.getIdValue();
            DescartarCartaCommand command = DescartarCartaCommand.of(partidaId, jugadorActualId, cartaId);

            when(partidaRepository.findById(partidaId)).thenReturn(Optional.of(partida));
            when(partidaRepository.save(any(Partida.class))).thenAnswer(invocation -> invocation.getArgument(0));

            // Act
            useCase.ejecutar(command);

            // Assert
            verify(notificacionPort).notificarTurno(eq(partidaId), anyString());
        }
    }

    @Nested
    @DisplayName("Validaciones")
    class Validaciones {

        @Test
        @DisplayName("debe lanzar excepción si partida no existe")
        void debeLanzarExcepcionSiPartidaNoExiste() {
            // Arrange
            DescartarCartaCommand command = DescartarCartaCommand.of("no-existe", jugadorActualId, cartaId);
            when(partidaRepository.findById("no-existe")).thenReturn(Optional.empty());

            // Act & Assert
            assertThrows(PartidaNoEncontradaException.class, () ->
                    useCase.ejecutar(command)
            );
        }

        @Test
        @DisplayName("debe lanzar excepción si carta no pertenece al jugador")
        void debeLanzarExcepcionSiCartaNoPertenece() {
            // Arrange
            String partidaId = partida.getIdValue();
            DescartarCartaCommand command = DescartarCartaCommand.of(partidaId, jugadorActualId, "carta-inexistente");

            when(partidaRepository.findById(partidaId)).thenReturn(Optional.of(partida));

            // Act & Assert
            assertThrows(MovimientoInvalidoException.class, () ->
                    useCase.ejecutar(command)
            );
        }

        @Test
        @DisplayName("debe lanzar excepción si intenta descartar sin haber robado")
        void debeLanzarExcepcionSinHaberRobado() {
            // Arrange - crear nueva partida sin robar
            Partida nuevaPartida = Partida.crear(Jugador.crear("J1"));
            nuevaPartida.agregarJugador(Jugador.crear("J2"));
            nuevaPartida.iniciar();

            String partidaId = nuevaPartida.getIdValue();
            String jugId = nuevaPartida.obtenerJugadorActual().getIdValue();
            String cartId = nuevaPartida.obtenerJugadorActual().getMano().getCartas().get(0).getId();

            DescartarCartaCommand command = DescartarCartaCommand.of(partidaId, jugId, cartId);

            when(partidaRepository.findById(partidaId)).thenReturn(Optional.of(nuevaPartida));

            // Act & Assert
            assertThrows(TurnoInvalidoException.class, () ->
                    useCase.ejecutar(command)
            );
        }
    }
}
