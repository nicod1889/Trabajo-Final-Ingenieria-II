package com.azulyoro.back.dto.request;

import com.azulyoro.back.model.Provincia;
import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CiudadRequestDto {

    @NotBlank(message = "{request.invalid.blank}")
    @Size(max = 50, message = "{request.invalid.max_size}")
    private String nombre;

    @NotNull(message = "{request.invalid.null}")
    private Provincia provincia;
}
