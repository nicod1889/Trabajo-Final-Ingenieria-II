package com.azulyoro.back.service;

import com.azulyoro.back.dto.request.LoginRequest;
import com.azulyoro.back.dto.request.RegisterRequest;
import com.azulyoro.back.dto.response.AuthResponse;
import com.azulyoro.back.exception.UserInactiveException;
import com.azulyoro.back.exception.UserNotFoundException;
import com.azulyoro.back.mapper.EmpleadoMapper;
import com.azulyoro.back.model.Empleado;
import com.azulyoro.back.repository.EmpleadoRepository;
import com.azulyoro.back.util.MessageUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    @Autowired
    private EmpleadoRepository empleadoRepository;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private EmpleadoService empleadoService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmpleadoMapper empleadoMapper;

    public AuthResponse login(LoginRequest loginRequest) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        Optional<Empleado> empleadoOptional = empleadoRepository.findByEmail(loginRequest.getEmail());

        if (empleadoOptional.isEmpty()) {
            throw new UserNotFoundException(MessageUtil.userNotFound(loginRequest.getEmail()));
        }

        if (empleadoOptional.get().isDeleted()) {
            throw new UserInactiveException(MessageUtil.userInactive(loginRequest.getEmail()));
        }

        Empleado empleado = empleadoOptional.get();

        String token = jwtService.getToken(empleado);

        return AuthResponse
                .builder()
                .token(token)
                .build();
    }

    public AuthResponse register(RegisterRequest registerRequest){
        Empleado empleado = empleadoService.createEmpleado(registerRequest);

        String token = jwtService.getToken(empleado);

        return AuthResponse.builder()
                .token(token)
                .build();
    }
}
