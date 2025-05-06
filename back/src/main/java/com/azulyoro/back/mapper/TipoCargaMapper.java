package com.azulyoro.back.mapper;

import org.springframework.stereotype.Component;

import com.azulyoro.back.dto.request.TipoCargaRequestDto;
import com.azulyoro.back.dto.response.TipoCargaResponseDto;
import com.azulyoro.back.model.TipoCarga;

@Component
public class TipoCargaMapper implements Mapper<TipoCarga, TipoCargaRequestDto, TipoCargaResponseDto> {
    
    @Override
    public TipoCargaResponseDto entityToDto(TipoCarga serviceType) {
        return TipoCargaResponseDto.builder()
                .id(serviceType.getId())
                .nombre(serviceType.getNombre())
                .isDeleted(serviceType.isDeleted())
                .build();
    }

    @Override
    public TipoCarga dtoToEntity(TipoCargaRequestDto serviceTypeRequestDto) {
        return TipoCarga.builder()
                .nombre(serviceTypeRequestDto.getNombre())
                .build();
    }
}
