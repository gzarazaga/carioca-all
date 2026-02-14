package com.carioca.infrastructure.adapter.in.websocket.message;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

/**
 * Mensaje genérico para comunicación WebSocket.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WebSocketMessage {

    private String tipo;
    private String partidaId;
    private Map<String, Object> payload;
    private long timestamp;
}
