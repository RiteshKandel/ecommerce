package com.example.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private UserRepository userRepository;

    @PostMapping("/signup")
    public Map<String, String> signup(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String password = payload.get("password");
        Optional<User> existing = userRepository.findByEmailIgnoreCase(email);
        Map<String, String> response = new HashMap<>();
        if (existing.isPresent()) {
            response.put("status", "error");
            response.put("message", "Email already registered");
            return response;
        }
        User user = new User(null, email, password);
        userRepository.save(user);
        response.put("status", "success");
        response.put("token", email);
        return response;
    }

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String password = payload.get("password");
        Optional<User> user = userRepository.findByEmailIgnoreCaseAndPassword(email, password);
        Map<String, String> response = new HashMap<>();
        if (user.isPresent()) {
            response.put("status", "success");
            response.put("token", email);
        } else {
            response.put("status", "error");
            response.put("message", "Invalid email or password");
        }
        return response;
    }

    @GetMapping("/profile")
    public User getProfile(@RequestParam String email) {
        return userRepository.findByEmailIgnoreCase(email).orElse(null);
    }

    @PostMapping("/profile")
    public Map<String, String> updateProfile(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String newEmail = payload.get("newEmail");
        String newPassword = payload.get("newPassword");
        Map<String, String> response = new HashMap<>();
        Optional<User> userOpt = userRepository.findByEmailIgnoreCase(email);
        if (userOpt.isEmpty()) {
            response.put("status", "error");
            response.put("message", "User not found");
            return response;
        }
        User user = userOpt.get();
        if (newEmail != null && !newEmail.isBlank()) {
            user.setEmail(newEmail);
        }
        if (newPassword != null && !newPassword.isBlank()) {
            user.setPassword(newPassword);
        }
        userRepository.save(user);
        response.put("status", "success");
        response.put("email", user.getEmail());
        return response;
    }
} 