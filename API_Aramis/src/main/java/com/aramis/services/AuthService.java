package com.aramis.services;

import com.aramis.common.JwtUtils;
import com.aramis.common.UserType;
import com.aramis.configurations.AppConfigurationProperties;
import com.aramis.dto.AuthRequest;
import com.aramis.dto.AuthResponse;
import com.aramis.models.user.User;
import com.aramis.models.user.UserRepository;
import com.aramis.utils.Role;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;


@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {
    private final JwtUtils jwtUtils;
    private final AppConfigurationProperties properties;

    public AuthResponse authenticate(AuthRequest request, UserRepository userRepository) {
        validateAuthRequest(request);
        Integer login = request.getLogin();

        User user = userRepository.findByLogin(login);

        if (user == null) {
            log.error("Invalid login : {}", login);
            throw new RuntimeException("Invalid login");
        }

        var userType = user.isIsAdmin() ? UserType.SUPERVISOR : UserType.PREPARATOR;
        var role = user.isIsAdmin() ? Role.ADMIN : Role.USER;

        var secretKey = jwtUtils.generateSecretKey(properties.getJwt().getSecret());

        Map<String, String> claims = new HashMap<>();
        claims.put("userType", userType.toString());
        claims.put("role", role.toString());

        String audience = String.valueOf(user.getUserID());

        String username = user.getFirstname() + " " + user.getLastname();

        String token = jwtUtils.generateToken(username, audience, claims, properties.getJwt().getExpiresIn(), secretKey);
        return AuthResponse.builder().username(username).userType(userType).role(role).token(token).build();
    }

    private void validateAuthRequest(AuthRequest request) {
        Objects.requireNonNull(request, "Login cannot be null");
        Objects.requireNonNull(request.getLogin(), "Login cannot be null");
    }


    public void validateAuthToken(String jwt, Role[] roles) throws AccessDeniedException, RuntimeException {
        var secretKey = jwtUtils.generateSecretKey(properties.getJwt().getSecret());
        try {
            var payload = jwtUtils.getPayload(jwt, secretKey);

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
}