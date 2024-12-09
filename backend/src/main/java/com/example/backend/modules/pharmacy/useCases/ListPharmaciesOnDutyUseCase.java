package com.example.backend.modules.pharmacy.useCases;

import com.example.backend.modules.pharmacy.DTO.PharmacyShiftResponseDTO;
import com.example.backend.modules.pharmacy.entities.PharmacyEntity;
import com.example.backend.modules.pharmacy.entities.ShiftEntity;
import com.example.backend.modules.pharmacy.repository.ShiftRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ListPharmaciesOnDutyUseCase {

    @Autowired
    private ShiftRepository shiftRepository;

    public List<PharmacyShiftResponseDTO> execute(LocalDate date) {
        List<ShiftEntity> shifts = shiftRepository.findByDate(date);
        return shifts.stream()
                .map(shift -> {
                    PharmacyEntity pharmacy = shift.getPharmacy();
                    return PharmacyShiftResponseDTO.builder()
                            .pharmacyId(pharmacy.getId())
                            .name(pharmacy.getName())
                            .address(pharmacy.getAddress())
                            .city(pharmacy.getCity())
                            .state(pharmacy.getState())
                            .phone(pharmacy.getPhone())
                            .latitude(pharmacy.getLatitude())
                            .longitude(pharmacy.getLongitude())
                            .date(shift.getDate())
                            .startTime(shift.getStartTime())
                            .endTime(shift.getEndTime())
                            .build();
                })
                .collect(Collectors.toList());
    }
}