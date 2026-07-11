package com.luxrental.controller.chat.dto.response;

import lombok.*;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatRoomResponse {
    private Long id;
    private Long renterId;
    private String renterName;
    private Long ownerId;
    private String ownerName;
    private Long productId;
    private String productName;
    private String productSlug;
    private Instant createdAt;
}
