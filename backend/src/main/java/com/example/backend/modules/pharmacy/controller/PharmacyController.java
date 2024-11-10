package com.example.backend.modules.pharmacy.controller;

import com.example.backend.modules.pharmacy.DTO.PharmacyDTO;
import com.example.backend.modules.pharmacy.entities.PharmacyEntity;
import com.example.backend.modules.pharmacy.useCases.CreatePharmacy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pharmacies")
public class PharmacyController {

    @Autowired
    private CreatePharmacy createPharmacy;

    @PostMapping
    public ResponseEntity<PharmacyEntity> createPharmacy(@RequestBody PharmacyDTO pharmacyDTO) {
        PharmacyEntity newPharmacy = createPharmacy.execute(pharmacyDTO);
        return ResponseEntity.ok(newPharmacy);
    }

    // Adicione outros endpoints aqui, como update, delete, etc.
}
