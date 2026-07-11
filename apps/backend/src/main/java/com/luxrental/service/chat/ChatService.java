package com.luxrental.service.chat;

import com.luxrental.controller.chat.dto.request.ChatMessageRequest;
import com.luxrental.controller.chat.dto.response.ChatMessageResponse;
import com.luxrental.controller.chat.dto.request.ChatRoomRequest;
import com.luxrental.controller.chat.dto.response.ChatRoomResponse;
import com.luxrental.entity.chat.ChatMessage;
import com.luxrental.entity.chat.ChatRoom;
import com.luxrental.entity.product.Product;
import com.luxrental.entity.user.User;
import com.luxrental.repository.chat.ChatMessageRepository;
import com.luxrental.repository.chat.ChatRoomRepository;
import com.luxrental.repository.product.ProductRepository;
import com.luxrental.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ChatService {

    private final ChatRoomRepository chatRoomRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    /**
     * Find an existing chat, otherwise create a new one
     */
    @Transactional
    public ChatRoomResponse getOrCreateChatRoom(Long currentUserId, ChatRoomRequest request) {
        // Check if a chat room already exists between the renter and owner, using the product ID
        Optional<ChatRoom> existingRoom = chatRoomRepository.findByRenterIdAndOwnerIdAndProductId(
            currentUserId, request.getOwnerId(), request.getProductId());

        if (existingRoom.isPresent()) {
            return mapToChatRoomResponse(existingRoom.get());
        }

        // If no existing room, create a new one
        User renter = userRepository.findById(currentUserId)
            .orElseThrow(() -> new RuntimeException("Renter not found with ID: " + currentUserId));

        User owner = userRepository.findById(request.getOwnerId())
            .orElseThrow(() -> new RuntimeException("Owner not found with ID: " + request.getOwnerId()));

        Product product = productRepository.findById(request.getProductId())
            .orElseThrow(() -> new RuntimeException("Product not found with ID: " + request.getProductId()));

        ChatRoom newRoom = ChatRoom.builder()
            .renter(renter)
            .owner(owner)
            .product(product)
            .build();

        ChatRoom savedRoom = chatRoomRepository.save(newRoom);
        return mapToChatRoomResponse(savedRoom);
    }

    /**
     * Retrieve all chat rooms for a user, including both renter and owner
     */
    public List<ChatRoomResponse> getChatRoomsForUser(Long userId) {
        List<ChatRoom> rooms = chatRoomRepository.findByRenterIdOrOwnerId(userId, userId);
        return rooms.stream()
            .map(this::mapToChatRoomResponse)
            .collect(Collectors.toList());
    }

    /**
     * Retrieve chat history for a specific room
     */
    public List<ChatMessageResponse> getMessagesInRoom(Long roomId) {
        List<ChatMessage> messages = chatMessageRepository.findByRoomIdOrderByCreatedAtAsc(roomId);
        return messages.stream()
            .map(this::mapToChatMessageResponse)
            .collect(Collectors.toList());
    }

    /**
     * Store a new message in the database
     */
    @Transactional
    public ChatMessageResponse saveMessage(String username, ChatMessageRequest request) {
        ChatRoom room = chatRoomRepository.findById(request.getRoomId())
            .orElseThrow(() -> new RuntimeException("Chat room not found with ID: " + request.getRoomId()));

        User sender = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("Sender not found with ID: " + username));

        ChatMessage newMessage = ChatMessage.builder()
            .room(room)
            .sender(sender)
            .messageText(request.getMessageText())
            .isRead(false)
            .build();

        ChatMessage savedMessage = chatMessageRepository.save(newMessage);
        return mapToChatMessageResponse(savedMessage);
    }

    // --- Helper methods to map entities to responses---

    private ChatRoomResponse mapToChatRoomResponse(ChatRoom room) {
        return ChatRoomResponse.builder()
            .id(room.getId())
            .renterId(room.getRenter().getId())
            .renterName(room.getRenter().getFullName()) // Alternative: room.getRenter().getUsername()
            .ownerId(room.getOwner().getId())
            .ownerName(room.getOwner().getFullName())
            .productId(room.getProduct().getId())
            .productName(room.getProduct().getName())
            .productSlug(room.getProduct().getSlug())
            .createdAt(room.getCreatedAt())
            .build();
    }

    private ChatMessageResponse mapToChatMessageResponse(ChatMessage message) {
        return ChatMessageResponse.builder()
            .id(message.getId())
            .roomId(message.getRoom().getId())
            .senderId(message.getSender().getId())
            .senderName(message.getSender().getFullName())
            .messageText(message.getMessageText())
            .isRead(message.getIsRead())
            .createdAt(message.getCreatedAt())
            .build();
    }
}
