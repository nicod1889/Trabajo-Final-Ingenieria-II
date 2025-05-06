package com.azulyoro.back.service;

import com.azulyoro.back.dto.CustomPage;
import com.azulyoro.back.dto.request.CiudadRequestDto;
import com.azulyoro.back.dto.response.CiudadResponseDto;
import com.azulyoro.back.exception.CannotDeleteEntityException;
import com.azulyoro.back.mapper.CiudadMapper;
import com.azulyoro.back.mapper.PageMapper;
import com.azulyoro.back.model.Ciudad;
import com.azulyoro.back.repository.CiudadRepository;
import com.azulyoro.back.util.MessageUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

import java.util.List;

@Service
public class CiudadService implements EntityService<CiudadRequestDto, CiudadResponseDto> {

    @Autowired
    private CiudadRepository ciudadRepository;

    @Autowired
    private CiudadMapper ciudadMapper;

    @Autowired
    private PageMapper pageMapper;

    @Override
    public CiudadResponseDto create(CiudadRequestDto ciudadDto) {
        Ciudad ciudad = ciudadMapper.dtoToEntity(ciudadDto);
        return ciudadMapper.entityToDto(ciudadRepository.save(ciudad));
    }

    @Override
    public CiudadResponseDto update(Long id, CiudadRequestDto ciudadDto) {
        if (ciudadRepository.existsById(id)) {
            Ciudad ciudad = ciudadMapper.dtoToEntity(ciudadDto);
            ciudad.setId(id);
            return ciudadMapper.entityToDto(ciudadRepository.save(ciudad));
        } else {
            throw new EntityNotFoundException(MessageUtil.entityNotFound(id));
        }
    }

    @Override
    public CiudadResponseDto getById(Long id) {
        Ciudad ciudad = ciudadRepository
                .findById(id)
                .orElseThrow(() -> new EntityNotFoundException(MessageUtil.entityNotFound(id)));
        return ciudadMapper.entityToDto(ciudad);
    }

    @Override
    public List<CiudadResponseDto> getAll() {
        return ciudadRepository
                .findAll()
                .stream()
                .map(ciudadMapper::entityToDto)
                .toList();
    }

    @Override
    public CustomPage<CiudadResponseDto> getByPage(Pageable pageable) {
        Page<CiudadResponseDto> page = ciudadRepository
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

    public Ciudad findById(Long id) {
        return ciudadRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(MessageUtil.entityNotFound(id)));
    }
}
