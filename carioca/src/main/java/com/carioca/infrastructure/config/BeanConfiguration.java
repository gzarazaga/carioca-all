package com.carioca.infrastructure.config;

import com.carioca.domain.port.out.EventPublisherPort;
import com.carioca.domain.port.out.NotificacionPort;
import com.carioca.domain.port.out.PartidaRepositoryPort;
import com.carioca.domain.service.CalculadorPuntosService;
import com.carioca.domain.service.GestorRondasService;
import com.carioca.domain.service.GestorTurnosService;
import com.carioca.domain.service.ValidadorFormacionService;
import com.carioca.domain.service.impl.CalculadorPuntosServiceImpl;
import com.carioca.domain.service.impl.GestorRondasServiceImpl;
import com.carioca.domain.service.impl.GestorTurnosServiceImpl;
import com.carioca.domain.service.impl.ValidadorFormacionServiceImpl;
import com.carioca.domain.usecase.juego.bajarformacion.BajarFormacionUseCase;
import com.carioca.domain.usecase.juego.bajarformacion.impl.BajarFormacionUseCaseImpl;
import com.carioca.domain.usecase.juego.descartarcarta.DescartarCartaUseCase;
import com.carioca.domain.usecase.juego.descartarcarta.impl.DescartarCartaUseCaseImpl;
import com.carioca.domain.usecase.juego.pegarcarta.PegarCartaUseCase;
import com.carioca.domain.usecase.juego.pegarcarta.impl.PegarCartaUseCaseImpl;
import com.carioca.domain.usecase.juego.robarcarta.RobarCartaUseCase;
import com.carioca.domain.usecase.juego.robarcarta.impl.RobarCartaUseCaseImpl;
import com.carioca.domain.usecase.partida.crear.CrearPartidaUseCase;
import com.carioca.domain.usecase.partida.crear.impl.CrearPartidaUseCaseImpl;
import com.carioca.domain.usecase.partida.iniciar.IniciarPartidaUseCase;
import com.carioca.domain.usecase.partida.iniciar.impl.IniciarPartidaUseCaseImpl;
import com.carioca.domain.usecase.partida.obtener.ObtenerEstadoPartidaUseCase;
import com.carioca.domain.usecase.partida.obtener.impl.ObtenerEstadoPartidaUseCaseImpl;
import com.carioca.domain.usecase.partida.unirse.UnirsePartidaUseCase;
import com.carioca.domain.usecase.partida.unirse.impl.UnirsePartidaUseCaseImpl;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuración de beans para inyección de dependencias.
 * Conecta los casos de uso y servicios de dominio con sus implementaciones.
 */
@Configuration
public class BeanConfiguration {

    // ==================== SERVICIOS DE DOMINIO ====================

    @Bean
    public ValidadorFormacionService validadorFormacionService() {
        return new ValidadorFormacionServiceImpl();
    }

    @Bean
    public CalculadorPuntosService calculadorPuntosService() {
        return new CalculadorPuntosServiceImpl();
    }

    @Bean
    public GestorTurnosService gestorTurnosService() {
        return new GestorTurnosServiceImpl();
    }

    @Bean
    public GestorRondasService gestorRondasService() {
        return new GestorRondasServiceImpl();
    }

    // ==================== CASOS DE USO - PARTIDA ====================

    @Bean
    public CrearPartidaUseCase crearPartidaUseCase(
            PartidaRepositoryPort partidaRepository,
            EventPublisherPort eventPublisher) {
        return new CrearPartidaUseCaseImpl(partidaRepository, eventPublisher);
    }

    @Bean
    public UnirsePartidaUseCase unirsePartidaUseCase(
            PartidaRepositoryPort partidaRepository,
            NotificacionPort notificacionPort) {
        return new UnirsePartidaUseCaseImpl(partidaRepository, notificacionPort);
    }

    @Bean
    public ObtenerEstadoPartidaUseCase obtenerEstadoPartidaUseCase(
            PartidaRepositoryPort partidaRepository) {
        return new ObtenerEstadoPartidaUseCaseImpl(partidaRepository);
    }

    @Bean
    public IniciarPartidaUseCase iniciarPartidaUseCase(
            PartidaRepositoryPort partidaRepository,
            NotificacionPort notificacionPort,
            EventPublisherPort eventPublisher) {
        return new IniciarPartidaUseCaseImpl(partidaRepository, notificacionPort, eventPublisher);
    }

    // ==================== CASOS DE USO - JUEGO ====================

    @Bean
    public RobarCartaUseCase robarCartaUseCase(
            PartidaRepositoryPort partidaRepository,
            NotificacionPort notificacionPort) {
        return new RobarCartaUseCaseImpl(partidaRepository, notificacionPort);
    }

    @Bean
    public DescartarCartaUseCase descartarCartaUseCase(
            PartidaRepositoryPort partidaRepository,
            NotificacionPort notificacionPort) {
        return new DescartarCartaUseCaseImpl(partidaRepository, notificacionPort);
    }

    @Bean
    public BajarFormacionUseCase bajarFormacionUseCase(
            PartidaRepositoryPort partidaRepository,
            NotificacionPort notificacionPort) {
        return new BajarFormacionUseCaseImpl(partidaRepository, notificacionPort);
    }

    @Bean
    public PegarCartaUseCase pegarCartaUseCase(
            PartidaRepositoryPort partidaRepository,
            NotificacionPort notificacionPort) {
        return new PegarCartaUseCaseImpl(partidaRepository, notificacionPort);
    }
}
