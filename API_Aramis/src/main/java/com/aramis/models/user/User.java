package com.aramis.models.user;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity(name = "_user")
@Getter
@Setter
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long UserID;
    @Column(nullable = false, unique = true)
    private int Login;
    @Column(nullable = false)
    private String firstname;
    @Column(nullable = false)
    private String lastname;
    @Column(nullable = false)
    private boolean IsAdmin;
}
