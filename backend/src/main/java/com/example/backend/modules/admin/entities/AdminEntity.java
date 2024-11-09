package com.example.backend.modules.admin.entities;

import com.example.backend.modules.pharmacy.entities.PharmacyEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
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

    @Length(min = 3, max = 60, message = "Nome deve ter entre 3 e 60 caracteres")
    private String name;

    @Email(message = "Email deve ser válido")
    private String email;

    @Length(min = 6, message = "Senha deve ter no mínimo 6 caracteres")
    private String password;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "admin", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PharmacyEntity> pharmacies;
}