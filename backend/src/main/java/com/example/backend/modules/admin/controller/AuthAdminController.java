package com.example.backend.modules.admin.controller;

import com.example.backend.modules.admin.DTO.AdminRequestDTO;
import com.example.backend.modules.admin.useCases.AuthAdminUseCase;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin")
public class AuthAdminController {

    @Autowired
    private AuthAdminUseCase authAdminUseCase;

    @PostMapping("/auth")
    public ResponseEntity<Object> auth(@RequestBody AdminRequestDTO authCandidateRequestDTO) {
        try {
            var token = authAdminUseCase.execute(authCandidateRequestDTO);
            return ResponseEntity.ok().body(token);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("CNPJ ou senha incorretos.");
        }
    }
}