package com.example.backend.modules.admin.controller;

import com.example.backend.exeptions.UserFoundException;
import com.example.backend.modules.admin.DTO.AdminInfoResponseDTO;
import com.example.backend.modules.admin.DTO.ChangePasswordRequestDTO;
import com.example.backend.modules.admin.DTO.UpdateAdminDTO;
import com.example.backend.modules.admin.entities.AdminEntity;
import com.example.backend.modules.admin.useCases.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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
    @Autowired
    private GetAdminInfoUseCase getAdminInfoUseCase;
    @Autowired
    private ChangePasswordUseCase changePasswordUseCase;


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
    public ResponseEntity<Object> update(HttpServletRequest httpServletRequest, @Valid @RequestBody UpdateAdminDTO updatedAdmin) {
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

    @GetMapping("/me")
    public ResponseEntity<AdminInfoResponseDTO> getAdminInfo(HttpServletRequest request) {
        String adminId = request.getHeader("adminId");
        String authToken = request.getHeader("Authorization");

        if (authToken == null || authToken.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        if (adminId == null || adminId.isEmpty()) {
            return ResponseEntity.badRequest().body(null);
        }

        var adminInfo = getAdminInfoUseCase.execute(UUID.fromString(adminId));
        return ResponseEntity.ok(adminInfo);
    }

    @PutMapping("/change-password")
    public ResponseEntity<Object> changePassword(HttpServletRequest request, @Valid @RequestBody ChangePasswordRequestDTO changePasswordRequestDTO) {
        String adminId = request.getHeader("adminId");

        if (adminId == null || adminId.isEmpty()) {
            return ResponseEntity.badRequest().body("Admin ID is missing in the request headers");
        }

        try {
            changePasswordUseCase.execute(UUID.fromString(adminId), changePasswordRequestDTO);
            return ResponseEntity.ok("Password changed successfully");
        } catch (IllegalArgumentException e) {
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