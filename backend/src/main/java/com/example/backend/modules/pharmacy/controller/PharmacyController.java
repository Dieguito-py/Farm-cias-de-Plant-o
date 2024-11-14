package com.example.backend.modules.pharmacy.controller;

import com.example.backend.modules.pharmacy.DTO.PharmacyDTO;
import com.example.backend.modules.pharmacy.DTO.PharmacyResponseDTO;
import com.example.backend.modules.pharmacy.entities.PharmacyEntity;
import com.example.backend.modules.pharmacy.useCases.CreatePharmacyUseCase;
import com.example.backend.modules.pharmacy.useCases.ListPharmaciesUseCase;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/pharmacy")
public class PharmacyController {

    @Autowired
    private CreatePharmacyUseCase createPharmacyUseCase;

    @Autowired
    private ListPharmaciesUseCase listPharmaciesUseCase;

    @PostMapping("/")
    public PharmacyEntity create(@Valid @RequestBody PharmacyDTO jobDTO, HttpServletRequest request) {
        var adminId = request.getAttribute("admin_id");
        var jobEntity = PharmacyEntity.builder()
                .adminId(adminId != null ? UUID.fromString(adminId.toString()) : null)
                .name(jobDTO.getName())
                .address(jobDTO.getAddress())
                .city(jobDTO.getCity())
                .state(jobDTO.getState())
                .phone(jobDTO.getPhone())
                .latitude(jobDTO.getLatitude())
                .longitude(jobDTO.getLongitude())
                .build();
        return this.createPharmacyUseCase.execute(jobEntity);
    }

    @GetMapping("/all")
    public List<PharmacyResponseDTO> list() {
        return listPharmaciesUseCase.execute();
    }
}