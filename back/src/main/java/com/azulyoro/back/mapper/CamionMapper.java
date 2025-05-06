package com.azulyoro.back.mapper;

import com.azulyoro.back.dto.request.CamionRequestDto;
import com.azulyoro.back.dto.response.CamionBasicResponseDto;
import com.azulyoro.back.dto.response.CamionResponseDto;
import com.azulyoro.back.model.Camion;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CamionMapper implements Mapper<Camion, CamionRequestDto, CamionResponseDto> {

    @Autowired
    private MarcaMapper marcaMapper;

    @Override
    public CamionResponseDto entityToDto(Camion camion) {
        return CamionResponseDto.builder()
                .id(camion.getId())
                .patente(camion.getPatente())
                .marca(marcaMapper.entityToDto(camion.getMarca()))
                .modelo(camion.getModelo())
                .km(camion.getKm())
                .anio(camion.getAnio())
                .numeroChasis(camion.getNumeroChasis())
                .numeroMotor(camion.getNumeroMotor())
                .observaciones(camion.getObservaciones())
                .isDeleted(camion.isDeleted())
                .build();
    }

    @Override
    public Camion dtoToEntity(CamionRequestDto camionRequestDto) {
        return Camion.builder()
                .patente(camionRequestDto.getPatente())
                .modelo(camionRequestDto.getModelo())
                .km(camionRequestDto.getKm())
                .anio(camionRequestDto.getAnio())
                .numeroChasis(camionRequestDto.getNumeroChasis())
                .numeroMotor(camionRequestDto.getNumeroMotor())
                .observaciones(camionRequestDto.getObservaciones())
                .build();
    }

    public CamionBasicResponseDto entityToBasicDto(Camion camion) {
        return CamionBasicResponseDto.builder()
                .id(camion.getId())
                .patente(camion.getPatente())
                .marca(camion.getMarca().getNombre())
                .modelo(camion.getModelo())
                .km(camion.getKm())
                .anio(camion.getAnio())
                .numeroChasis(camion.getNumeroChasis())
                .numeroMotor(camion.getNumeroMotor())
                .observaciones(camion.getObservaciones())
                .build();
    }
}
