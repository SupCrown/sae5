package com.aramis.configurations;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "com.group.project") //provide proper prefix
public class AppConfigurationProperties {
    private JwtConfiguration jwt;
    private CookieConfiguration cookie;

    @Getter
    @Setter
    public static class JwtConfiguration {
        private String secret;
        private int expiresIn;
    }

    @Getter
    @Setter
    public static class CookieConfiguration {
        private String name;
        private int expiresIn;
    }
}