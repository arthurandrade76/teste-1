package com.projeto.agendamento;

import com.projeto.agendamento.model.Usuario;
import com.projeto.agendamento.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public DataLoader(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (usuarioRepository.findByEmail("admin@teste.com").isEmpty()) {
            Usuario admin = new Usuario();
            admin.setNome("Admin Teste");
            admin.setEmail("admin@teste.com");
            // O próprio Spring criptografa a senha com o encoder ativo
            admin.setSenha(passwordEncoder.encode("123456"));
            admin.setRole("ROLE_ADMIN");

            usuarioRepository.save(admin);
            System.out.println(">>> USUARIO ADMIN CRIADO COM SUCESSO PELO SPRING! <<<");
        }
    }
}