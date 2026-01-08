package com.aramis.configurations;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

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