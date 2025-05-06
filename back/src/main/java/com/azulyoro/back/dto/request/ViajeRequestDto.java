package com.azulyoro.back.dto.request;

import com.azulyoro.back.model.ServiceStatus;
import jakarta.validation.constraints.Min;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ViajeRequestDto {

    @Min(value = 1, message = "{request.invalid.id_min}")
    private Long clienteId;

    @Min(value = 1, message = "{request.invalid.id_min}")
    private Long camionId;

    private Long empleadoId;

    private ServiceStatus estado;

    private Double precio;
}
