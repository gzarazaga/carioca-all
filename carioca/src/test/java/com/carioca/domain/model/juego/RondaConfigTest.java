package com.carioca.domain.model.juego;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("RondaConfig")
class RondaConfigTest {

    @Nested
    @DisplayName("Configuración de rondas")
    class ConfiguracionRondas {

        @Test
        @DisplayName("debe tener 7 rondas configuradas")
        void debeTener7Rondas() {
            assertEquals(7, RondaConfig.RONDAS_CARIOCA.size());
        }

        @ParameterizedTest
        @CsvSource({
                "1, 2, 0, '2 Piernas'",
                "2, 1, 1, '1 Pierna + 1 Escalera'",
                "3, 0, 2, '2 Escaleras'",
                "4, 3, 0, '3 Piernas'",
                "5, 2, 1, '2 Piernas + 1 Escalera'",
                "6, 1, 2, '1 Pierna + 2 Escaleras'",
                "7, 0, 3, '3 Escaleras'"
        })
        @DisplayName("debe tener la configuración correcta para cada ronda")
        void debeConfigurarRondaCorrectamente(int numero, int piernas, int escaleras, String descripcion) {
            RondaConfig config = RondaConfig.obtenerConfiguracion(numero, false);

            assertEquals(numero, config.getNumeroRonda());
            assertEquals(piernas, config.getPiernasRequeridas());
            assertEquals(escaleras, config.getEscalerasRequeridas());
            assertEquals(descripcion, config.getDescripcion());
        }

        @Test
        @DisplayName("debe lanzar excepción para ronda inválida")
        void debeLanzarExcepcionParaRondaInvalida() {
            assertThrows(IllegalArgumentException.class, () ->
                    RondaConfig.obtenerConfiguracion(0, false)
            );
            assertThrows(IllegalArgumentException.class, () ->
                    RondaConfig.obtenerConfiguracion(8, false)
            );
        }
    }

    @Nested
    @DisplayName("Modo test")
    class ModoTest {

        @Test
        @DisplayName("debe tener solo 2 rondas configuradas")
        void debeTener2Rondas() {
            assertEquals(2, RondaConfig.RONDAS_TEST.size());
        }

        @Test
        @DisplayName("ambas rondas deben requerir solo 1 pierna")
        void ambasRondasRequierenSoloUnaPierna() {
            RondaConfig ronda1 = RondaConfig.obtenerConfiguracion(1, true);
            RondaConfig ronda2 = RondaConfig.obtenerConfiguracion(2, true);

            assertEquals(1, ronda1.getPiernasRequeridas());
            assertEquals(0, ronda1.getEscalerasRequeridas());
            assertEquals(1, ronda2.getPiernasRequeridas());
            assertEquals(0, ronda2.getEscalerasRequeridas());
        }

        @Test
        @DisplayName("debe lanzar excepción para ronda 3 en modo test")
        void debeLanzarExcepcionParaRonda3() {
            assertThrows(IllegalArgumentException.class, () ->
                    RondaConfig.obtenerConfiguracion(3, true)
            );
        }

        @Test
        @DisplayName("obtenerRondas debe devolver la lista según el modo")
        void obtenerRondasSegunModo() {
            assertSame(RondaConfig.RONDAS_TEST, RondaConfig.obtenerRondas(true));
            assertSame(RondaConfig.RONDAS_CARIOCA, RondaConfig.obtenerRondas(false));
        }
    }

    @Nested
    @DisplayName("Validación de requisitos")
    class ValidacionRequisitos {

        @Test
        @DisplayName("ronda 1 debe requerir 2 piernas")
        void ronda1DebeRequerir2Piernas() {
            RondaConfig config = RondaConfig.obtenerConfiguracion(1, false);

            // Con 2 piernas debe cumplir
            List<Formacion> formacionesCumplen = crearFormaciones(2, 0);
            assertTrue(config.cumpleRequisitos(formacionesCumplen));

            // Con 1 pierna no debe cumplir
            List<Formacion> formacionesNoCumplen = crearFormaciones(1, 0);
            assertFalse(config.cumpleRequisitos(formacionesNoCumplen));
        }

        @Test
        @DisplayName("ronda 2 debe requerir 1 pierna + 1 escalera")
        void ronda2DebeRequerir1PiernaMas1Escalera() {
            RondaConfig config = RondaConfig.obtenerConfiguracion(2, false);

            // Con 1 pierna + 1 escalera debe cumplir
            List<Formacion> formacionesCumplen = crearFormaciones(1, 1);
            assertTrue(config.cumpleRequisitos(formacionesCumplen));

            // Con 2 piernas no debe cumplir (falta escalera)
            List<Formacion> formacionesNoCumplen = crearFormaciones(2, 0);
            assertFalse(config.cumpleRequisitos(formacionesNoCumplen));

            // Con 2 escaleras no debe cumplir (falta pierna)
            List<Formacion> formacionesNoCumplen2 = crearFormaciones(0, 2);
            assertFalse(config.cumpleRequisitos(formacionesNoCumplen2));
        }

        @Test
        @DisplayName("ronda 7 debe requerir 3 escaleras")
        void ronda7DebeRequerir3Escaleras() {
            RondaConfig config = RondaConfig.obtenerConfiguracion(7, false);

            // Con 3 escaleras debe cumplir
            List<Formacion> formacionesCumplen = crearFormaciones(0, 3);
            assertTrue(config.cumpleRequisitos(formacionesCumplen));

            // Con 2 escaleras no debe cumplir
            List<Formacion> formacionesNoCumplen = crearFormaciones(0, 2);
            assertFalse(config.cumpleRequisitos(formacionesNoCumplen));
        }

        @Test
        @DisplayName("debe permitir más formaciones de las requeridas")
        void debePermitirMasFormaciones() {
            RondaConfig config = RondaConfig.obtenerConfiguracion(1, false); // Requiere 2 piernas

            // Con 3 piernas también debe cumplir
            List<Formacion> formaciones = crearFormaciones(3, 0);
            assertTrue(config.cumpleRequisitos(formaciones));
        }

        @Test
        @DisplayName("getTotalFormacionesRequeridas debe sumar piernas y escaleras")
        void getTotalFormacionesRequeridas() {
            assertEquals(2, RondaConfig.obtenerConfiguracion(1, false).getTotalFormacionesRequeridas());
            assertEquals(2, RondaConfig.obtenerConfiguracion(2, false).getTotalFormacionesRequeridas());
            assertEquals(3, RondaConfig.obtenerConfiguracion(4, false).getTotalFormacionesRequeridas());
            assertEquals(3, RondaConfig.obtenerConfiguracion(7, false).getTotalFormacionesRequeridas());
        }
    }

    /**
     * Crea formaciones de prueba.
     */
    private List<Formacion> crearFormaciones(int piernas, int escaleras) {
        List<Formacion> formaciones = new ArrayList<>();

        for (int i = 0; i < piernas; i++) {
            List<Carta> cartas = List.of(
                    Carta.of(Valor.CINCO, Palo.CORAZONES),
                    Carta.of(Valor.CINCO, Palo.PICAS),
                    Carta.of(Valor.CINCO, Palo.DIAMANTES)
            );
            formaciones.add(Formacion.crear(TipoFormacion.PIERNA, cartas, "jugador-test"));
        }

        for (int i = 0; i < escaleras; i++) {
            List<Carta> cartas = List.of(
                    Carta.of(Valor.TRES, Palo.CORAZONES),
                    Carta.of(Valor.CUATRO, Palo.CORAZONES),
                    Carta.of(Valor.CINCO, Palo.CORAZONES)
            );
            formaciones.add(Formacion.crear(TipoFormacion.ESCALERA, cartas, "jugador-test"));
        }

        return formaciones;
    }
}
