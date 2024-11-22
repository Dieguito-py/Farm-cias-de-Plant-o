package com.example.backend.modules.admin.controller;

import com.example.backend.exeptions.UserFoundException;
import com.example.backend.modules.admin.entities.AdminEntity;
import com.example.backend.modules.admin.useCases.CreatAdminUseCase;
import com.example.backend.modules.admin.useCases.ProfileAdminUseCase;
import com.example.backend.modules.admin.useCases.UpdateAdminUseCase;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private CreatAdminUseCase createCandidateUseCase;
    @Autowired
    private ProfileAdminUseCase profileCandidateUseCase;
    @Autowired
    private UpdateAdminUseCase updateAdminUseCase;

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
        var candidateId = httpServletRequest.getAttribute("adminId");
        try {
            var profile = profileCandidateUseCase.execute(String.valueOf(UUID.fromString(candidateId.toString())));
            return ResponseEntity.ok(profile);
        } catch (UserFoundException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/")
    public ResponseEntity<Object> update(HttpServletRequest httpServletRequest, @Valid @RequestBody AdminEntity updatedAdmin) {
        String adminId = httpServletRequest.getHeader("adminId");
        if (adminId == null || adminId.isEmpty()) {
            return ResponseEntity.badRequest().body("Admin ID is missing in the request headers");
        }
        try {
            var result = updateAdminUseCase.execute(UUID.fromString(adminId), updatedAdmin);
            return ResponseEntity.ok(result);
        } catch (UserFoundException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request, HttpServletResponse response) {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null) {
            new SecurityContextLogoutHandler().logout(request, response, auth);
        }
        return ResponseEntity.ok().build();
    }
}