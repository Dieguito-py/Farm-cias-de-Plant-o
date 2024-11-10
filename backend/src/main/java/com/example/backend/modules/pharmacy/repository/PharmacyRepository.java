package com.example.backend.modules.pharmacy.repository;

import com.example.backend.modules.pharmacy.entities.PharmacyEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PharmacyRepository extends JpaRepository<PharmacyEntity, Long> {
//    List<PharmacyEntity> findByEmPlantao(boolean emPlantao);
}