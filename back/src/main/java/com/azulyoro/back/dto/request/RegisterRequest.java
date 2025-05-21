package com.azulyoro.back.dto.request;

import com.azulyoro.back.model.Direccion;
import com.azulyoro.back.model.Role;

import com.azulyoro.back.util.RegexPatterns;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    @NotBlank(message = "{request.invalid.blank}")
    @Size(max = 50, message = "{request.invalid.max_size}")
    private String nombre;
    @NotBlank(message = "{request.invalid.blank}")
    @Size(max = 50, message = "{request.invalid.max_size}")
    private String apellido;
    @Pattern(regexp = RegexPatterns.EMAIL_PATTERN, message = "{request.invalid.email}")
    private String email;
    @Positive(message = "{request.invalid.positive}")
    private Long numeroIdentificacion;
    @NotNull(message = "{request.invalid.null}")
    private Role rol;
    @NotNull(message = "{request.invalid.null}")
    private Direccion direccion;
    private String password;
}
