package com.luxrental.entity.user;

import com.luxrental.entity.BaseEntity;
import com.luxrental.entity.cart.CartItem;
import com.luxrental.entity.device.Device;
import com.luxrental.entity.common.Role;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.io.Serial;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class User extends BaseEntity implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @Column(name = "user_name", nullable = false, unique = true)
    private String username;

    @Column(nullable = true)
    private String password;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "phone_number", nullable = true, unique = true, length = 15)
    private String phoneNumber;

    @Column(name = "avatar_url", length = 255)
    private String avatarUrl;

    @Column(name = "trust_score", precision = 3, scale = 2)
    private BigDecimal trustScore;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "user_roles",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    @Builder.Default
    private Set<Role> roles = new HashSet<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @Builder.Default
    private Set<UserSocialAccount> socialAccounts = new HashSet<>();

    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL)
    @Builder.Default
    private Set<Device> ownedItems = new HashSet<>();

    @Column(nullable = false)
    @Builder.Default
    private boolean enabled = false;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    @PrimaryKeyJoinColumn // This is needed to make the foreign key column the primary key
    private UserProfile profile;


    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<UserKycVerification> kycVerifications = new HashSet<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<CartItem> cartItems = new HashSet<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<UserAddress> addresses = new HashSet<>();
}
