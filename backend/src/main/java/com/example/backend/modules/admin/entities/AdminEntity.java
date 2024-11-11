package com.example.backend.modules.admin.entities;

import com.example.backend.modules.pharmacy.entities.PharmacyEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.validator.constraints.Length;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Entity(name = "admin")
public class AdminEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotBlank(message = "CNPJ é obrigatório")
    @Pattern(regexp = "\\d{2}\\.\\d{3}\\.\\d{3}/\\d{4}-\\d{2}|\\d{14}", message = "CNPJ deve estar no formato 99.999.999/9999-99 ou conter apenas números")
    private String cnpj;

    @NotBlank(message = "Nome é obrigatório")
    @Length(min = 3, message = "Nome deve ter no mínimo 3 caracteres")
    private String name;

    @NotBlank(message = "Email é obrigatório")
    @Email(message = "Email deve ser válido")
    private String email;

    @NotBlank(message = "Senha é obrigatória")
    @Length(min = 6, message = "Senha deve ter no mínimo 6 caracteres")
    private String password;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "admin", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PharmacyEntity> pharmacies;
}