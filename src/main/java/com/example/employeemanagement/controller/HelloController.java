package com.example.employeemanagement.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {

    @GetMapping("/hello")
    public String hello() {
        return "Hello, Kishore!";
    }
    
    @GetMapping("/welcome")
    public String welcome() {
        return "Welcome to Spring Boot!";
    }
    
    @GetMapping("/java")
    public String java() {
        return "I am learning Java!";
    }
}