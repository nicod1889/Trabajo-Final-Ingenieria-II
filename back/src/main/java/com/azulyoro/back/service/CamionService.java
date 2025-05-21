package com.azulyoro.back.service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import com.azulyoro.back.dto.CustomPage;
import com.azulyoro.back.dto.request.CamionRequestDto;
import com.azulyoro.back.dto.response.ViajeForCamionDto;
import com.azulyoro.back.dto.response.CamionResponseDto;
import com.azulyoro.back.exception.CannotDeleteEntityException;
import com.azulyoro.back.mapper.ClienteMapper;
import com.azulyoro.back.mapper.PageMapper;
import com.azulyoro.back.mapper.ViajeMapper;
import com.azulyoro.back.mapper.CamionMapper;
import org.springframework.stereotype.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister.NotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.azulyoro.back.model.Camion;
import com.azulyoro.back.model.Marca;
import com.azulyoro.back.repository.CamionRepository;
import com.azulyoro.back.repository.MarcaRepository;
import com.azulyoro.back.util.MessageUtil;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

@Service
public class CamionService implements EntityService<CamionRequestDto, CamionResponseDto> {

    @Autowired
    private CamionRepository camionRepository;

    @Autowired
    private MarcaRepository marcaRepository;

    @Autowired
    private CamionMapper camionMapper;
    @Autowired
    private ViajeMapper viajeMapper;
    @Autowired
    private ClienteMapper clienteMapper;
    @Autowired
    private PageMapper pageMapper;

    @Override
    public CamionResponseDto create(CamionRequestDto camionDto) {
        Marca marca = marcaRepository.findById(camionDto.getMarcaId())
        .orElseThrow(() -> new EntityNotFoundException("Marca no encontrada con id " + camionDto.getMarcaId()));

        Camion camion = camionMapper.dtoToEntity(camionDto);
        camion.setMarca(marca);

        return setViajeAndGetResponseDto(camionRepository.save(camion));
    }

    @Override
    public CamionResponseDto update(Long id, CamionRequestDto camionDto) {
        if (camionRepository.existsById(id)) {
            Marca marca = marcaRepository.findById(camionDto.getMarcaId())
            .orElseThrow(() -> new EntityNotFoundException("Marca no encontrada con id " + camionDto.getMarcaId()));
            
            Camion camion = camionMapper.dtoToEntity(camionDto);
            camion.setMarca(marca);
            camion.setId(id);

            return setViajeAndGetResponseDto(camionRepository.save(camion));
        } else {
            throw new EntityNotFoundException(MessageUtil.entityNotFound(id));
        }
    }

    @Override
    public CamionResponseDto getById(Long id) {
        Camion camion = camionRepository
                .findById(id)
                .orElseThrow(() -> new EntityNotFoundException(MessageUtil.entityNotFound(id)));

        return setViajeAndGetResponseDto(camion);
    }

    @Override
    public List<CamionResponseDto> getAll() {
        return camionRepository
                .findAll()
                .stream()
                .map(this::setViajeAndGetResponseDto)
                .toList();
    }

    @Override
    public CustomPage<CamionResponseDto> getByPage(Pageable pageable) {
        Page<CamionResponseDto> page = camionRepository
                .findAll(pageable)
                .map(this::setViajeAndGetResponseDto);

        return pageMapper.pageToCustomPage(page);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        try {
            camionRepository.softDelete(id);
        } catch (Exception e) {
            throw new CannotDeleteEntityException(MessageUtil.entityCannotDelete(id, e.getMessage()));
        }
    }

    public Optional<Camion> findById(Long id) {
        return camionRepository.findById(id);
    }

    private CamionResponseDto setViajeAndGetResponseDto(Camion camion){
        var response = camionMapper.entityToDto(camion);
        response.setViaje(getViajeForCamion(camion));
        return response;
    }

    public List<ViajeForCamionDto> getViajeForCamion(Camion camion) {
        if (camion.getViajes() == null) {
            return Collections.emptyList();
        }
        return camion.getViajes()
                .stream()
                .map( e -> {
                    ViajeForCamionDto viaje = viajeMapper.entityToViajeForCamionDto(e);
                    viaje.setCliente(clienteMapper.entityToBasicDto(e.getCliente()));
                    return viaje;
                })
                .toList();
    }
}
