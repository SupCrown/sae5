package com.aramis.controllers;

import com.aramis.dto.CreateUserRequest;
import com.aramis.dto.UserResponse;
import com.aramis.models.user.User;
import com.aramis.models.user.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.util.Optional;

@RestController
@RequestMapping("/preparer")
public class PreparerController {

    private final UserRepository userRepository;

    public PreparerController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/create")
    public ResponseEntity<CreateUserRequest> createForm() {
        return ResponseEntity.ok(new CreateUserRequest());
    }

    @PostMapping("/create")
    public ResponseEntity<UserResponse> create(@RequestBody CreateUserRequest request) {
        Timestamp now = new Timestamp(System.currentTimeMillis());

        User user = new User();
        user.setFirstname(request.getFirstname());
        user.setLastname(request.getLastname());
        user.setLogin(request.getLogin());
        user.setAdmin(false);

        User saved = userRepository.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(new UserResponse(saved));
    }

    @GetMapping("/update/{id}")
    public ResponseEntity<UserResponse> getForUpdate(@PathVariable Integer id) {
        Optional<User> user = userRepository.findById(id);
        return user.map(value -> ResponseEntity.ok(new UserResponse(value)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/update/{id}")
    public ResponseEntity<UserResponse> update(@PathVariable Integer id, @RequestBody CreateUserRequest request) {
        Optional<User> existingOpt = userRepository.findById(id);
        if (existingOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User existing = existingOpt.get();
        existing.setFirstname(request.getFirstname());
        existing.setLastname(request.getLastname());
        existing.setLogin(request.getLogin());

        User saved = userRepository.save(existing);
        return ResponseEntity.ok(new UserResponse(saved));
    }

    @PostMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        userRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getById(@PathVariable Integer id) {
        Optional<User> user = userRepository.findById(id);
        return user.map(value -> ResponseEntity.ok(new UserResponse(value)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}

