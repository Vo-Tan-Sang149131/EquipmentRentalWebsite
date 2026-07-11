package com.luxrental.service.user.mapper;

import com.luxrental.controller.auth.dto.request.RegisterRequest;
import com.luxrental.controller.user.dto.response.UserResponse;
import com.luxrental.entity.common.Role;
import com.luxrental.entity.user.User;
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
