package com.luxrental.repository.chat;

import com.luxrental.entity.chat.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    // Retrieve chat messages by room ID, ordered by creation date
    List<ChatMessage> findByRoomIdOrderByCreatedAtAsc(Long roomId);
}
