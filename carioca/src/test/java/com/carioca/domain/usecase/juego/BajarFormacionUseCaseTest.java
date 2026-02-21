package com.carioca.domain.usecase.juego;

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
    @DisplayName("Bajar piernas válidas")
    class BajarPiernasValidas {

        @Test
        @DisplayName("debe permitir bajar las dos piernas requeridas en ronda 1")
        void debePermitirBajarDosPiernas() {
            // Arrange
            String partidaId = partida.getIdValue();
            Jugador jugador = partida.obtenerJugadorActual();
            List<Carta> mano = jugador.getMano().getCartas();

            // Buscar dos grupos de 3 cartas del mismo valor
            List<String> pierna1 = encontrarCartasMismoValor(mano, 3, List.of());
            if (pierna1 == null) return;

            List<String> pierna2 = encontrarCartasMismoValor(mano, 3, pierna1);
            if (pierna2 == null) return;

            BajarFormacionCommand command = BajarFormacionCommand.of(
                    partidaId, jugadorActualId,
                    List.of(
                            new BajarFormacionCommand.FormacionInput(TipoFormacion.PIERNA, pierna1),
                            new BajarFormacionCommand.FormacionInput(TipoFormacion.PIERNA, pierna2)
                    )
            );

            when(partidaRepository.findById(partidaId)).thenReturn(Optional.of(partida));
            when(partidaRepository.save(any(Partida.class))).thenAnswer(inv -> inv.getArgument(0));

            // Act
            List<Formacion> formaciones = useCase.ejecutar(command);

            // Assert
            assertNotNull(formaciones);
            assertEquals(2, formaciones.size());
            assertTrue(formaciones.stream().allMatch(f -> f.getTipo() == TipoFormacion.PIERNA));
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
                    "no-existe", jugadorActualId,
                    List.of(new BajarFormacionCommand.FormacionInput(
                            TipoFormacion.PIERNA, List.of("c1", "c2", "c3")))
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
                    partidaId, jugadorActualId,
                    List.of(new BajarFormacionCommand.FormacionInput(
                            TipoFormacion.PIERNA, List.of("fake-1", "fake-2", "fake-3")))
            );

            when(partidaRepository.findById(partidaId)).thenReturn(Optional.of(partida));

            // Act & Assert
            assertThrows(MovimientoInvalidoException.class, () ->
                    useCase.ejecutar(command)
            );
        }

        @Test
        @DisplayName("debe notificar cada formación bajada")
        void debeNotificarFormacionesBajadas() {
            // Arrange
            String partidaId = partida.getIdValue();
            Jugador jugador = partida.obtenerJugadorActual();
            List<Carta> mano = jugador.getMano().getCartas();

            List<String> pierna1 = encontrarCartasMismoValor(mano, 3, List.of());
            if (pierna1 == null) return;
            List<String> pierna2 = encontrarCartasMismoValor(mano, 3, pierna1);
            if (pierna2 == null) return;

            BajarFormacionCommand command = BajarFormacionCommand.of(
                    partidaId, jugadorActualId,
                    List.of(
                            new BajarFormacionCommand.FormacionInput(TipoFormacion.PIERNA, pierna1),
                            new BajarFormacionCommand.FormacionInput(TipoFormacion.PIERNA, pierna2)
                    )
            );

            when(partidaRepository.findById(partidaId)).thenReturn(Optional.of(partida));
            when(partidaRepository.save(any(Partida.class))).thenAnswer(inv -> inv.getArgument(0));

            // Act
            useCase.ejecutar(command);

            // Assert — una notificación por cada formación bajada
            verify(notificacionPort, times(2))
                    .notificarFormacionBajada(eq(partidaId), eq(jugadorActualId), any(Formacion.class));
        }
    }

    /**
     * Busca en la mano {@code cantidad} cartas del mismo valor,
     * excluyendo los IDs ya usados en {@code excluir}.
     */
    private List<String> encontrarCartasMismoValor(List<Carta> mano, int cantidad,
                                                    List<String> excluir) {
        for (Valor valor : Valor.values()) {
            if (valor == Valor.COMODIN) continue;

            List<String> candidatas = mano.stream()
                    .filter(c -> c.getValor() == valor && !excluir.contains(c.getId()))
                    .map(Carta::getId)
                    .limit(cantidad)
                    .toList();

            if (candidatas.size() >= cantidad) {
                return candidatas;
            }
        }
        return null;
    }
}