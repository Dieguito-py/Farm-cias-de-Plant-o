// src/main/java/com/example/backend/modules/admin/useCases/UpdateAdminUseCase.java
package com.example.backend.modules.admin.useCases;

import com.example.backend.modules.admin.DTO.UpdateAdminDTO;
import com.example.backend.modules.admin.DTO.ProfileAdminResponseDTO;
import com.example.backend.modules.admin.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class UpdateAdminUseCase {

    @Autowired
    private AdminRepository adminRepository;

    public ProfileAdminResponseDTO execute(UUID adminId, UpdateAdminDTO updatedAdmin) {
        var admin = adminRepository.findById(adminId).orElseThrow(() -> new UsernameNotFoundException("Admin not found!"));

        admin.setEmail(updatedAdmin.getEmail());
        admin.setName(updatedAdmin.getName());
        admin.setCnpj(updatedAdmin.getCnpj());

        adminRepository.save(admin);

        return ProfileAdminResponseDTO.builder()
                .id(admin.getId().toString())
                .email(admin.getEmail())
                .name(admin.getName())
                .cnpj(admin.getCnpj())
                .build();
    }
}