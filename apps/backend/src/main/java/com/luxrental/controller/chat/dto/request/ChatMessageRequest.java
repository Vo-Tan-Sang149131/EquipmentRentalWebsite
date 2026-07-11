package com.luxrental.controller.chat.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessageRequest {
    @NotNull(message = "Room ID cannot be null")
    private Long roomId;

    @NotBlank(message = "Message content cannot be blank")
    private String messageText;
}
