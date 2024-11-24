package com.example.backend.modules.admin.useCases;

import com.example.backend.modules.admin.DTO.AdminInfoResponseDTO;
import com.example.backend.modules.admin.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class GetAdminInfoUseCase {

    @Autowired
    private AdminRepository adminRepository;

    public AdminInfoResponseDTO execute(UUID adminId) {
        var admin = adminRepository.findById(adminId).orElseThrow(() -> new UsernameNotFoundException("Admin not found"));
        return AdminInfoResponseDTO.builder()
                .adminId(admin.getId())
                .name(admin.getName())
                .email(admin.getEmail())
                .cnpj(admin.getCnpj())
                .build();
    }
}