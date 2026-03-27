package com.aramis.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateUserRequest {
    @NotBlank
    private String firstname;
    @NotBlank
    private String lastname;
    @NotNull
    private Integer login;
    private boolean admin;
}
