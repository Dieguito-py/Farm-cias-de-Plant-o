package com.example.backend.modules.pharmacy.controller;

import com.example.backend.modules.pharmacy.DTO.PharmacyDTO;
import com.example.backend.modules.pharmacy.DTO.PharmacyResponseDTO;
import com.example.backend.modules.pharmacy.DTO.ShiftResponseDTO;
import com.example.backend.modules.pharmacy.entities.PharmacyEntity;
import com.example.backend.modules.pharmacy.entities.ShiftEntity;
import com.example.backend.modules.pharmacy.useCases.CreatePharmacyUseCase;
import com.example.backend.modules.pharmacy.useCases.ListPharmaciesUseCase;
import com.example.backend.modules.pharmacy.useCases.GetUserPharmaciesUseCase;
import com.example.backend.modules.pharmacy.useCases.ListPharmacyShiftsUseCase;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/pharmacy")
public class PharmacyController {

    @Autowired
    private CreatePharmacyUseCase createPharmacyUseCase;

    @Autowired
    private ListPharmaciesUseCase listPharmaciesUseCase;

    @Autowired
    private GetUserPharmaciesUseCase getUserPharmaciesUseCase;

    @Autowired
    private ListPharmacyShiftsUseCase listPharmacyShiftsUseCase;


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

    @GetMapping("/user-pharmacies")
    public ResponseEntity<List<PharmacyResponseDTO>> getUserPharmacies(HttpServletRequest request) {
        String adminId = request.getHeader("adminId");
        if (adminId == null || adminId.isEmpty()) {
            return ResponseEntity.badRequest().body(null);
        }
        try {
            List<PharmacyEntity> pharmacies = getUserPharmaciesUseCase.execute(UUID.fromString(adminId));
            List<PharmacyResponseDTO> response = pharmacies.stream()
                    .map(pharmacy -> PharmacyResponseDTO.builder()
                            .pharmacyId(pharmacy.getId())
                            .name(pharmacy.getName())
                            .address(pharmacy.getAddress())
                            .city(pharmacy.getCity())
                            .state(pharmacy.getState())
                            .phone(pharmacy.getPhone())
                            .latitude(pharmacy.getLatitude())
                            .longitude(pharmacy.getLongitude())
                            .build())
                    .collect(Collectors.toList());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/{pharmacyId}/shifts")
    public ResponseEntity<List<ShiftResponseDTO>> listShifts(@PathVariable UUID pharmacyId) {
        List<ShiftEntity> shifts = listPharmacyShiftsUseCase.execute(pharmacyId);
        List<ShiftResponseDTO> response = shifts.stream()
                .map(shift -> ShiftResponseDTO.builder()
                        .id(shift.getId())
                        .date(shift.getDate())
                        .startTime(shift.getStartTime())
                        .endTime(shift.getEndTime())
                        .pharmacyId(shift.getPharmacy().getId())
                        .build())
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }
}