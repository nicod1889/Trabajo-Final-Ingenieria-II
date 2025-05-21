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
    @NotNull
    private TipoIdentificacion category;
    @Positive(message = "{request.invalid.positive}")
    private Long numeroIdentificacion;
    @Pattern(regexp = RegexPatterns.EMAIL_PATTERN, message = "{request.invalid.email}")
    private String email;
    @Size(max = 255, message = "{request.invalid.max_size}")
    private String businessName;
}
