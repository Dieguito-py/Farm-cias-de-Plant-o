package com.example.backend.providers;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTDecodeException;
import com.auth0.jwt.exceptions.SignatureVerificationException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class JWTProvider {

    @Value("${jwt.secret}")
    private String secret;

    public String validateToken(String token) {
        try {
            // Check if the token is in the correct format
            JWT.require(Algorithm.HMAC256(secret)).build().verify(token);
            return JWT.decode(token).getSubject();
        } catch (JWTDecodeException | SignatureVerificationException e) {
            // Log the error and return an empty string
            System.err.println("Invalid token format: " + token);
            return "";
        }
    }
}