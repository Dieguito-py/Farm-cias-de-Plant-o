package com.example.backend.modules.pharmacy.useCases;

import com.example.backend.modules.pharmacy.entities.PharmacyEntity;
import com.example.backend.modules.pharmacy.repository.PharmacyRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CreatePharmacyUseCase {
    @Autowired
    PharmacyRepository jobRepository;

    public PharmacyEntity execute(PharmacyEntity jobEntity) {
        return jobRepository.save(jobEntity);
    }
}