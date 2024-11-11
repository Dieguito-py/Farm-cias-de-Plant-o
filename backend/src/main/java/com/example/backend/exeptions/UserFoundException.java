package com.example.backend.exeptions;

public class UserFoundException extends RuntimeException {
    public UserFoundException(String message) {
        super(message);
    }
}
