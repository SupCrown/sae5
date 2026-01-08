package com.aramis.dto;

import com.aramis.models.user.User;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserResponse {
    private Long id;
    private String firstname;
    private String lastname;
    private Integer login;
    private boolean admin;

    public UserResponse(User user) {
        this.id = user.getUserID();
        this.firstname = user.getFirstname();
        this.lastname = user.getLastname();
        this.login = user.getLogin();
        this.admin = user.isIsAdmin();
    }
}
