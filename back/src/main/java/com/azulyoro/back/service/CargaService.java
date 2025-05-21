package com.azulyoro.back.service;

import com.azulyoro.back.dto.CustomPage;
import com.azulyoro.back.dto.request.CargaRequestDto;
import com.azulyoro.back.dto.response.CargaResponseDto;
import com.azulyoro.back.exception.CannotDeleteEntityException;
import com.azulyoro.back.mapper.CargaMapper;
import com.azulyoro.back.mapper.PageMapper;
import com.azulyoro.back.model.Carga;
import com.azulyoro.back.model.TipoCarga;
import com.azulyoro.back.repository.CargaRepository;
import com.azulyoro.back.repository.TipoCargaRepository;
import com.azulyoro.back.util.MessageUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

import java.util.List;

@Service
public class CargaService implements EntityService<CargaRequestDto, CargaResponseDto> {

    @Autowired
    private CargaRepository cargaRepository;

    @Autowired
    private TipoCargaRepository tipoCargaRepository;

    @Autowired
    private CargaMapper cargaMapper;

    @Autowired
    private PageMapper pageMapper;

    @Override
    public CargaResponseDto create(CargaRequestDto cargaDto) {
        TipoCarga tipoCarga = tipoCargaRepository.findById(cargaDto.getTipoCargaId())
        .orElseThrow(() -> new EntityNotFoundException("Tipo de carga no encontrado"));

        Carga carga = cargaMapper.dtoToEntity(cargaDto);
        carga.setTipoCarga(tipoCarga);

        return cargaMapper.entityToDto(cargaRepository.save(carga));
    }

    @Override
    public CargaResponseDto update(Long id, CargaRequestDto cargaDto) {
        if (cargaRepository.existsById(id)) {
            TipoCarga tipoCarga = tipoCargaRepository.findById(cargaDto.getTipoCargaId())
                .orElseThrow(() -> new EntityNotFoundException("Tipo de carga no encontrado"));
    
            Carga carga = cargaMapper.dtoToEntity(cargaDto);
            carga.setId(id);
            carga.setTipoCarga(tipoCarga);
    
            return cargaMapper.entityToDto(cargaRepository.save(carga));
        } else {
            throw new EntityNotFoundException(MessageUtil.entityNotFound(id));
        }
    }

    @Override
    public CargaResponseDto getById(Long id) {
        Carga carga = cargaRepository
                .findById(id)
                .orElseThrow(() -> new EntityNotFoundException(MessageUtil.entityNotFound(id)));
        return cargaMapper.entityToDto(carga);
    }

    @Override
    public List<CargaResponseDto> getAll() {
        return cargaRepository
                .findAll()
                .stream()
                .map(cargaMapper::entityToDto)
                .toList();
    }

    @Override
    public CustomPage<CargaResponseDto> getByPage(Pageable pageable) {
        Page<CargaResponseDto> page = cargaRepository
                .findAll(pageable)
                .map(cargaMapper::entityToDto);
        return pageMapper.pageToCustomPage(page);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        try {
            cargaRepository.softDelete(id);
        } catch (Exception e) {
            throw new CannotDeleteEntityException(MessageUtil.entityCannotDelete(id, e.getMessage()));
        }
    }

    public Carga findById(Long id) {
        return cargaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(MessageUtil.entityNotFound(id)));
    }
}
