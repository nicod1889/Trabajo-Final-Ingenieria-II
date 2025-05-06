package com.azulyoro.back.mapper;

import com.azulyoro.back.dto.request.CiudadRequestDto;
import com.azulyoro.back.dto.response.CiudadResponseDto;
import com.azulyoro.back.model.Ciudad;
import org.springframework.stereotype.Service;

@Service
public class CiudadMapper implements Mapper<Ciudad, CiudadRequestDto, CiudadResponseDto> {

    @Override
    public CiudadResponseDto entityToDto(Ciudad ciudad) {
        return CiudadResponseDto.builder()
                .id(ciudad.getId())
                .nombre(ciudad.getNombre())
                .provincia(ciudad.getProvincia())
                .isDeleted(ciudad.isDeleted())
                .build();
    }

    @Override
    public Ciudad dtoToEntity(CiudadRequestDto ciudadRequestDto) {
        return Ciudad.builder()
                .nombre(ciudadRequestDto.getNombre())
                .provincia(ciudadRequestDto.getProvincia())
                .isDeleted(false)
                .build();
    }
}
