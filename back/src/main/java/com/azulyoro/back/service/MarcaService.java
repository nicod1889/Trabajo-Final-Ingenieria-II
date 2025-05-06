package com.azulyoro.back.service;

import com.azulyoro.back.dto.CustomPage;
import com.azulyoro.back.dto.request.MarcaRequestDto;
import com.azulyoro.back.dto.response.MarcaResponseDto;
import com.azulyoro.back.exception.CannotDeleteEntityException;
import com.azulyoro.back.mapper.MarcaMapper;
import com.azulyoro.back.mapper.PageMapper;
import com.azulyoro.back.model.Marca;
import com.azulyoro.back.repository.MarcaRepository;
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
public class MarcaService implements EntityService<MarcaRequestDto, MarcaResponseDto> {
    @Autowired
    private MarcaRepository marcaRepository;

    @Autowired
    private MarcaMapper marcaMapper;

    @Autowired
    private PageMapper pageMapper;

    @Override
    public MarcaResponseDto create(MarcaRequestDto marcaDto) {
        Marca marca = marcaRepository.save(marcaMapper.dtoToEntity(marcaDto));
        return marcaMapper.entityToDto(marca);
    }

    @Override
    public MarcaResponseDto update(Long id, MarcaRequestDto dto) {

        if(marcaRepository.existsById(id)) {
            Marca marca = marcaMapper.dtoToEntity(dto);
            marca.setId(id);

            Marca marcaUpdated = marcaRepository.save(marca);

            return marcaMapper.entityToDto(marcaUpdated);
        } else {
            throw new EntityNotFoundException(MessageUtil.entityNotFound(id));
        }
    }

    @Override
    public MarcaResponseDto getById(Long id) {
        Marca marca = marcaRepository
                .findById(id)
                .orElseThrow(() -> new EntityNotFoundException(MessageUtil.entityNotFound(id)));

        return marcaMapper.entityToDto(marca);
    }

    @Override
    public List<MarcaResponseDto> getAll() {
        return marcaRepository
                .findAll()
                .stream()
                .map(marcaMapper::entityToDto)
                .toList();
    }

    @Override
    public CustomPage<MarcaResponseDto> getByPage(Pageable pageable) {
        Page<MarcaResponseDto> page = marcaRepository
                .findAll(pageable)
                .map(marcaMapper::entityToDto);

        return pageMapper.pageToCustomPage(page);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        try {
            marcaRepository.softDelete(id);
        } catch (Exception e) {
            throw new CannotDeleteEntityException(MessageUtil.entityCannotDelete(id, e.getMessage()));
        }
    }

    public Optional<Marca> getMarcaEntity(Long id) {
        return marcaRepository.findById(id);
    }
}