package com.luxrental.repository.identification;

import com.luxrental.entity.user.UserKycVerification;
import org.springframework.data.jpa.repository.JpaRepository;

public interface KycRepository extends JpaRepository<UserKycVerification, Long> {
}
