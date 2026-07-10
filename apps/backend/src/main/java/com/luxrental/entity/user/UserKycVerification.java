package com.luxrental.entity.user;

import com.luxrental.config.crypto.AesDataConverter;
import com.luxrental.entity.BaseEntity;
import com.luxrental.enums.KycStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.io.Serial;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_kyc_verifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class UserKycVerification extends BaseEntity {

    @Serial
    private static final long serialVersionUID = 1L;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Convert(converter = AesDataConverter.class) // Encrypt the ID card number
    @Column(name = "id_card_number")
    private String idCardNumber;

    @Column(name = "id_card_front_url")
    private String idCardFrontUrl;

    @Column(name = "id_card_back_url")
    private String idCardBackUrl;

    @Enumerated(EnumType.STRING)
    private KycStatus status;

    @Column(name = "verified_by")
    private Long verified_by;

    @Column(name = "verified_at")
    private LocalDateTime verifiedAt;
}
