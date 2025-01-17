package com.example.backend.modules.admin.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AdminResponseDTO {
    private String accessToken;
    private Long expiresIn;
    private UUID adminId;
}
