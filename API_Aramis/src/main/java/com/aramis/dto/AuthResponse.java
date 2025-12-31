package com.aramis.dto;


import com.aramis.common.UserType;
import com.aramis.utils.Role;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class AuthResponse {
    private String username;
    private UserType userType;
    private Role role;
    private String token;
}
