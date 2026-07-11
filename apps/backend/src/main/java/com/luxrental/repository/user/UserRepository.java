package com.luxrental.repository.user;

import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.luxrental.entity.user.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    boolean existsByPhoneNumber(String phoneNumber);

    // Find a user by social provider and user ID
    @Query("SELECT u FROM User u JOIN u.socialAccounts s WHERE s.provider = :provider AND s.providerUserId = :providerUserId")
    Optional<User> findBySocialProviderAndUserId(@Param("provider") String provider, @Param("providerUserId") String providerUserId);

    // Find user with roles and others information
    @EntityGraph(attributePaths = {"roles", "kycVerifications", "profile", "addresses"})
    Optional<User> findUserWithFullDetailsByUsername(@Param("username") String username);

}
