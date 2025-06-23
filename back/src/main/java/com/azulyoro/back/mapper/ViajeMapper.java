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

    @Autowired
    private ClienteMapper clienteMapper;

    @Autowired
    private CiudadMapper ciudadMapper;

    @Autowired
    private CargaMapper cargaMapper;

    @Override
    public ViajeResponseDto entityToDto(Viaje viaje) {
        return ViajeResponseDto.builder()
                .id(viaje.getId())
                .numOrden(viaje.getNumOrden())
                .estado(viaje.getEstado())
                .precio(viaje.getPrecio())
                .fechaSalida(viaje.getFechaSalida())
                .fechaEstimadaEntrega(viaje.getFechaEstimadaEntrega())
                .camion(camionMapper.entityToBasicDto(viaje.getCamion()))
                .empleado(empleadoMapper.entityToBasicDto(viaje.getEmpleado()))
                .cliente(clienteMapper.entityToBasicDto(viaje.getCliente()))
                .origen(ciudadMapper.entityToBasicDto(viaje.getOrigen()))
                .destino(ciudadMapper.entityToBasicDto(viaje.getDestino()))
                .carga(cargaMapper.entityToBasicDto(viaje.getCarga()))
                .observaciones(viaje.getObservaciones())
                .build();
    }

    @Override
    public Viaje dtoToEntity(ViajeRequestDto dto) {
        return Viaje.builder()
            .estado(dto.getEstado())
            .precio(dto.getPrecio())
            .fechaSalida(dto.getFechaSalida())
            .fechaEstimadaEntrega(dto.getFechaEstimadaEntrega())
            .observaciones(dto.getObservaciones())
            .numOrden(dto.getNumOrden())
            .cliente(Cliente.builder().id(dto.getClienteId()).build())
            .camion(Camion.builder().id(dto.getCamionId()).build())
            .empleado(Empleado.builder().id(dto.getEmpleadoId()).build())
            .carga(Carga.builder().id(dto.getCargaId()).build())
            .origen(Ciudad.builder().id(dto.getOrigenId()).build())
            .destino(Ciudad.builder().id(dto.getDestinoId()).build())
            .build();
    }

    public ViajeBasicResponseDto entityToBasicDto(Viaje viaje) {
        return ViajeBasicResponseDto.builder()
                .id(viaje.getId())
                .estado(viaje.getEstado())
                .precio(viaje.getPrecio())
                .fechaSalida(viaje.getFechaSalida())
                .fechaEstimadaEntrega(viaje.getFechaEstimadaEntrega())
                .camion(camionMapper.entityToBasicDto(viaje.getCamion()))
                .origen(ciudadMapper.entityToBasicDto(viaje.getOrigen()))
                .destino(ciudadMapper.entityToBasicDto(viaje.getDestino()))
                .observaciones(viaje.getObservaciones())
                .build();
    }

    public ViajeForCamionDto entityToViajeForCamionDto(Viaje viaje) {
        return ViajeForCamionDto.builder()
                .id(viaje.getId())
                .estado(viaje.getEstado())
                .precio(viaje.getPrecio())
                .fechaSalida(viaje.getFechaSalida())
                .fechaEstimadaEntrega(viaje.getFechaEstimadaEntrega())
                .cliente(clienteMapper.entityToBasicDto(viaje.getCliente()))
                .origen(ciudadMapper.entityToBasicDto(viaje.getOrigen()))
                .destino(ciudadMapper.entityToBasicDto(viaje.getDestino()))
                .observaciones(viaje.getObservaciones())
                .build();
    }
}