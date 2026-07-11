package com.luxrental.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.io.Serial;
import java.io.Serializable;
import java.time.Instant; // Use Instant instead of LocalDateTime


@Getter
@Setter
@NoArgsConstructor // Required for JPA
@AllArgsConstructor
@SuperBuilder
@MappedSuperclass
@EqualsAndHashCode(onlyExplicitlyIncluded = true) // Only calculate hashCode for explicitly included fields
public abstract class BaseEntity implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include // Force hashCode calculation for this field
    protected Long id;

    @Column(name = "created_at", nullable = false, updatable = false)
    protected Instant createdAt; // Use Instant instead of LocalDateTime for store time UTC

    @Column(name = "updated_at")
    protected Instant updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
        updatedAt = Instant.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = Instant.now();
    }
}
