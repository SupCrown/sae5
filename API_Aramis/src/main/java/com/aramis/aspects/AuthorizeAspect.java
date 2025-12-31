package com.aramis.aspects;

import com.aramis.annotations.Authorize;
import com.aramis.configurations.AppConfigurationProperties;
import com.aramis.services.AuthService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.util.WebUtils;

import java.nio.file.AccessDeniedException;

@Slf4j
@Aspect
@Component
public class AuthorizeAspect {
    private final AppConfigurationProperties properties;
    private final AuthService authService;

    public AuthorizeAspect(AppConfigurationProperties properties, AuthService authService) {
        this.properties = properties;
        this.authService= authService;
    }

    @Pointcut("@annotation(com.aramis.annotations.Authorize)")
    private void authorize() {
    }


    @Around(
        value = "@annotation(authorize) && execution(* com.aramis..*(..))",
        argNames = "pjp,authorize"
    )
    public Object doSomething(ProceedingJoinPoint pjp, Authorize authorize) throws Throwable {
        HttpServletRequest req = getRequest();

        try {
            Cookie authCookie = WebUtils.getCookie(req, properties.getCookie().getName());

            if (authCookie == null) {
                return ResponseEntity.status(401).body("Authentication failed: No authentication token detected.");
            } else {
                String jwt = authCookie.getValue();
                authService.validateAuthToken(jwt, authorize.roles());
            }
        } catch (AccessDeniedException e) {
            log.error("Access denied");
            return ResponseEntity.status(403).body("Access denied");
        } catch (Exception e) {
            log.error("Error authenticating user", e);
            return ResponseEntity.status(401).body("Authentication failed: " + e.getMessage());
        }

        return pjp.proceed();
    }

    private HttpServletRequest getRequest() {
        ServletRequestAttributes sra = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        return sra.getRequest();
    }
}
