package com.example.backend.modules.admin.useCases;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.example.backend.modules.admin.DTO.AdminRequestDTO;
import com.example.backend.modules.admin.DTO.AdminResponseDTO;
import com.example.backend.modules.admin.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.Arrays;

@Service
public class AuthAdminUseCase {

    @Value("${security.token.secret.admin}")
    private String secretKey;

    @Autowired
    private AdminRepository candidateRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public AdminResponseDTO execute(AdminRequestDTO authCandidateRequestDTO) throws AuthenticationException {
        var admin = this.candidateRepository.findByCnpj(authCandidateRequestDTO.cnpj()).orElseThrow(() -> {
            throw new UsernameNotFoundException("CNPJ ou senha incorretos.");
        });

        var passwordMatches = this.passwordEncoder.matches(authCandidateRequestDTO.password(), admin.getPassword());
        if (!passwordMatches) {
            throw new UsernameNotFoundException("CNPJ ou senha incorretos.");
        }

        // Gera o token JWT
        Algorithm algorithm = Algorithm.HMAC256(secretKey);
        var expiresIn = Instant.now().plus(Duration.ofMinutes(30L));
        var token = JWT.create()
                .withSubject(admin.getId().toString())
                .withClaim("roles", Arrays.asList("admin"))
                .withExpiresAt(expiresIn)
                .sign(algorithm);

        return AdminResponseDTO.builder()
                .accessToken(token)
                .expiresIn(expiresIn.toEpochMilli())
                .adminId(admin.getId())
                .build();
    }
}