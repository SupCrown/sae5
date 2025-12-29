package com.aramis.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user")
public class AramisUserController {
    @GetMapping("/greet")
    public String greetTheUser() {
        return "Hello world";
    }
}
