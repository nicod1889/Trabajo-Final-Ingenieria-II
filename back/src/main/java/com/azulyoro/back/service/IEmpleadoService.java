package com.azulyoro.back.service;

import com.azulyoro.back.dto.request.RegisterRequest;
import com.azulyoro.back.dto.response.EmpleadoResponseDto;
import com.azulyoro.back.model.Empleado;

import java.util.Optional;

public interface IEmpleadoService extends EntityService<RegisterRequest, EmpleadoResponseDto>{
    Optional<Empleado> findById(Long id);
}
