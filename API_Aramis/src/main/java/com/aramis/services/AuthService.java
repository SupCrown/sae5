package com.aramis.services;

import com.aramis.common.JwtUtils;
import com.aramis.common.UserType;
import com.aramis.configurations.AppConfigurationProperties;
import com.aramis.dto.AuthRequest;
import com.aramis.dto.AuthResponse;
import com.aramis.models.user.User;
import com.aramis.models.user.UserRepository;
import com.aramis.utils.Role;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.util.WebUtils;

import java.nio.file.AccessDeniedException;
import java.util.*;

import static com.aramis.common.JwtUtils.*;


@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {
    private final AppConfigurationProperties properties;

    public AuthResponse authenticate(AuthRequest request, UserRepository userRepository) {
        validateAuthRequest(request);
        Integer login = request.getLogin();

        Optional<User> userOpt = userRepository.findByLogin(login);

        if (userOpt.isEmpty()) {
            log.error("Invalid login : {}", login);
            throw new RuntimeException("Invalid login");
        }
        User user = userOpt.get();

        var userType = user.isAdmin() ? UserType.SUPERVISOR : UserType.PREPARATOR;
        var role = user.isAdmin() ? Role.ADMIN : Role.USER;

        var secretKey = generateSecretKey(properties.getJwt().getSecret());

        Map<String, String> claims = new HashMap<>();
        claims.put("userType", userType.toString());
        claims.put("role", role.toString());
        claims.put("id", user.getUserID().toString());

        String audience = String.valueOf(user.getUserID());

        String username = user.getFirstname() + " " + user.getLastname();

        String token = generateToken(username, audience, claims, properties.getJwt().getExpiresIn(), secretKey);
        return AuthResponse.builder().username(username).userType(userType).role(role).token(token).userID(user.getUserID()).build();
    }

    private void validateAuthRequest(AuthRequest request) {
        Objects.requireNonNull(request, "Login cannot be null");
        Objects.requireNonNull(request.getLogin(), "Login cannot be null");
    }


    public void validateAuthToken(String jwt, Role[] roles) throws AccessDeniedException, RuntimeException {
        var secretKey = generateSecretKey(properties.getJwt().getSecret());
        try {
            var payload = getPayload(jwt, secretKey);

            boolean accessDenied = true;
            for (Role role : roles) {
                accessDenied = accessDenied && !payload.get("role").equals(role.toString());
            }

            if (accessDenied) {
                log.error("Access denied for {}", payload.get("role"));
                throw new AccessDeniedException("Access denied");
            }
        } catch (AccessDeniedException e) {
            throw e;
        } catch (Exception e) {
            log.error("Authentication failed. Invalid token : {}", jwt);
            throw new RuntimeException(String.format("Authentication failed. Invalid token : %s", jwt));
        }
    }

    public static Integer getUserID(HttpServletRequest req, AppConfigurationProperties properties) throws RuntimeException {
        Cookie authCookie = WebUtils.getCookie(req, properties.getCookie().getName());

        if (authCookie == null) {
            throw new RuntimeException("Aucun cookie de connexion détécté.");
        }

        String jwt = authCookie.getValue();
        var secretKey = generateSecretKey(properties.getJwt().getSecret());

        var payload = getPayload(jwt, secretKey);
        String id = (String) payload.get("id");

        if (id == null) {
            log.error("UserID is missing in auth token.");
            throw new MissingResourceException("UserID is missing.", "AuthResponse", "UserID");
        }

        return Integer.valueOf(id);
    }
}