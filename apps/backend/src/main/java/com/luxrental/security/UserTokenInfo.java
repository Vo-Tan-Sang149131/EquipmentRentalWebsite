package com.luxrental.security;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserTokenInfo {
    private String username;
    private String email;
    private List<String> roles;
}
