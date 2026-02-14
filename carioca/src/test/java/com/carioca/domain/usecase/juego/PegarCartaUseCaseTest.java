package com.carioca.domain.usecase.juego;

import com.carioca.domain.exception.MovimientoInvalidoException;
import com.carioca.domain.exception.PartidaNoEncontradaException;
import com.carioca.domain.model.jugador.Jugador;
import com.carioca.domain.model.partida.Partida;
import com.carioca.domain.port.out.NotificacionPort;
import com.carioca.domain.port.out.PartidaRepositoryPort;
import com.carioca.domain.usecase.juego.pegarcarta.PegarCartaCommand;
import com.carioca.domain.usecase.juego.pegarcarta.PegarCartaUseCase;
import com.carioca.domain.usecase.juego.pegarcarta.impl.PegarCartaUseCaseImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("PegarCartaUseCase")
class PegarCartaUseCaseTest {

    @Mock
    private PartidaRepositoryPort partidaRepository;

    @Mock
    private NotificacionPort notificacionPort;

    private PegarCartaUseCase useCase;
    private Partida partida;
    private String jugadorActualId;

    @BeforeEach
    void setUp() {
        useCase = new PegarCartaUseCaseImpl(partidaRepository, notificacionPort);

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
    @DisplayName("Validaciones")
    class Validaciones {

        @Test
        @DisplayName("debe lanzar excepción si partida no existe")
        void debeLanzarExcepcionSiPartidaNoExiste() {
            // Arrange
            PegarCartaCommand command = PegarCartaCommand.alFinal(
                    "no-existe", jugadorActualId, "carta-1", "formacion-1"
            );
            when(partidaRepository.findById("no-existe")).thenReturn(Optional.empty());

            // Act & Assert
            assertThrows(PartidaNoEncontradaException.class, () ->
                    useCase.ejecutar(command)
            );
        }

        @Test
        @DisplayName("debe lanzar excepción si jugador no ha bajado")
        void debeLanzarExcepcionSiNoHaBajado() {
            // Arrange
            String partidaId = partida.getIdValue();
            String cartaId = partida.obtenerJugadorActual().getMano().getCartas().get(0).getId();

            PegarCartaCommand command = PegarCartaCommand.alFinal(
                    partidaId, jugadorActualId, cartaId, "formacion-1"
            );

            when(partidaRepository.findById(partidaId)).thenReturn(Optional.of(partida));

            // Act & Assert
            assertThrows(MovimientoInvalidoException.class, () ->
                    useCase.ejecutar(command)
            );
        }

        @Test
        @DisplayName("debe crear comando para pegar al inicio")
        void debeCrearComandoAlInicio() {
            PegarCartaCommand command = PegarCartaCommand.alInicio(
                    "partida-1", "jugador-1", "carta-1", "formacion-1"
            );

            assertTrue(command.isAlInicio());
            assertEquals("partida-1", command.getPartidaId());
            assertEquals("jugador-1", command.getJugadorId());
            assertEquals("carta-1", command.getCartaId());
            assertEquals("formacion-1", command.getFormacionId());
        }

        @Test
        @DisplayName("debe crear comando para pegar al final")
        void debeCrearComandoAlFinal() {
            PegarCartaCommand command = PegarCartaCommand.alFinal(
                    "partida-1", "jugador-1", "carta-1", "formacion-1"
            );

            assertFalse(command.isAlInicio());
        }
    }
}
