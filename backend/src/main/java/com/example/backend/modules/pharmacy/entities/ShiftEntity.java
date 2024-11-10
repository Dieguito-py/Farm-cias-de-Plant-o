package com.example.backend.modules.pharmacy.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Data
@Entity(name = "shift")
public class ShiftEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotNull(message = "Data é obrigatória")
    @FutureOrPresent(message = "A data deve ser hoje ou uma data futura")
    private LocalDate date;

    @NotNull(message = "Horário de início é obrigatório")
    private LocalTime startTime;  // Alterado para LocalTime

    @NotNull(message = "Horário de término é obrigatório")
    private LocalTime endTime;  // Alterado para LocalTime

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pharmacy_id", nullable = false)
    private PharmacyEntity pharmacy;
}
