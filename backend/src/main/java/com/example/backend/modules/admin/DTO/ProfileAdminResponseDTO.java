package com.example.backend.modules.admin.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProfileAdminResponseDTO {
    private String id;
    private String cnpj;
    private String name;
    private String email;
}
