package com.azulyoro.back.service;

import com.azulyoro.back.dto.CustomPage;
import com.azulyoro.back.dto.request.TipoCargaRequestDto;
import com.azulyoro.back.dto.response.TipoCargaResponseDto;
import com.azulyoro.back.exception.CannotDeleteEntityException;
import com.azulyoro.back.mapper.PageMapper;
import com.azulyoro.back.mapper.TipoCargaMapper;
import com.azulyoro.back.model.TipoCarga;
import com.azulyoro.back.repository.TipoCargaRepository;
import com.azulyoro.back.util.MessageUtil;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TipoCargaService implements EntityService<TipoCargaRequestDto, TipoCargaResponseDto> {
    @Autowired
    private TipoCargaRepository tipoCargaRepository;

    @Autowired
    private TipoCargaMapper tipoCargaMapper;

    @Autowired
    private PageMapper pageMapper;

    @Override
    public TipoCargaResponseDto create(TipoCargaRequestDto typeServiceDto) {
        TipoCarga tipoCarga = tipoCargaRepository.save(tipoCargaMapper.dtoToEntity(typeServiceDto));
        return tipoCargaMapper.entityToDto(tipoCarga);
    }

    @Override
    public TipoCargaResponseDto update(Long id, TipoCargaRequestDto dto) {
        if (tipoCargaRepository.existsById(id)) {
            TipoCarga tipoCarga = tipoCargaMapper.dtoToEntity(dto);
            tipoCarga.setId(id);

            TipoCarga tipoCargaUpdated = tipoCargaRepository.save(tipoCarga);
            return tipoCargaMapper.entityToDto(tipoCargaUpdated);
        } else {
           throw new EntityNotFoundException(MessageUtil.entityNotFound(id));
        }
    }

    @Override
    public TipoCargaResponseDto getById(Long id) {
        TipoCarga tipoCarga = tipoCargaRepository
                .findById(id)
                .orElseThrow(()-> new EntityNotFoundException(MessageUtil.entityNotFound(id)));

        return tipoCargaMapper.entityToDto(tipoCarga);
    }

    @Override
    public List<TipoCargaResponseDto> getAll() {
        return tipoCargaRepository
                .findAll()
                .stream()
                .map(tipoCargaMapper::entityToDto)
                .toList();
    }

    @Override
    public CustomPage<TipoCargaResponseDto> getByPage(Pageable pageable) {
        Page<TipoCargaResponseDto> page = tipoCargaRepository
                .findAll(pageable)
                .map(tipoCargaMapper::entityToDto);

        return pageMapper.pageToCustomPage(page);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        try {
            tipoCargaRepository.softDelete(id);
        } catch (Exception e) {
            throw new CannotDeleteEntityException(MessageUtil.entityCannotDelete(id, e.getMessage()));
        }
    }

    public Optional<TipoCarga> findById(Long id) {
        return tipoCargaRepository.findById(id);
    }
}