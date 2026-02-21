package com.carioca.domain.usecase.partida;

import com.carioca.domain.exception.MovimientoInvalidoException;
import com.carioca.domain.exception.PartidaNoEncontradaException;
import com.carioca.domain.model.event.PartidaIniciadaEvent;
import com.carioca.domain.model.jugador.Jugador;
import com.carioca.domain.model.partida.EstadoPartida;
import com.carioca.domain.model.partida.Partida;
import com.carioca.domain.port.out.EventPublisherPort;
import com.carioca.domain.port.out.NotificacionPort;
import com.carioca.domain.port.out.PartidaRepositoryPort;
import com.carioca.domain.usecase.partida.iniciar.IniciarPartidaUseCase;
import com.carioca.domain.usecase.partida.iniciar.impl.IniciarPartidaUseCaseImpl;
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
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("IniciarPartidaUseCase")
class IniciarPartidaUseCaseTest {

    @Mock
    private PartidaRepositoryPort partidaRepository;

    @Mock
    private NotificacionPort notificacionPort;

    @Mock
    private EventPublisherPort eventPublisher;

    private IniciarPartidaUseCase useCase;
    private Partida partida;

    @BeforeEach
    void setUp() {
        useCase = new IniciarPartidaUseCaseImpl(partidaRepository, notificacionPort, eventPublisher);

        // Crear partida con 2 jugadores
        Jugador creador = Jugador.crear("Jugador 1");
        partida = Partida.crear(creador);
        partida.agregarJugador(Jugador.crear("Jugador 2"));
    }

    @Test
    @DisplayName("debe iniciar partida con suficientes jugadores")
    void debeIniciarPartidaConSuficientesJugadores() {
        // Arrange
        String partidaId = partida.getIdValue();
        when(partidaRepository.findById(partidaId)).thenReturn(Optional.of(partida));
        when(partidaRepository.save(any(Partida.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        useCase.ejecutar(partidaId);

        // Assert
        ArgumentCaptor<Partida> partidaCaptor = ArgumentCaptor.forClass(Partida.class);
        verify(partidaRepository).save(partidaCaptor.capture());

        Partida partidaGuardada = partidaCaptor.getValue();
        assertEquals(EstadoPartida.EN_CURSO, partidaGuardada.getEstado());
        assertEquals(1, partidaGuardada.getNumeroRondaActual());
    }

    @Test
    @DisplayName("debe repartir cartas a todos los jugadores")
    void debeRepartirCartasATodosLosJugadores() {
        // Arrange
        String partidaId = partida.getIdValue();
        when(partidaRepository.findById(partidaId)).thenReturn(Optional.of(partida));
        when(partidaRepository.save(any(Partida.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        useCase.ejecutar(partidaId);

        // Assert
        ArgumentCaptor<Partida> partidaCaptor = ArgumentCaptor.forClass(Partida.class);
        verify(partidaRepository).save(partidaCaptor.capture());

        Partida partidaGuardada = partidaCaptor.getValue();
        for (Jugador jugador : partidaGuardada.getJugadores()) {
            assertEquals(7, jugador.cantidadCartasEnMano());
        }
    }

    @Test
    @DisplayName("debe publicar evento PartidaIniciada")
    void debePublicarEventoPartidaIniciada() {
        // Arrange
        String partidaId = partida.getIdValue();
        when(partidaRepository.findById(partidaId)).thenReturn(Optional.of(partida));
        when(partidaRepository.save(any(Partida.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        useCase.ejecutar(partidaId);

        // Assert
        ArgumentCaptor<PartidaIniciadaEvent> eventCaptor = ArgumentCaptor.forClass(PartidaIniciadaEvent.class);
        verify(eventPublisher).publish(eventCaptor.capture());

        PartidaIniciadaEvent evento = eventCaptor.getValue();
        assertEquals(partidaId, evento.getPartidaId());
        assertEquals(1, evento.getNumeroRonda());
        assertEquals(2, evento.getJugadorIds().size());
    }

    @Test
    @DisplayName("debe notificar estado a todos los jugadores")
    void debeNotificarEstadoATodos() {
        // Arrange
        String partidaId = partida.getIdValue();
        when(partidaRepository.findById(partidaId)).thenReturn(Optional.of(partida));
        when(partidaRepository.save(any(Partida.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        useCase.ejecutar(partidaId);

        // Assert
        verify(notificacionPort).notificarEstadoPartida(any(Partida.class));
        verify(notificacionPort, times(2)).notificarCartasJugador(eq(partidaId), anyString(), anyList());
        verify(notificacionPort).notificarTurno(eq(partidaId), anyString());
    }

    @Test
    @DisplayName("debe lanzar excepción si partida no existe")
    void debeLanzarExcepcionSiPartidaNoExiste() {
        // Arrange
        when(partidaRepository.findById("no-existe")).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(PartidaNoEncontradaException.class, () ->
                useCase.ejecutar("no-existe")
        );
    }

    @Test
    @DisplayName("debe lanzar excepción con solo 1 jugador")
    void debeLanzarExcepcionConSoloUnJugador() {
        // Arrange
        Partida partidaSoloUnJugador = Partida.crear(Jugador.crear("Solo"));
        String partidaId = partidaSoloUnJugador.getIdValue();
        when(partidaRepository.findById(partidaId)).thenReturn(Optional.of(partidaSoloUnJugador));

        // Act & Assert
        assertThrows(MovimientoInvalidoException.class, () ->
                useCase.ejecutar(partidaId)
        );
    }
}
