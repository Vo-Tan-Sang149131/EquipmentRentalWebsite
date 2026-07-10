package com.example.demo.entity;

import com.example.demo.enumValues.UserGender;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDate;

@Entity
@Table(name = "user_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class UserProfile implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    private Long userId;

    @Enumerated(EnumType.STRING)
    private UserGender gender;

    private LocalDate dob;

    private String address;

    @Column(name = "bio", columnDefinition = "TEXT")
    private String bio;

    @OneToOne
    @MapsId // This annotation maps the id of the UserProfile entity to the id of the User entity
    @JoinColumn(name = "user_id")
    private User user;
}
