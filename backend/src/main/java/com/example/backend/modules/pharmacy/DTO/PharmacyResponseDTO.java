package com.example.backend.modules.pharmacy.DTO;

import lombok.Data;

@Data
public class PharmacyResponseDTO {
    private String name;
    private String address;
    private String city;
    private String state;
    private String phone;
    private String latitude;
    private String longitude;
}