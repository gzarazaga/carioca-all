package com.carioca.domain.usecase.partida;

import com.carioca.domain.model.event.PartidaCreadaEvent;
import com.carioca.domain.model.partida.EstadoPartida;
import com.carioca.domain.model.partida.Partida;
import com.carioca.domain.port.out.EventPublisherPort;
import com.carioca.domain.port.out.PartidaRepositoryPort;
import com.carioca.domain.usecase.partida.crear.CrearPartidaCommand;
import com.carioca.domain.usecase.partida.crear.CrearPartidaUseCase;
import com.carioca.domain.usecase.partida.crear.PartidaCreada;
import com.carioca.domain.usecase.partida.crear.impl.CrearPartidaUseCaseImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("CrearPartidaUseCase")
class CrearPartidaUseCaseTest {

    @Mock
    private PartidaRepositoryPort partidaRepository;

    @Mock
    private EventPublisherPort eventPublisher;

    private CrearPartidaUseCase useCase;

    @BeforeEach
    void setUp() {
        useCase = new CrearPartidaUseCaseImpl(partidaRepository, eventPublisher);
    }

    @Test
    @DisplayName("debe crear partida con jugador inicial")
    void debeCrearPartidaConJugadorInicial() {
        // Arrange
        CrearPartidaCommand command = CrearPartidaCommand.of("Juan");

        when(partidaRepository.save(any(Partida.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        PartidaCreada resultado = useCase.ejecutar(command);

        // Assert
        assertNotNull(resultado);
        assertNotNull(resultado.getPartidaId());
        assertNotNull(resultado.getJugadorId());
        assertEquals("Juan", resultado.getNombreJugador());
    }

    @Test
    @DisplayName("debe persistir la partida")
    void debePersistirPartida() {
        // Arrange
        CrearPartidaCommand command = CrearPartidaCommand.of("María");
        when(partidaRepository.save(any(Partida.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        useCase.ejecutar(command);

        // Assert
        ArgumentCaptor<Partida> partidaCaptor = ArgumentCaptor.forClass(Partida.class);
        verify(partidaRepository).save(partidaCaptor.capture());

        Partida partidaGuardada = partidaCaptor.getValue();
        assertEquals(EstadoPartida.ESPERANDO_JUGADORES, partidaGuardada.getEstado());
        assertEquals(1, partidaGuardada.getJugadores().size());
        assertEquals("María", partidaGuardada.getJugadores().get(0).getNombre());
    }

    @Test
    @DisplayName("debe publicar evento PartidaCreada")
    void debePublicarEventoPartidaCreada() {
        // Arrange
        CrearPartidaCommand command = CrearPartidaCommand.of("Pedro");
        when(partidaRepository.save(any(Partida.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        useCase.ejecutar(command);

        // Assert
        ArgumentCaptor<PartidaCreadaEvent> eventCaptor = ArgumentCaptor.forClass(PartidaCreadaEvent.class);
        verify(eventPublisher).publish(eventCaptor.capture());

        PartidaCreadaEvent evento = eventCaptor.getValue();
        assertEquals("Pedro", evento.getCreadorNombre());
        assertNotNull(evento.getPartidaId());
        assertNotNull(evento.getCreadorId());
    }

    @Test
    @DisplayName("debe lanzar excepción con nombre vacío")
    void debeLanzarExcepcionConNombreVacio() {
        assertThrows(IllegalArgumentException.class, () ->
                CrearPartidaCommand.of("")
        );
    }

    @Test
    @DisplayName("debe lanzar excepción con nombre nulo")
    void debeLanzarExcepcionConNombreNulo() {
        assertThrows(IllegalArgumentException.class, () ->
                CrearPartidaCommand.of(null)
        );
    }
}
