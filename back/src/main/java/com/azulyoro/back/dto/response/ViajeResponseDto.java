package com.azulyoro.back.dto.response;

import com.azulyoro.back.model.ServiceStatus;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ViajeResponseDto{
    private Long id;
    private ServiceStatus estado;
    private LocalDate pagoFecha;
    private Double precio;
    private LocalDate fechaSalida;
    private LocalDate fechaEstimadaEntrega;
    private CamionBasicResponseDto camion;
    private ClienteBasicResponseDto cliente;
    private EmpleadoBasicResponseDto empleado;
}
