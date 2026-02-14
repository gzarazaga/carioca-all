package com.carioca.infrastructure.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;
import java.util.List;

/**
 * Configuración de CORS.
 */
@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();

        // Orígenes permitidos
        config.setAllowedOrigins(Arrays.asList(
                "http://localhost:4200",  // Angular
                "http://localhost:3000",  // React
                "http://localhost:5173"   // Vite
        ));

        // Métodos permitidos
        config.setAllowedMethods(Arrays.asList(
                "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"
        ));

        // Headers permitidos
        config.setAllowedHeaders(List.of("*"));

        // Permitir credenciales
        config.setAllowCredentials(true);

        // Tiempo de cache para preflight
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", config);
        source.registerCorsConfiguration("/ws/**", config);

        return new CorsFilter(source);
    }
}
