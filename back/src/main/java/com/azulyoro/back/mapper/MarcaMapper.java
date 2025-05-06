package com.azulyoro.back.mapper;

import org.springframework.stereotype.Component;

import com.azulyoro.back.dto.request.MarcaRequestDto;
import com.azulyoro.back.dto.response.MarcaResponseDto;
import com.azulyoro.back.model.Marca;

@Component
public class MarcaMapper implements Mapper<Marca, MarcaRequestDto, MarcaResponseDto> {

    @Override
    public MarcaResponseDto entityToDto(Marca marca){
        return MarcaResponseDto.builder()
                .id(marca.getId())
                .nombre(marca.getNombre())
                .isDeleted(marca.isDeleted())
                .build();
    }

    @Override
    public Marca dtoToEntity(MarcaRequestDto marcaRequestDto){
        return Marca.builder()
                .nombre(marcaRequestDto.getNombre())
                .build();
    }
}