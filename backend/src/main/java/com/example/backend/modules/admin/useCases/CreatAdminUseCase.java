package com.example.backend.modules.admin.useCases;

import com.example.backend.exeptions.UserFoundException;
import com.example.backend.modules.admin.entities.AdminEntity;
import com.example.backend.modules.admin.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class CreatAdminUseCase {

    @Autowired
    private AdminRepository candidateRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public AdminEntity execute(AdminEntity candidateEntity) {
        candidateRepository
                .findByCnpjOrEmail(candidateEntity.getEmail(), candidateEntity.getCnpj())
                .ifPresent(candidate -> {
                    throw new UserFoundException("Candidate with this email or CNPJ already exists");
                });

        var password = passwordEncoder.encode(candidateEntity.getPassword());
        candidateEntity.setPassword(password);

        return candidateRepository.save(candidateEntity);
    }
}