package com.aramis.controllers;

import com.aramis.annotations.Authorize;
import com.aramis.configurations.AppConfigurationProperties;
import com.aramis.dto.CreateUserRequest;
import com.aramis.dto.UserResponse;
import com.aramis.models.user.User;
import com.aramis.models.user.UserRepository;
import com.aramis.services.AuthService;
import com.aramis.utils.Role;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.actuate.health.HttpCodeStatusMapper;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.WebUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Slf4j
@RestController
@RequestMapping("/user")
public class UserController {

    private final AppConfigurationProperties properties;
    private final AuthService authService;
    private final UserRepository userRepository;
    private final HttpServletRequest request;

    public UserController(AppConfigurationProperties properties, AuthService authService, UserRepository userRepository, HttpServletRequest request) {
    this.properties = properties;
        this.authService = authService;
        this.userRepository = userRepository;
        this.request = request;
    }

    @Authorize(roles = Role.ADMIN)
    @GetMapping("/all")
    public ResponseEntity<List<UserResponse>> getUsers(@PageableDefault(size = 20, sort = {"lastname", "firstname"}) Pageable pageable) {
        var users = userRepository.findAll(pageable);

        List<UserResponse> userResponseList = new ArrayList<>();
        for (User user : users) {
            userResponseList.add(new UserResponse(user));
        }
        return ResponseEntity.status(200).body(userResponseList) ;
    }

    @Authorize(roles = {Role.ADMIN, Role.USER})
    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Integer id) {

        return userRepository.findById(id)
            .map(user -> ResponseEntity.ok(new UserResponse(user)))
            .orElse(ResponseEntity.notFound().build());
    }

    @Authorize(roles = Role.ADMIN)
    @PostMapping("/add")
    public ResponseEntity<Object>  addNewUser (@Valid @RequestBody CreateUserRequest request) {

        User user = new User();
        user.setFirstname(request.getFirstname());
        user.setLastname(request.getLastname());
        user.setLogin(request.getLogin());

        try {
            User savedUser = userRepository.save(user);

            UserResponse response = new UserResponse(
                    savedUser.getUserID(),
                    savedUser.getFirstname(),
                    savedUser.getLastname(),
                    savedUser.getLogin(),
                    savedUser.isIsAdmin()
            );

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(response);
        } catch (Exception e) {
            log.error("Error authenticating user", e);
            return ResponseEntity.status(400).body("Bad Request: " + e.getMessage());
        }

    }
}
