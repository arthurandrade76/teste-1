package com.projeto.agendamento.controller;

import com.projeto.agendamento.dto.LoginRequestDTO;
import com.projeto.agendamento.dto.LoginResponseDTO;
import com.projeto.agendamento.model.Usuario;
import com.projeto.agendamento.repository.UsuarioRepository;
import com.projeto.agendamento.security.TokenService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;

    public AuthController(UsuarioRepository usuarioRepository, 
                          PasswordEncoder passwordEncoder, 
                          TokenService tokenService) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenService = tokenService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO request) {
        Usuario usuario = usuarioRepository.findByEmail(request.email())
                .orElse(null);

        // Se o usuário não existir ou a senha não bater com o hash do banco
        if (usuario == null || !passwordEncoder.matches(request.senha(), usuario.getSenha())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Email ou senha inválidos.");
        }

        // Gera o token JWT e retorna com os dados básicos
        String token = tokenService.gerarToken(usuario);
        LoginResponseDTO response = new LoginResponseDTO(token, usuario.getNome(), usuario.getRole());

        return ResponseEntity.ok(response);
    }
}