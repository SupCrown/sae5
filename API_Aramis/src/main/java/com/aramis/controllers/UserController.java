package com.aramis.controllers;

import com.aramis.annotations.Authorize;
import com.aramis.dto.CreateUserRequest;
import com.aramis.dto.UserResponse;
import com.aramis.dto.UserStatsResponse;
import com.aramis.models.contain.Contain;
import com.aramis.models.contain.ContainRepository;
import com.aramis.models.order.Order;
import com.aramis.models.support.Support;
import com.aramis.models.support.SupportRepository;
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

import java.time.LocalDate;
import java.util.*;
import java.sql.Timestamp;

import static com.aramis.utils.Utils.getCurrentTimestamp;

@Slf4j
@RestController
@RequestMapping("/user")
public class UserController {

    private final UserRepository userRepository;
    private final SupportRepository supportRepository;
    private final ContainRepository containRepository;

    public UserController(UserRepository userRepository, SupportRepository supportRepository, ContainRepository containRepository) {
        this.userRepository = userRepository;
        this.supportRepository = supportRepository;
        this.containRepository = containRepository;
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

    @Authorize(roles = Role.ADMIN)
    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Integer id) {
        return userRepository.findById(id)
                .map(user -> ResponseEntity.ok(new UserResponse(user)))
                .orElse(ResponseEntity.notFound().build());
    }

    @Authorize(roles = Role.ADMIN)
    @GetMapping("/create")
    public ResponseEntity<CreateUserRequest> createForm() {
        return ResponseEntity.ok(new CreateUserRequest());
    }

    @Authorize(roles = Role.ADMIN)
    @PostMapping("/create")
    public ResponseEntity<Object> createUser(@Valid @RequestBody CreateUserRequest request) {
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

    @Authorize(roles = Role.ADMIN)
    @GetMapping("/update/{id}")
    public ResponseEntity<UserResponse> getForUpdate(@PathVariable Integer id) {
        Optional<User> user = userRepository.findById(id);
        return user.map(value -> ResponseEntity.ok(new UserResponse(value)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @Authorize(roles = Role.ADMIN)
    @PostMapping("/update/{id}")
    public ResponseEntity<UserResponse> update(@PathVariable Integer id, @Valid @RequestBody CreateUserRequest request) {
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
    @Authorize(roles = Role.ADMIN)
    @PostMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        userRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @Authorize(roles = {Role.ADMIN, Role.USER})
    @GetMapping("/stats/{id}")
    public ResponseEntity<Object> GetUserStats(@PathVariable Integer id) {
        try {
            Optional<User> user = userRepository.findById(id);
            if (user.isPresent()) {
                UserStatsResponse response = getUserStatsResponse(user.get());

                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            log.error("Error calculating user stats", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Bad Request: " + e.getMessage());
        }
    }

    @Authorize(roles = {Role.ADMIN, Role.USER})
    @GetMapping("/all/stats")
    public ResponseEntity<Object> GetAllUsersStats() {
        try {
            Iterable<User> users = userRepository.findAllNotAdmin();

            List<UserStatsResponse> usersStats = new ArrayList<>();
            for (User user : users) {
                usersStats.add(getUserStatsResponse(user));
            }

            return ResponseEntity.ok(usersStats);
        } catch (Exception e) {
            log.error("Error calculating users stats", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Bad Request: " + e.getMessage());
        }
    }

    private UserStatsResponse getUserStatsResponse(User user) {
        List<Support> preparedSupports = supportRepository.findAllByUser(user);

        List<Integer> supportIDs = new ArrayList<>();
        List<Order> preparedOrders = new ArrayList<>();
        for(Support support : preparedSupports) {
            supportIDs.add(support.getSupportID());

            Order order = support.getOrder();
            if (!preparedOrders.contains(order)) {
                preparedOrders.add(order);
            }
        }

        List<Support> dailyPreparedSupport = new ArrayList<>();
        List<Integer> dailySupportIDs = new ArrayList<>();
        List<Order> dailyPreparedOrders = new ArrayList<>();
        LocalDate currentDate = LocalDate.now();
        for(Support support : preparedSupports) {
            LocalDate supportPreparationDate = support.datePreparation.toLocalDate();
            if(supportPreparationDate.equals(currentDate) && !dailyPreparedSupport.contains(support)) {
                dailyPreparedSupport.add(support);
                dailySupportIDs.add(support.supportID);

                Order order = support.getOrder();
                if (!dailyPreparedOrders.contains(order)) {
                    dailyPreparedOrders.add(order);
                }
            }
        }

        int ordersNumberOfAllTime = preparedOrders.size();
        int supportsNumberOfAllTime = preparedSupports.size();
        int productsNumberOfAllTime = containRepository.findPlacedProductNumberSumBySupportsIDs(supportIDs);

        int ordersNumberOfTheDay = dailyPreparedOrders.size();
        int supportsNumberOfTheDay = dailyPreparedSupport.size();
        int productsNumberOfTheDay = containRepository.findPlacedProductNumberSumBySupportsIDs(dailySupportIDs);

        return new UserStatsResponse(
                new UserResponse(user),
                ordersNumberOfAllTime,
                supportsNumberOfAllTime,
                productsNumberOfAllTime,
                ordersNumberOfTheDay,
                supportsNumberOfTheDay,
                productsNumberOfTheDay
        );
    }
}
