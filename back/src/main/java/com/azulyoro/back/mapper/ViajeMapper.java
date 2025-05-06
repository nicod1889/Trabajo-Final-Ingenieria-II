package com.azulyoro.back.mapper;

import com.azulyoro.back.dto.request.ViajeRequestDto;
import com.azulyoro.back.dto.response.ViajeBasicResponseDto;
import com.azulyoro.back.dto.response.ViajeForCamionDto;
import com.azulyoro.back.dto.response.ViajeResponseDto;
import com.azulyoro.back.model.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ViajeMapper implements Mapper<Viaje, ViajeRequestDto, ViajeResponseDto> {
    @Autowired
    private CamionMapper camionMapper;

    @Autowired
    private EmpleadoMapper empleadoMapper;

    @Override
    public ViajeResponseDto entityToDto(Viaje service){
        return ViajeResponseDto.builder()
                .id(service.getId())
                .estado(service.getEstado())
                .precio(service.getPrecio())
                .fechaSalida(service.getFechaSalida())
                .fechaEstimadaEntrega(service.getFechaEstimadaEntrega())
                .camion(camionMapper.entityToBasicDto(service.getCamion()))
                .empleado(empleadoMapper.entityToBasicDto(service.getEmpleado()))
                .pagoFecha((service.getPago() != null) ? service.getPago().getDate() : null)
                .build();
    }

    @Override
    public Viaje dtoToEntity(ViajeRequestDto serviceRequestDto){
        return Viaje.builder()
                .estado(serviceRequestDto.getEstado())
                .precio(serviceRequestDto.getPrecio())
                .build();
    }

    public ViajeBasicResponseDto entityToBasicDto(Viaje service){
        return ViajeBasicResponseDto.builder()
                .id(service.getId())
                .estado(service.getEstado())
                .camion(camionMapper.entityToBasicDto(service.getCamion()))
                .precio(service.getPrecio())
                .fechaSalida(service.getFechaSalida())
                .fechaEstimadaEntrega(service.getFechaEstimadaEntrega())
                .fechaPago((service.getPago() != null) ? service.getPago().getDate() : null)
                .build();
    }

    public ViajeForCamionDto entityToViajeForCamionDto(Viaje service){
        return ViajeForCamionDto.builder()
                .id(service.getId())
                .estado(service.getEstado())
                .precio(service.getPrecio())
                .fechaSalida(service.getFechaSalida())
                .fechaEstimadaEntrega(service.getFechaEstimadaEntrega())
                .fechaPago((service.getPago() != null) ? service.getPago().getDate() : null)
                .build();
    }
}
