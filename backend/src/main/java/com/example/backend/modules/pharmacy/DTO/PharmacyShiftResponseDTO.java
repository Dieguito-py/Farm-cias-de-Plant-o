package com.example.backend.modules.pharmacy.DTO;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Data
@Builder
public class PharmacyShiftResponseDTO {
    private UUID pharmacyId;
    private String name;
    private String address;
    private String city;
    private String state;
    private String phone;
    private String latitude;
    private String longitude;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
}