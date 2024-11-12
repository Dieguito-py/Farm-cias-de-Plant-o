package com.example.backend.modules.pharmacy.entities;

import com.example.backend.modules.admin.entities.AdminEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.validator.constraints.Length;

import java.time.LocalDateTime;
import java.time.chrono.ChronoLocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Entity(name = "pharmacy")
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PharmacyEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @NotBlank(message = "Nome é obrigatório")
    @Length(min = 3, max = 70, message = "Nome deve ter entre 3 e 70 caracteres")
    private String name;

    @NotBlank(message = "Telefone é obrigatório")
    @Pattern(regexp = "\\(\\d{2}\\) \\d{4,5}-\\d{4}", message = "Número de telefone inválido")
    private String phone;

    @NotBlank(message = "Endereço é obrigatório")
    @Length(min = 3, max = 100, message = "Endereço deve ter entre 3 e 100 caracteres")
    private String address;

    @NotBlank(message = "Cidade é obrigatória")
    @Length(min = 2, max = 20, message = "Cidade deve ter entre 2 e 20 caracteres")
    private String city;

    @NotBlank(message = "Estado é obrigatório")
    @Pattern(regexp = "[A-Z]{2}", message = "O estado deve ser a sigla de 2 letras (ex: SP)")
    private String state;

    @NotBlank(message = "Latitude é obrigatória")
//    @DecimalMin(value = "-90.0", inclusive = true, message = "Latitude deve ser entre -90 e 90")
//    @DecimalMax(value = "90.0", inclusive = true, message = "Latitude deve ser entre -90 e 90")
    private String latitude;

    @NotBlank(message = "Longitude é obrigatória")
//    @DecimalMin(value = "-180.0", inclusive = true, message = "Longitude deve ser entre -180 e 180")
//    @DecimalMax(value = "180.0", inclusive = true, message = "Longitude deve ser entre -180 e 180")
    private String longitude;

//    @CreationTimestamp
//    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "pharmacy", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ShiftEntity> shifts;

    public boolean emPlantao() {
        LocalDateTime now = LocalDateTime.now();
        for (ShiftEntity shift : shifts) {
            if (now.isAfter(ChronoLocalDateTime.from(shift.getStartTime())) && now.isBefore(ChronoLocalDateTime.from(shift.getEndTime()))) {
                return true;
            }
        }
        return false;
    }

    @ManyToOne()
    @JoinColumn(name = "admin_id", insertable = false, updatable = false)
    private AdminEntity admin;

    @NotBlank
    @Column(name = "admin_id")
    private UUID adminId;

}
