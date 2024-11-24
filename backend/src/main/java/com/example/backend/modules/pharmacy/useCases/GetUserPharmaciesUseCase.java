package com.example.backend.modules.pharmacy.useCases;

import com.example.backend.modules.pharmacy.entities.PharmacyEntity;
import com.example.backend.modules.pharmacy.repository.PharmacyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class GetUserPharmaciesUseCase {

    @Autowired
    private PharmacyRepository pharmacyRepository;

    public List<PharmacyEntity> execute(UUID adminId) {
        return pharmacyRepository.findByAdminId(adminId);
    }
}