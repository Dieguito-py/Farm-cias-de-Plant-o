package com.example.backend.modules.pharmacy.useCases;

import com.example.backend.modules.pharmacy.DTO.PharmacyDTO;
import com.example.backend.modules.pharmacy.entities.PharmacyEntity;
import com.example.backend.modules.pharmacy.repository.PharmacyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CreatePharmacy {
    @Autowired
    private PharmacyRepository pharmacyRepository;

    public PharmacyEntity execute(PharmacyDTO pharmacyDTO) {
        PharmacyEntity pharmacy = new PharmacyEntity();
        pharmacy.setName(pharmacyDTO.getName());
        pharmacy.setAddress(pharmacyDTO.getAddress());
        pharmacy.setLatitude(pharmacyDTO.getLatitude());
        pharmacy.setLongitude(pharmacyDTO.getLongitude());
        return pharmacyRepository.save(pharmacy);
    }
}