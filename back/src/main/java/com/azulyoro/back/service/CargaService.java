package com.azulyoro.back.service;

import com.azulyoro.back.dto.CustomPage;
import com.azulyoro.back.dto.request.CargaRequestDto;
import com.azulyoro.back.dto.response.CargaResponseDto;
import com.azulyoro.back.exception.CannotDeleteEntityException;
import com.azulyoro.back.mapper.CargaMapper;
import com.azulyoro.back.mapper.PageMapper;
import com.azulyoro.back.model.Carga;
import com.azulyoro.back.repository.CargaRepository;
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
    private CargaRepository ciudadRepository;

    @Autowired
    private CargaMapper ciudadMapper;

    @Autowired
    private PageMapper pageMapper;

    @Override
    public CargaResponseDto create(CargaRequestDto ciudadDto) {
        Carga ciudad = ciudadMapper.dtoToEntity(ciudadDto);
        return ciudadMapper.entityToDto(ciudadRepository.save(ciudad));
    }

    @Override
    public CargaResponseDto update(Long id, CargaRequestDto ciudadDto) {
        if (ciudadRepository.existsById(id)) {
            Carga ciudad = ciudadMapper.dtoToEntity(ciudadDto);
            ciudad.setId(id);
            return ciudadMapper.entityToDto(ciudadRepository.save(ciudad));
        } else {
            throw new EntityNotFoundException(MessageUtil.entityNotFound(id));
        }
    }

    @Override
    public CargaResponseDto getById(Long id) {
        Carga ciudad = ciudadRepository
                .findById(id)
                .orElseThrow(() -> new EntityNotFoundException(MessageUtil.entityNotFound(id)));
        return ciudadMapper.entityToDto(ciudad);
    }

    @Override
    public List<CargaResponseDto> getAll() {
        return ciudadRepository
                .findAll()
                .stream()
                .map(ciudadMapper::entityToDto)
                .toList();
    }

    @Override
    public CustomPage<CargaResponseDto> getByPage(Pageable pageable) {
        Page<CargaResponseDto> page = ciudadRepository
                .findAll(pageable)
                .map(ciudadMapper::entityToDto);
        return pageMapper.pageToCustomPage(page);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        try {
            ciudadRepository.softDelete(id);
        } catch (Exception e) {
            throw new CannotDeleteEntityException(MessageUtil.entityCannotDelete(id, e.getMessage()));
        }
    }

    public Carga findById(Long id) {
        return ciudadRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(MessageUtil.entityNotFound(id)));
    }
}
