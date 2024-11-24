package com.example.backend.modules.pharmacy.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PharmacyResponseDTO {
    private String name;
    private String address;
    private String city;
    private String state;
    private String phone;
    private String latitude;
    private String longitude;
}