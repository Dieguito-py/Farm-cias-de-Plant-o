package com.example.backend.modules.admin.useCases;

import com.example.backend.modules.admin.DTO.ProfileAdminResponseDTO;
import com.example.backend.modules.admin.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class ProfileAdminUseCase {

    @Autowired
    private AdminRepository candidateRepository;

    public ProfileAdminResponseDTO execute(String cnpj) {
        var candidate = candidateRepository.findByCnpj(cnpj).orElseThrow(() -> {
            throw new UsernameNotFoundException("Candidato não encontrado!");
        });

        return ProfileAdminResponseDTO.builder()
                .id(candidate.getId().toString())
                .email(candidate.getEmail())
                .name(candidate.getName())
                .cnpj(candidate.getCnpj())
                .build();
    }
}
