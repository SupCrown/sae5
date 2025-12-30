package com.aramis.controllers;

import com.aramis.models.user.User;
import com.aramis.models.user.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/greet")
    public String greetTheUser() {
        return "Hello world";
    }

    @GetMapping("/getall")
    public @ResponseBody List<User> getAll() {
        return (List<User>) userRepository.findAll();
    }

    @PostMapping("/add")
    public @ResponseBody String addNewUser (@RequestParam String firstname, @RequestParam String lastname, @RequestParam int login) {

        User user = new User();
        user.setFirstname(firstname);
        user.setLastname(lastname);
        user.setLogin(login);
        userRepository.save(user);
        return "Saved";
    }
}
