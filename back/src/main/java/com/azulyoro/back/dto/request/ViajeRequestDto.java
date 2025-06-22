package com.azulyoro.back.dto.request;

import java.time.LocalDate;

import com.azulyoro.back.model.ServiceStatus;
import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ViajeRequestDto {

    @NotNull(message = "El cliente es obligatorio")
    @Min(value = 1, message = "{request.invalid.id_min}")
    private Long clienteId;

    @NotNull(message = "El camion es obligatorio")
    @Min(value = 1, message = "{request.invalid.id_min}")
    private Long camionId;

    @NotNull(message = "El empleado es obligatorio")
    @Min(value = 1, message = "{request.invalid.id_min}")
    private Long empleadoId;

    @NotNull(message = "El estado es obligatorio")
    private ServiceStatus estado;

    @NotNull(message = "El precio es obligatorio")
    private Double precio;

    @NotNull(message = "El numero de orden es obligatorio")
    private Integer numOrden;

    @NotNull(message = "El origen es obligatorio")
    @Min(value = 1, message = "{request.invalid.id_min}")
    private Long origenId;

    @NotNull(message = "El destino es obligatorio")
    @Min(value = 1, message = "{request.invalid.id_min}")
    private Long destinoId;

    @NotNull(message = "La fecha de salida es obligatoria")
    private LocalDate fechaSalida;

    @NotNull(message = "La fecha estimada de entrega es obligatoria")
    private LocalDate fechaEstimadaEntrega;

    @NotNull(message = "La carga es obligatoria")
    @Min(value = 1, message = "{request.invalid.id_min}")
    private Long cargaId;

    private String observaciones;
}
