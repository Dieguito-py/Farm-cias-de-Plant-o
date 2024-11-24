// src/main/java/com/example/backend/modules/admin/DTO/ChangePasswordRequestDTO.java
package com.example.backend.modules.admin.DTO;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ChangePasswordRequestDTO {
    @NotBlank
    private String newPassword;
}