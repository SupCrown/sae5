package com.aramis.controllers;

import com.aramis.configurations.AppConfigurationProperties;
import com.aramis.dto.AuthRequest;
import com.aramis.models.user.UserRepository;
import com.aramis.services.AuthService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.apache.tomcat.util.http.SameSiteCookies;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
public class AuthenticationController {

    private final AppConfigurationProperties properties;
    private final AuthService authService;
    private final UserRepository userRepository;
    private final HttpServletResponse response;

    public AuthenticationController(UserRepository userRepository, AppConfigurationProperties properties, AuthService authService, HttpServletResponse response) {
        this.properties = properties;
        this.authService = authService;
        this.userRepository = userRepository;
        this.response = response;
    }

    @PostMapping("/login")
    public ResponseEntity<Object> login(@RequestBody AuthRequest request) {
        try {
            var auth = authService.authenticate(request, userRepository);

            // Create secure cookie
            ResponseCookie cookie = ResponseCookie.from(properties.getCookie().getName(), auth.getToken())
                    .httpOnly(true)
                    .secure(true)
                    .path("/")
                    .maxAge(properties.getCookie().getExpiresIn())
                    .sameSite(SameSiteCookies.NONE.toString())
                    .build();

            response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

            return ResponseEntity.ok(auth);
        } catch (Exception e) {
            log.error("Error authenticating user", e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authentication failed: " + e.getMessage());
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout() {
        // Create cookie with no lifetime
        ResponseCookie cookie = ResponseCookie.from(properties.getCookie().getName(), "")
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(0)
                .sameSite(SameSiteCookies.STRICT.toString())
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        return ResponseEntity.ok("Logout successful.");
    }
}
