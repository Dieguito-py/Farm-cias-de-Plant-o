package com.example.backend.modules.pharmacy.service;

import com.example.backend.modules.pharmacy.entities.PharmacyEntity;
import com.example.backend.modules.pharmacy.repository.PharmacyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PharmacyService {

    @Autowired
    private PharmacyRepository pharmacyRepository;

    public PharmacyEntity savePharmacy(PharmacyEntity pharmacy) {
        return pharmacyRepository.save(pharmacy);
    }
}