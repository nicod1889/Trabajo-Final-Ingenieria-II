package com.azulyoro.back.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CamionBasicResponseDto {
    private Long id;
    private String patente;
    private String marca;
    private String modelo;
    private Integer km;
    private Integer anio;
    private String numeroChasis;
    private String numeroMotor;
    private String observaciones;
}
