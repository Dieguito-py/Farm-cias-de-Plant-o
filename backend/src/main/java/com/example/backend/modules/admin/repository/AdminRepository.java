package com.example.backend.modules.admin.repository;

import com.example.backend.modules.admin.entities.AdminEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface AdminRepository extends JpaRepository<AdminEntity, UUID> {
    Optional<AdminEntity> findByCnpjOrEmail(String cnpj, String email);
    Optional<AdminEntity> findByCnpj(String cnpj);
}
