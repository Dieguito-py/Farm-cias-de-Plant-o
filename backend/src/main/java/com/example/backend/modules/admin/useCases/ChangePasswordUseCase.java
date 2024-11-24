// src/main/java/com/example/backend/modules/admin/useCases/ChangePasswordUseCase.java
package com.example.backend.modules.admin.useCases;

import com.example.backend.modules.admin.DTO.ChangePasswordRequestDTO;
import com.example.backend.modules.admin.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class ChangePasswordUseCase {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public void execute(UUID adminId, ChangePasswordRequestDTO changePasswordRequestDTO) {
        var admin = adminRepository.findById(adminId).orElseThrow(() -> new UsernameNotFoundException("Admin not found"));

        admin.setPassword(passwordEncoder.encode(changePasswordRequestDTO.getNewPassword()));
        adminRepository.save(admin);
    }
}