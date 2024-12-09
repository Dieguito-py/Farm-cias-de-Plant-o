package com.example.backend.modules.pharmacy.repository;

import com.example.backend.modules.pharmacy.entities.ShiftEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface ShiftRepository extends JpaRepository<ShiftEntity, UUID> {
    List<ShiftEntity> findByPharmacyId(UUID pharmacyId);
    List<ShiftEntity> findByDate(LocalDate date);
}