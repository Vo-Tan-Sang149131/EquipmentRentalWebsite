package com.luxrental.repository.user;

import com.luxrental.entity.common.Role;
import com.luxrental.enums.RoleType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByRole(RoleType roleType);
}
