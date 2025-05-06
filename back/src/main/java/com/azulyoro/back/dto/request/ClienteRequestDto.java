package com.azulyoro.back.dto.request;

import com.azulyoro.back.model.TipoIdentificacion;
import com.azulyoro.back.util.RegexPatterns;
import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClienteRequestDto {
    @NotBlank(message = "{request.invalid.blank}")
    @Size(max = 50, message = "{request.invalid.max_size}")
    private String name;
    @NotBlank(message = "{request.invalid.blank}")
    @Size(max = 50, message = "{request.invalid.max_size}")
    private String lastName;
    @NotNull
    private TipoIdentificacion category;
    @Positive(message = "{request.invalid.positive}")
    private Long identificationNumber;
    @Pattern(regexp = RegexPatterns.EMAIL_PATTERN, message = "{request.invalid.email}")
    private String email;
    @Size(max = 255, message = "{request.invalid.max_size}")
    private String businessName;
}
