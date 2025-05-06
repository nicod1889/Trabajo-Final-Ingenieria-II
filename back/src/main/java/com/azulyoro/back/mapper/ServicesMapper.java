package com.azulyoro.back.mapper;

import com.azulyoro.back.dto.request.ServicesRequestDto;
import com.azulyoro.back.dto.response.EmpleadoBasicResponseDto;
import com.azulyoro.back.dto.response.ServicesBasicResponseDto;
import com.azulyoro.back.dto.response.ServicesForVehicleDto;
import com.azulyoro.back.dto.response.ServicesResponseDto;
import com.azulyoro.back.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Component
public class ServicesMapper implements Mapper<Services, ServicesRequestDto, ServicesResponseDto> {
    @Autowired
    private VehicleMapper vehicleMapper;

    @Autowired
    private ServiceTypeMapper serviceTypeMapper;

    @Autowired
    private EmpleadoMapper empleadoMapper;

    @Override
    public ServicesResponseDto entityToDto(Services service){
        return ServicesResponseDto.builder()
                .id(service.getId())
                .serviceType(serviceTypeMapper.entityToDto(service.getServiceType()))
                .status(service.getStatus())
                .price(service.getPrice())
                .startDate(service.getStartDate())
                .finalDate(service.getFinalDate())
                .vehicle(vehicleMapper.entityToBasicDto(service.getVehicle()))
                .empleados(getEmpleadosDto(service))
                .payDate((service.getPay() != null) ? service.getPay().getDate() : null)
                .build();
    }

    @Override
    public Services dtoToEntity(ServicesRequestDto serviceRequestDto){
        return Services.builder()
                .status(serviceRequestDto.getStatus())
                .price(serviceRequestDto.getPrice())
                .build();
    }

    public ServicesBasicResponseDto entityToBasicDto(Services service){
        return ServicesBasicResponseDto.builder()
                .id(service.getId())
                .serviceType(service.getServiceType().getName())
                .status(service.getStatus())
                .vehicle(vehicleMapper.entityToBasicDto(service.getVehicle()))
                .price(service.getPrice())
                .startDate(service.getStartDate())
                .finalDate(service.getFinalDate())
                .payDate((service.getPay() != null) ? service.getPay().getDate() : null)
                .build();
    }

    public ServicesForVehicleDto entityToServiceForVehicleDto(Services service){
        return ServicesForVehicleDto.builder()
                .id(service.getId())
                .serviceType(service.getServiceType().getName())
                .status(service.getStatus())
                .price(service.getPrice())
                .startDate(service.getStartDate())
                .finalDate(service.getFinalDate())
                .payDate((service.getPay() != null) ? service.getPay().getDate() : null)
                .build();
    }

    private List<EmpleadoBasicResponseDto> getEmpleadosDto(Services service){
        return Optional.ofNullable(service.getEmpleados())
                .orElse(Collections.emptyList())
                .stream()
                .map(empleadoMapper::entityToBasicDto)
                .toList();
    }
}
