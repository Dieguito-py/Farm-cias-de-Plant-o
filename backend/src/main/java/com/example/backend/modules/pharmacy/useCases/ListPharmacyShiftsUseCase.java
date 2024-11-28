package com.example.backend.modules.pharmacy.useCases;

import com.example.backend.modules.pharmacy.repository.ShiftRepository;
import com.example.backend.modules.pharmacy.entities.ShiftEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ListPharmacyShiftsUseCase {

    @Autowired
    private ShiftRepository shiftRepository;

    public List<ShiftEntity> execute(UUID pharmacyId) {
        return shiftRepository.findByPharmacyId(pharmacyId);
    }
}