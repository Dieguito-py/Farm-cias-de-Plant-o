package com.example.backend.modules.pharmacy.controller;

import com.example.backend.modules.pharmacy.DTO.PharmacyDTO;
import com.example.backend.modules.pharmacy.entities.PharmacyEntity;
import com.example.backend.modules.pharmacy.useCases.CreatePharmacyUseCase;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/pharmacy")
public class PharmacyController {

    @Autowired
    private CreatePharmacyUseCase createPharmacyUseCase;

    @PostMapping("/")
    public PharmacyEntity create(@Valid @RequestBody PharmacyDTO jobDTO, HttpServletRequest request) {
        var admin_id = request.getAttribute("admin_id");
        var jobEntity = PharmacyEntity.builder()
                .adminId(UUID.fromString(admin_id.toString()))
                .name(jobDTO.getName())
                .address(jobDTO.getAddress())
//                .latitude(jobDTO.getLatitude())
//                .longitude(jobDTO.getLongitude())
                .build();
        return this.createPharmacyUseCase.execute(jobEntity);
    }
}