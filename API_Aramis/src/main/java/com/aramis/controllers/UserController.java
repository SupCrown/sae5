package com.aramis.controllers;

import com.aramis.annotations.Authorize;
import com.aramis.dto.CreateUserRequest;
import com.aramis.dto.UserResponse;
import com.aramis.models.user.User;
import com.aramis.models.user.UserRepository;
import com.aramis.utils.Role;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import static com.aramis.utils.Utils.getCurrentTimestamp;

@Slf4j
@RestController
@RequestMapping("/user")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Authorize(roles = Role.ADMIN)
    @GetMapping("/all")
    public ResponseEntity<List<UserResponse>> getUsers(@PageableDefault(size = 20, sort = {"lastname", "firstname"}) Pageable pageable) {
        var users = userRepository.findAll(pageable);

        List<UserResponse> userResponseList = new ArrayList<>();
        for (User user : users) {
            userResponseList.add(new UserResponse(user));
        }
        return ResponseEntity.ok(userResponseList);
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
    public ResponseEntity<Object> addNewUser(@Valid @RequestBody CreateUserRequest request) {

        User user = new User();
        user.setFirstname(request.getFirstname());
        user.setLastname(request.getLastname());
        user.setLogin(request.getLogin());
        user.setDateCreation(getCurrentTimestamp());
        user.setDateModification(getCurrentTimestamp());

        try {
            User savedUser = userRepository.save(user);

            UserResponse response = new UserResponse(
                    savedUser.getUserID(),
                    savedUser.getFirstname(),
                    savedUser.getLastname(),
                    savedUser.getLogin(),
                    savedUser.isAdmin()
            );

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(response);
        } catch (Exception e) {
            log.error("Error authenticating user", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Bad Request: " + e.getMessage());
        }

    }
}
