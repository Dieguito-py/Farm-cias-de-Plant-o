package com.example.backend.modules.pharmacy.repository;

import com.example.backend.modules.pharmacy.entities.PharmacyEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PharmacyRepository extends JpaRepository<PharmacyEntity, Long> {
    Optional<PharmacyEntity> findByAdminId(UUID adminId);
//    List<PharmacyEntity> findByEmPlantao(boolean emPlantao);
}