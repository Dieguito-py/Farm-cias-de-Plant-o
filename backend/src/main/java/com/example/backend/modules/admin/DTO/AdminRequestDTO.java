package com.example.backend.modules.admin.DTO;

import org.hibernate.validator.constraints.br.CNPJ;

public record AdminRequestDTO(String cnpj, String password) {
}
