package com.azulyoro.back.dto.request;

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
public class CamionRequestDto {

    @Pattern(regexp = RegexPatterns.VEHICLE_PLATE, message="{request.invalid.plate}")
    private String patente;

    @Min(value=1, message = "{request.invalid.id_min}")
    private Long marcaId;

    @NotBlank(message = "{request.invalid.blank}")
    @Size(max = 50, message = "{request.invalid.max_size}")
    private String modelo;

    @Min(value = 0, message = "{request.invalid.mileage}")
    private Integer km;

    @Min(value = 0, message = "{request.invalid.mileage}")
    private Integer anio;

    @NotBlank(message = "{request.invalid.blank}")
    @Size(max = 50, message = "{request.invalid.max_size}")
    private String numeroChasis;

    @NotBlank(message = "{request.invalid.blank}")
    @Size(max = 50, message = "{request.invalid.max_size}")
    private String numeroMotor;

    @Size(max = 300, message = "{request.invalid.max_size}")
    private String observaciones;
}
