package com.carioca.infrastructure.exception;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;

/**
 * Respuesta de error estándar para la API.
 */
@Data
@Builder
public class ErrorResponse {

    private Instant timestamp;
    private int status;
    private String error;
    private String message;
    private String path;
}
