package com.example.backend.modules.pharmacy.useCases;

import com.example.backend.modules.pharmacy.DTO.PharmacyResponseDTO;
import com.example.backend.modules.pharmacy.entities.PharmacyEntity;
import com.example.backend.modules.pharmacy.repository.PharmacyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ListPharmaciesUseCase {

    @Autowired
    private PharmacyRepository pharmacyRepository;

    public List<PharmacyResponseDTO> execute() {
        List<PharmacyEntity> pharmacies = pharmacyRepository.findAll();
        return pharmacies.stream().map(pharmacy -> {
            PharmacyResponseDTO dto = new PharmacyResponseDTO();
            dto.setId(pharmacy.getId());
            dto.setName(pharmacy.getName());
            dto.setAddress(pharmacy.getAddress());
            dto.setCity(pharmacy.getCity());
            dto.setState(pharmacy.getState());
            dto.setPhone(pharmacy.getPhone());
            dto.setLatitude(pharmacy.getLatitude());
            dto.setLongitude(pharmacy.getLongitude());
            return dto;
        }).collect(Collectors.toList());
    }
}