package com.carioca.domain.usecase.partida;

import com.carioca.domain.exception.PartidaNoEncontradaException;
import com.carioca.domain.model.jugador.Jugador;
import com.carioca.domain.model.partida.Partida;
import com.carioca.domain.port.out.NotificacionPort;
import com.carioca.domain.port.out.PartidaRepositoryPort;
import com.carioca.domain.usecase.partida.crear.PartidaCreada;
import com.carioca.domain.usecase.partida.unirse.UnirsePartidaCommand;
import com.carioca.domain.usecase.partida.unirse.UnirsePartidaUseCase;
import com.carioca.domain.usecase.partida.unirse.impl.UnirsePartidaUseCaseImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("UnirsePartidaUseCase")
class UnirsePartidaUseCaseTest {

    @Mock
    private PartidaRepositoryPort partidaRepository;

    @Mock
    private NotificacionPort notificacionPort;

    private UnirsePartidaUseCase useCase;
    private Partida partidaExistente;

    @BeforeEach
    void setUp() {
        useCase = new UnirsePartidaUseCaseImpl(partidaRepository, notificacionPort);

        // Crear partida existente
        Jugador creador = Jugador.crear("Creador");
        partidaExistente = Partida.crear(creador);
    }

    @Test
    @DisplayName("debe unir jugador a partida existente")
    void debeUnirJugadorAPartidaExistente() {
        // Arrange
        String partidaId = partidaExistente.getIdValue();
        UnirsePartidaCommand command = UnirsePartidaCommand.of(partidaId, "NuevoJugador");

        when(partidaRepository.findById(partidaId)).thenReturn(Optional.of(partidaExistente));
        when(partidaRepository.save(any(Partida.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        PartidaCreada resultado = useCase.ejecutar(command);

        // Assert
        assertNotNull(resultado);
        assertEquals(partidaId, resultado.getPartidaId());
        assertEquals("NuevoJugador", resultado.getNombreJugador());
        assertNotNull(resultado.getJugadorId());
    }

    @Test
    @DisplayName("debe agregar jugador a la lista de jugadores")
    void debeAgregarJugadorALista() {
        // Arrange
        String partidaId = partidaExistente.getIdValue();
        UnirsePartidaCommand command = UnirsePartidaCommand.of(partidaId, "Jugador2");

        when(partidaRepository.findById(partidaId)).thenReturn(Optional.of(partidaExistente));
        when(partidaRepository.save(any(Partida.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        useCase.ejecutar(command);

        // Assert
        ArgumentCaptor<Partida> partidaCaptor = ArgumentCaptor.forClass(Partida.class);
        verify(partidaRepository).save(partidaCaptor.capture());

        Partida partidaGuardada = partidaCaptor.getValue();
        assertEquals(2, partidaGuardada.getJugadores().size());
    }

    @Test
    @DisplayName("debe notificar a otros jugadores")
    void debeNotificarAOtrosJugadores() {
        // Arrange
        String partidaId = partidaExistente.getIdValue();
        UnirsePartidaCommand command = UnirsePartidaCommand.of(partidaId, "Jugador2");

        when(partidaRepository.findById(partidaId)).thenReturn(Optional.of(partidaExistente));
        when(partidaRepository.save(any(Partida.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        PartidaCreada resultado = useCase.ejecutar(command);

        // Assert
        verify(notificacionPort).notificarJugadorUnido(
                eq(partidaId),
                eq(resultado.getJugadorId()),
                eq("Jugador2")
        );
    }

    @Test
    @DisplayName("debe lanzar excepción si partida no existe")
    void debeLanzarExcepcionSiPartidaNoExiste() {
        // Arrange
        UnirsePartidaCommand command = UnirsePartidaCommand.of("partida-inexistente", "Jugador");
        when(partidaRepository.findById("partida-inexistente")).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(PartidaNoEncontradaException.class, () ->
                useCase.ejecutar(command)
        );
    }

    @Test
    @DisplayName("debe lanzar excepción con comando inválido")
    void debeLanzarExcepcionConComandoInvalido() {
        assertThrows(IllegalArgumentException.class, () ->
                UnirsePartidaCommand.of("", "Jugador")
        );

        assertThrows(IllegalArgumentException.class, () ->
                UnirsePartidaCommand.of("partidaId", "")
        );
    }
}
