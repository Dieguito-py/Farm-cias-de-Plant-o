package com.example.backend.modules.admin.controller;

import com.example.backend.exeptions.UserFoundException;
import com.example.backend.modules.admin.entities.AdminEntity;
import com.example.backend.modules.admin.useCases.CreatAdminUseCase;
import com.example.backend.modules.admin.useCases.ProfileAdminUseCase;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private CreatAdminUseCase createCandidateUseCase;
    @Autowired
    private ProfileAdminUseCase profileCandidateUseCase;


    @PostMapping("/")
    public ResponseEntity<Object> create(@Valid @RequestBody AdminEntity adminEntity) {
        try {
            var result = this.createCandidateUseCase.execute(adminEntity);
            return ResponseEntity.ok(result);
        } catch (UserFoundException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/")
    public ResponseEntity<Object> get(HttpServletRequest httpServletRequest) {
        var candidateId = httpServletRequest.getAttribute("candidateId");
        try {
            var profile = profileCandidateUseCase.execute(String.valueOf(UUID.fromString(candidateId.toString())));
            return ResponseEntity.ok(profile);
        } catch (UserFoundException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}