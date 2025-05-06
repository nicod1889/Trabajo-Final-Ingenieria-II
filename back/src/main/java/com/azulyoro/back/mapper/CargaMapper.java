package com.azulyoro.back.mapper;

import com.azulyoro.back.dto.request.CargaRequestDto;
import com.azulyoro.back.dto.response.CargaBasicResponseDto;
import com.azulyoro.back.dto.response.CargaResponseDto;
import com.azulyoro.back.model.Carga;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CargaMapper implements Mapper<Carga, CargaRequestDto, CargaResponseDto> {

    @Autowired
    private TipoCargaMapper tipoCargaMapper;

    @Override
    public CargaResponseDto entityToDto(Carga carga) {
        return CargaResponseDto.builder()
                .id(carga.getId())
                .nombre(carga.getNombre())
                .tipoCarga(tipoCargaMapper.entityToDto(carga.getTipoCarga()))
                .isDeleted(carga.isDeleted())
                .build();
    }

    @Override
    public Carga dtoToEntity(CargaRequestDto cargaRequestDto) {
        return Carga.builder()
                .nombre(cargaRequestDto.getNombre())
                .isDeleted(false)
                .build();
    }

    public CargaBasicResponseDto entityToBasicDto(Carga camion) {
        return CargaBasicResponseDto.builder()
                .id(camion.getId())
                .nombre(camion.getNombre())
                .tipoCarga(camion.getTipoCarga().getNombre())
                .build();
    }
}
