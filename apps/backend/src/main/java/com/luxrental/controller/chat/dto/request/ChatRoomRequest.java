package com.luxrental.controller.chat.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatRoomRequest {
    @NotNull(message = "Owner ID cannot be null")
    private Long ownerId;

    @NotNull(message = "Product ID cannot be null")
    private Long productId;
}
