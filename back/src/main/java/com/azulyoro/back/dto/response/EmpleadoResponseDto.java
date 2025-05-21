package com.azulyoro.back.dto.response;

import com.azulyoro.back.model.Direccion;
import com.azulyoro.back.model.Role;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class EmpleadoResponseDto extends EmpleadoBasicResponseDto {
    private List<ServicesBasicResponseDto> services;
    private String email;
    private Long numeroIdentificacion;
    private Role rol;
    private String rolText;
    private Direccion direccion;
}
