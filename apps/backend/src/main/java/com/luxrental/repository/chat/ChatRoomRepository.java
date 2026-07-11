package com.luxrental.repository.chat;

import com.luxrental.entity.chat.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.List;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
    // Find available chat room by renterId, ownerId, and productId
    Optional<ChatRoom> findByRenterIdAndOwnerIdAndProductId(Long renterId, Long ownerId, Long productId);

    // Retrieve all chat rooms for a given renter or owner
    List<ChatRoom> findByRenterIdOrOwnerId(Long renterId, Long ownerId);
}
