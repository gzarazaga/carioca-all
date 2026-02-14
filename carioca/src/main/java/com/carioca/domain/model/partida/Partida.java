package com.carioca.domain.model.partida;

import com.carioca.domain.exception.MovimientoInvalidoException;
import com.carioca.domain.exception.PartidaCompletaException;
import com.carioca.domain.exception.TurnoInvalidoException;
import com.carioca.domain.model.juego.*;
import com.carioca.domain.model.jugador.Jugador;
import lombok.Getter;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * Agregado raíz que representa una partida de Carioca.
 * Contiene toda la lógica del juego y coordina las interacciones entre jugadores.
 */
@Getter
public class Partida {

    public static final int MINIMO_JUGADORES = 2;
    public static final int MAXIMO_JUGADORES = 6;
    public static final int CARTAS_INICIALES = 12;

    private final PartidaId id;
    private final List<Jugador> jugadores;
    private final Mazo mazo;
    private final PilaDescarte pilaDescarte;
    private final List<Movimiento> historialMovimientos;
    private Ronda rondaActual;
    private EstadoPartida estado;
    private EstadoTurno estadoTurno;
    private int indiceJugadorActual;
    private int numeroTurno;
    private final Instant fechaCreacion;
    private Instant fechaInicio;
    private Instant fechaFin;
    private String ganadorId;

    private Partida(PartidaId id, List<Jugador> jugadores, Mazo mazo, PilaDescarte pilaDescarte,
                    Ronda rondaActual, EstadoPartida estado, EstadoTurno estadoTurno,
                    int indiceJugadorActual, int numeroTurno, List<Movimiento> historialMovimientos,
                    Instant fechaCreacion, Instant fechaInicio, Instant fechaFin, String ganadorId) {
        this.id = id;
        this.jugadores = new ArrayList<>(jugadores);
        this.mazo = mazo;
        this.pilaDescarte = pilaDescarte;
        this.rondaActual = rondaActual;
        this.estado = estado;
        this.estadoTurno = estadoTurno;
        this.indiceJugadorActual = indiceJugadorActual;
        this.numeroTurno = numeroTurno;
        this.historialMovimientos = new ArrayList<>(historialMovimientos);
        this.fechaCreacion = fechaCreacion;
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
        this.ganadorId = ganadorId;
    }

    /**
     * Crea una nueva partida.
     */
    public static Partida crear(Jugador creador) {
        List<Jugador> jugadores = new ArrayList<>();
        jugadores.add(creador);

        return new Partida(
                PartidaId.generar(),
                jugadores,
                Mazo.crearMazoCompleto(),
                PilaDescarte.crear(),
                null,
                EstadoPartida.ESPERANDO_JUGADORES,
                null,
                0,
                0,
                new ArrayList<>(),
                Instant.now(),
                null,
                null,
                null
        );
    }

    /**
     * Reconstruye una partida desde persistencia.
     */
    public static Partida reconstitute(PartidaId id, List<Jugador> jugadores, Mazo mazo,
                                       PilaDescarte pilaDescarte, Ronda rondaActual,
                                       EstadoPartida estado, EstadoTurno estadoTurno,
                                       int indiceJugadorActual, int numeroTurno,
                                       List<Movimiento> historialMovimientos,
                                       Instant fechaCreacion, Instant fechaInicio,
                                       Instant fechaFin, String ganadorId) {
        return new Partida(id, jugadores, mazo, pilaDescarte, rondaActual, estado, estadoTurno,
                indiceJugadorActual, numeroTurno, historialMovimientos, fechaCreacion,
                fechaInicio, fechaFin, ganadorId);
    }

    /**
     * Agrega un jugador a la partida.
     */
    public void agregarJugador(Jugador jugador) {
        if (estado != EstadoPartida.ESPERANDO_JUGADORES) {
            throw new MovimientoInvalidoException("No se pueden agregar jugadores a una partida en curso");
        }
        if (jugadores.size() >= MAXIMO_JUGADORES) {
            throw new PartidaCompletaException("La partida ya tiene el máximo de jugadores");
        }
        if (jugadores.stream().anyMatch(j -> j.getId().equals(jugador.getId()))) {
            throw new MovimientoInvalidoException("El jugador ya está en la partida");
        }
        jugadores.add(jugador);
    }

    /**
     * Inicia la partida si hay suficientes jugadores.
     */
    public void iniciar() {
        if (estado != EstadoPartida.ESPERANDO_JUGADORES) {
            throw new MovimientoInvalidoException("La partida ya ha sido iniciada");
        }
        if (jugadores.size() < MINIMO_JUGADORES) {
            throw new MovimientoInvalidoException(
                    String.format("Se necesitan al menos %d jugadores para iniciar", MINIMO_JUGADORES));
        }

        this.estado = EstadoPartida.EN_CURSO;
        this.fechaInicio = Instant.now();
        iniciarRonda(1);
    }

    /**
     * Inicia una nueva ronda.
     */
    private void iniciarRonda(int numeroRonda) {
        this.rondaActual = Ronda.iniciar(numeroRonda);
        this.indiceJugadorActual = 0;
        this.numeroTurno = 1;
        this.estadoTurno = EstadoTurno.ESPERANDO_ROBAR;

        // Preparar el mazo
        mazo.barajar();

        // Repartir cartas a cada jugador
        for (Jugador jugador : jugadores) {
            jugador.prepararNuevaRonda();
            List<Carta> cartasIniciales = mazo.robar(CARTAS_INICIALES);
            jugador.recibirCartas(cartasIniciales);
        }

        // Poner una carta inicial en el descarte
        mazo.robar().ifPresent(pilaDescarte::descartar);
    }

    /**
     * El jugador actual roba una carta del mazo.
     */
    public Carta robarDelMazo(String jugadorId) {
        validarTurno(jugadorId, EstadoTurno.ESPERANDO_ROBAR);
        verificarMazoNoVacio();

        Carta carta = mazo.robar()
                .orElseThrow(() -> new MovimientoInvalidoException("El mazo está vacío"));

        Jugador jugador = obtenerJugadorActual();
        jugador.agregarCarta(carta);

        registrarMovimiento(Movimiento.robarDeMazo(jugadorId, id.getValor(),
                rondaActual.getNumero(), numeroTurno, carta));

        this.estadoTurno = EstadoTurno.ESPERANDO_DESCARTAR;

        return carta;
    }

    /**
     * El jugador actual roba la carta superior del descarte.
     */
    public Carta robarDelDescarte(String jugadorId) {
        validarTurno(jugadorId, EstadoTurno.ESPERANDO_ROBAR);

        if (pilaDescarte.estaVacia()) {
            throw new MovimientoInvalidoException("La pila de descarte está vacía");
        }

        Carta carta = pilaDescarte.tomarSuperior()
                .orElseThrow(() -> new MovimientoInvalidoException("La pila de descarte está vacía"));

        Jugador jugador = obtenerJugadorActual();
        jugador.agregarCarta(carta);

        registrarMovimiento(Movimiento.robarDeDescarte(jugadorId, id.getValor(),
                rondaActual.getNumero(), numeroTurno, carta));

        this.estadoTurno = EstadoTurno.ESPERANDO_DESCARTAR;

        return carta;
    }

    /**
     * El jugador descarta una carta y termina su turno.
     */
    public void descartarCarta(String jugadorId, String cartaId) {
        validarTurno(jugadorId, EstadoTurno.ESPERANDO_DESCARTAR);

        Jugador jugador = obtenerJugadorActual();
        Carta carta = jugador.descartarCarta(cartaId)
                .orElseThrow(() -> new MovimientoInvalidoException("El jugador no tiene esa carta"));

        pilaDescarte.descartar(carta);

        registrarMovimiento(Movimiento.descartar(jugadorId, id.getValor(),
                rondaActual.getNumero(), numeroTurno, carta));

        // Verificar si el jugador ganó la ronda (se quedó sin cartas)
        if (!jugador.tieneCartasEnMano()) {
            finalizarRonda(jugadorId);
        } else {
            avanzarTurno();
        }
    }

    /**
     * El jugador baja una formación (pierna o escalera).
     */
    public Formacion bajarFormacion(String jugadorId, TipoFormacion tipo, List<String> cartaIds) {
        validarTurno(jugadorId, EstadoTurno.ESPERANDO_DESCARTAR);

        Jugador jugador = obtenerJugadorActual();

        // Verificar que el jugador tenga todas las cartas
        for (String cartaId : cartaIds) {
            if (!jugador.tieneCarta(cartaId)) {
                throw new MovimientoInvalidoException("El jugador no tiene todas las cartas especificadas");
            }
        }

        // Remover las cartas de la mano
        List<Carta> cartas = jugador.removerCartas(cartaIds);

        // Crear la formación
        Formacion formacion = Formacion.crear(tipo, cartas, jugadorId);

        // Si es la primera bajada del jugador, verificar requisitos de la ronda
        if (!rondaActual.haBajado(jugadorId)) {
            List<Formacion> formacionesExistentes = rondaActual.obtenerFormacionesJugador(jugadorId);
            List<Formacion> todasFormaciones = new ArrayList<>(formacionesExistentes);
            todasFormaciones.add(formacion);

            if (!rondaActual.getConfig().cumpleRequisitos(todasFormaciones)) {
                // Devolver las cartas al jugador
                jugador.recibirCartas(cartas);
                throw new MovimientoInvalidoException(
                        "No cumples los requisitos de la ronda: " + rondaActual.getConfig().getDescripcion());
            }
        }

        // Registrar la bajada
        if (!rondaActual.haBajado(jugadorId)) {
            List<Formacion> formaciones = new ArrayList<>();
            formaciones.add(formacion);
            rondaActual.registrarBajada(jugadorId, formaciones);
        } else {
            rondaActual.obtenerFormacionesJugador(jugadorId).add(formacion);
        }

        registrarMovimiento(Movimiento.bajarFormacion(jugadorId, id.getValor(),
                rondaActual.getNumero(), numeroTurno, formacion));

        return formacion;
    }

    /**
     * El jugador pega una carta a una formación existente.
     */
    public void pegarCarta(String jugadorId, String cartaId, String formacionId, boolean alInicio) {
        validarTurno(jugadorId, EstadoTurno.ESPERANDO_DESCARTAR);

        // Verificar que el jugador ya haya bajado
        if (!rondaActual.haBajado(jugadorId)) {
            throw new MovimientoInvalidoException("Debes bajar tus formaciones antes de pegar cartas");
        }

        Jugador jugador = obtenerJugadorActual();
        Carta carta = jugador.descartarCarta(cartaId)
                .orElseThrow(() -> new MovimientoInvalidoException("El jugador no tiene esa carta"));

        try {
            rondaActual.agregarCartaAFormacion(formacionId, carta, alInicio);
        } catch (Exception e) {
            // Devolver la carta al jugador si falla
            jugador.agregarCarta(carta);
            throw new MovimientoInvalidoException("No se puede pegar la carta a esa formación: " + e.getMessage());
        }

        registrarMovimiento(Movimiento.pegarCarta(jugadorId, id.getValor(),
                rondaActual.getNumero(), numeroTurno, carta, formacionId));
    }

    /**
     * Finaliza la ronda actual.
     */
    private void finalizarRonda(String ganadorRondaId) {
        rondaActual.finalizar(ganadorRondaId);

        // Calcular y asignar puntos a cada jugador (excepto al ganador)
        for (Jugador jugador : jugadores) {
            if (!jugador.getIdValue().equals(ganadorRondaId)) {
                int puntos = jugador.calcularPuntosEnMano();
                jugador.sumarPuntos(puntos);
            }
            jugador.avanzarRonda();
        }

        // Verificar si es la última ronda
        if (rondaActual.esUltimaRonda()) {
            finalizarPartida();
        } else {
            iniciarRonda(rondaActual.getNumero() + 1);
        }
    }

    /**
     * Finaliza la partida.
     */
    private void finalizarPartida() {
        this.estado = EstadoPartida.FINALIZADA;
        this.fechaFin = Instant.now();

        // El ganador es quien tenga menos puntos
        this.ganadorId = jugadores.stream()
                .min((j1, j2) -> Integer.compare(j1.getPuntosTotales(), j2.getPuntosTotales()))
                .map(Jugador::getIdValue)
                .orElse(null);
    }

    /**
     * Avanza al siguiente turno.
     */
    private void avanzarTurno() {
        this.indiceJugadorActual = (indiceJugadorActual + 1) % jugadores.size();
        this.numeroTurno++;
        this.estadoTurno = EstadoTurno.ESPERANDO_ROBAR;

        // Verificar si el mazo está vacío y reciclar el descarte
        if (mazo.estaVacio()) {
            List<Carta> cartasRecicladas = pilaDescarte.recogerExceptoSuperior();
            mazo.agregarAlFondo(cartasRecicladas);
            mazo.barajar();
        }
    }

    private void validarTurno(String jugadorId, EstadoTurno estadoEsperado) {
        if (estado != EstadoPartida.EN_CURSO) {
            throw new TurnoInvalidoException("La partida no está en curso");
        }
        if (!obtenerJugadorActual().getIdValue().equals(jugadorId)) {
            throw new TurnoInvalidoException("No es tu turno");
        }
        if (estadoTurno != estadoEsperado) {
            throw new TurnoInvalidoException("Acción no permitida en este momento del turno");
        }
    }

    private void verificarMazoNoVacio() {
        if (mazo.estaVacio()) {
            // Reciclar el descarte
            List<Carta> cartasRecicladas = pilaDescarte.recogerExceptoSuperior();
            if (cartasRecicladas.isEmpty()) {
                throw new MovimientoInvalidoException("No hay más cartas disponibles");
            }
            mazo.agregarAlFondo(cartasRecicladas);
            mazo.barajar();
        }
    }

    private void registrarMovimiento(Movimiento movimiento) {
        historialMovimientos.add(movimiento);
    }

    public Jugador obtenerJugadorActual() {
        return jugadores.get(indiceJugadorActual);
    }

    public Optional<Jugador> obtenerJugador(String jugadorId) {
        return jugadores.stream()
                .filter(j -> j.getIdValue().equals(jugadorId))
                .findFirst();
    }

    public int getNumeroRondaActual() {
        return rondaActual != null ? rondaActual.getNumero() : 0;
    }

    public String getIdValue() {
        return id.getValor();
    }

    public boolean puedeIniciar() {
        return estado == EstadoPartida.ESPERANDO_JUGADORES &&
                jugadores.size() >= MINIMO_JUGADORES;
    }

    public boolean estaEnCurso() {
        return estado == EstadoPartida.EN_CURSO;
    }

    public boolean estaFinalizada() {
        return estado == EstadoPartida.FINALIZADA;
    }
}
