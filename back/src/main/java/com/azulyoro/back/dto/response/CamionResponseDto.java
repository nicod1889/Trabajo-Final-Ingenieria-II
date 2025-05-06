package com.azulyoro.back.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CamionResponseDto {
    private Long id;
    private String patente;
    private MarcaResponseDto marca;
    private String modelo;
    private Integer km;
    private Integer anio;
    private String numeroChasis;
    private String numeroMotor;
    private String observaciones;
    private boolean isDeleted;
    private List<ViajeForCamionDto> viaje;
}