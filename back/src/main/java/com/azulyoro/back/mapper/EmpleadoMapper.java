package com.azulyoro.back.mapper;

import com.azulyoro.back.dto.request.RegisterRequest;
import com.azulyoro.back.dto.response.EmpleadoBasicResponseDto;
import com.azulyoro.back.dto.response.EmpleadoResponseDto;
import com.azulyoro.back.model.Empleado;
import com.azulyoro.back.model.TipoIdentificacion;
import org.springframework.stereotype.Component;

@Component
public class EmpleadoMapper implements Mapper<Empleado, RegisterRequest, EmpleadoResponseDto>{

    public EmpleadoBasicResponseDto entityToBasicDto(Empleado empleado) {
        EmpleadoBasicResponseDto empleadoDto = new EmpleadoBasicResponseDto();
        empleadoDto.setId(empleado.getId());
        empleadoDto.setNombre(empleado.getNombre());
        empleadoDto.setApellido(empleado.getApellido());
        empleadoDto.setDeleted(empleado.isDeleted());

        return empleadoDto;
    }

    @Override
    public EmpleadoResponseDto entityToDto(Empleado empleado) {
        EmpleadoResponseDto dto = new EmpleadoResponseDto();

        dto.setId(empleado.getId());
        dto.setNombre(empleado.getNombre());
        dto.setApellido(empleado.getApellido());
        dto.setIdentificationNumber(empleado.getIdentificationNumber());
        dto.setEmail(empleado.getEmail());
        dto.setRole(empleado.getRole());
        dto.setDireccion(empleado.getDireccion());
        dto.setDeleted(empleado.isDeleted());

        return dto;
    }

    @Override
    public Empleado dtoToEntity(RegisterRequest request) {
        Empleado empleado = new Empleado();

        empleado.setNombre(request.getName());
        empleado.setApellido(request.getLastName());
        empleado.setCategory(TipoIdentificacion.DNI);
        empleado.setIdentificationNumber(request.getIdentificationNumber());
        empleado.setEmail(request.getEmail());
        empleado.setRole(request.getRole());
        empleado.setDireccion(request.getDireccion());

        return empleado;
    }
}
