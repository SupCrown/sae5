package com.aramis.common;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;

@Slf4j
@Component
public class JwtUtils {

    public static Claims getPayload(String jwt, SecretKey secretKey) {
        Objects.requireNonNull(secretKey, "Secret key must not be null");

        try {
            if (Objects.isNull(jwt)) {
                throw new IllegalArgumentException("Authentication token is missing.");
            }

            return Jwts.parser()
                    .verifyWith(secretKey)
                    .clockSkewSeconds(10)
                    .build()
                    .parseSignedClaims(jwt)
                    .getPayload();
        } catch (SignatureException e) {
            throw new IllegalArgumentException("Authentication token is invalid.", e);
        } catch (ExpiredJwtException e) {
            throw new IllegalArgumentException("Authentication token has expired.", e);
        }
    }

    public static String generateToken(String subject, String audience, Map<String, ?> claims, int expiresIn,
                                SecretKey secretKey) {
        validateInputs(subject, audience, secretKey);

        Date issuedAt = new Date();
        Date expiration = new Date(issuedAt.getTime() + expiresIn * 1000L);

        log.debug("Generating JWT token for subject: {}, audience: {}, issuedAt: {}, expiresIn: {} seconds",
                subject, audience, issuedAt, expiresIn);

        return Jwts.builder()
                .subject(subject)
                .id(UUID.randomUUID().toString())
                .claims(claims)
                .audience()
                .add(audience)
                .and()
                .issuedAt(issuedAt)
                .notBefore(issuedAt)
                .expiration(expiration)
                .signWith(secretKey)
                .compact();
    }

    public static SecretKey generateSecretKey(String signingKey) {
        if (Objects.isNull(signingKey) || signingKey.trim().isEmpty()) {
            throw new IllegalArgumentException("Authentication signing key is missing.");
        }
        return Keys.hmacShaKeyFor(signingKey.getBytes(StandardCharsets.UTF_8));
    }

    private static void validateInputs(String subject, String audience, SecretKey secretKey) {
        Objects.requireNonNull(subject, "Token subject must not be null");
        Objects.requireNonNull(audience, "Token audience must not be null");
        Objects.requireNonNull(secretKey, "Secret key must not be null");
    }
}
