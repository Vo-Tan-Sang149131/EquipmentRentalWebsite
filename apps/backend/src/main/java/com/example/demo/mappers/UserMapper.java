package com.example.demo.mappers;

import com.example.demo.dto.auth.request.RegisterRequest;
import com.example.demo.dto.user.response.UserResponse;
import com.example.demo.entity.Role;
import com.example.demo.entity.User;
import org.mapstruct.Mapper;

import java.util.Set;
import java.util.stream.Collectors;


// Set unmappedTargetPolicy to IGNORE to ignore unmapped properties
@Mapper(componentModel = "spring", unmappedTargetPolicy = org.mapstruct.ReportingPolicy.IGNORE)
public interface UserMapper {

    UserResponse mapToResponse(User user);

    User mapToEntity(RegisterRequest request);

    default Set<String> mapRoles(Set<Role> roles) {
        if (roles == null) {
            return null;
        }
        return roles.stream()
            .map(role -> role.getRole().name()) // Use name to convert enum to string
            .collect(Collectors.toSet());
    }

}
