package com.example.backend.modules.pharmacy.useCases;

import com.example.backend.modules.pharmacy.entities.ShiftEntity;
import com.example.backend.modules.pharmacy.repository.ShiftRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CreateShiftUseCase {

    @Autowired
    private ShiftRepository shiftRepository;

    public ShiftEntity execute(ShiftEntity shiftEntity) {
        return shiftRepository.save(shiftEntity);
    }
}