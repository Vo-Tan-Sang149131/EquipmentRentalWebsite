package com.luxrental.repository.user;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.luxrental.entity.user.UserSocialAccount;

@Repository
public interface UserSocialAccountRepository extends JpaRepository<UserSocialAccount, Long> {

    // Find user social account by provider and provider user id
    Optional<UserSocialAccount> findByProviderAndProviderUserId(String provider, String providerUserId);

    // Check if a social account already exists for the given provider and user id
    boolean existsByProviderAndProviderUserId(String provider, String providerUserId);
}
