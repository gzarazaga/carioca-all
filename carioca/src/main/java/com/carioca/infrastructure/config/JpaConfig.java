package com.carioca.infrastructure.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

/**
 * Configuración de JPA.
 */
@Configuration
@EnableJpaRepositories(basePackages = "com.carioca.infrastructure.adapter.out.persistence.repository")
public class JpaConfig {
    // Configuración adicional de JPA si es necesaria
}
