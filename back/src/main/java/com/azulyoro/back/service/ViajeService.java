package com.azulyoro.back.service;

import com.azulyoro.back.dto.CustomPage;
import com.azulyoro.back.dto.request.ViajeRequestDto;
import com.azulyoro.back.dto.response.ViajeResponseDto;
import com.azulyoro.back.exception.CannotDeleteEntityException;
import com.azulyoro.back.exception.EntityNotFoundOrInactiveException;
import com.azulyoro.back.mapper.ClienteMapper;
import com.azulyoro.back.mapper.Mapper;
import com.azulyoro.back.mapper.PageMapper;
import com.azulyoro.back.model.*;
import com.azulyoro.back.repository.ViajeRepository;
import com.azulyoro.back.util.MessageUtil;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ViajeService implements EntityService<ViajeRequestDto, ViajeResponseDto> {
    private class RelatedEntites{
        public Cliente cliente;
        public Camion camion;
        public Empleado empleado;
    }
    
    @Autowired
    private ViajeRepository servicesRepository;

    @Autowired
    private ClienteService clienteService;

    @Autowired
    private CamionService camionService;

    @Autowired
    private IEmpleadoService empleadoService;

    @Autowired
    private Mapper<Viaje, ViajeRequestDto, ViajeResponseDto> servicesMapper;

    @Autowired
    private ClienteMapper clienteMapper;
    
    @Autowired
    private PageMapper pageMapper;

    @Override
    public ViajeResponseDto create(ViajeRequestDto requestDto) {
        if(requestDto.getEstado() == null) requestDto.setEstado(ServiceStatus.TO_DO);
        return saveAndGetResponseDto(null, requestDto);
    }

    @Override
    public ViajeResponseDto update(Long id, ViajeRequestDto requestDto) {
        if(servicesRepository.existsById(id)) {
            return saveAndGetResponseDto(id, requestDto);
        }else{
            throw new EntityNotFoundException(MessageUtil.entityNotFound(id));
        }
    }

    @Override
    public ViajeResponseDto getById(Long id) {
        Viaje service = servicesRepository
                .findById(id)
                .orElseThrow(()-> new EntityNotFoundException(MessageUtil.entityNotFound(id)));

        return setClientesAndGetResponseDto(service);
    }

    @Override
    public List<ViajeResponseDto> getAll() {
        return servicesRepository
                .findAll()
                .stream()
                .map(this::setClientesAndGetResponseDto)
                .toList();
    }

    @Override
    public CustomPage<ViajeResponseDto> getByPage(Pageable pageable) {
        Page<ViajeResponseDto> page = servicesRepository
                .findAll(pageable)
                .map(this::setClientesAndGetResponseDto);

        return pageMapper.pageToCustomPage(page);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        try {
            servicesRepository.softDelete(id);
        } catch (Exception e) {
            throw new CannotDeleteEntityException(MessageUtil.entityCannotDelete(id, e.getMessage()));
        }
    }

    private RelatedEntites validateRelatedEntities(ViajeRequestDto servicesRequestDto){
        RelatedEntites relatedEntites = new RelatedEntites();
        relatedEntites.cliente = validateAndGetCliente(servicesRequestDto.getClienteId());
        relatedEntites.camion = validateAndGetCamion(servicesRequestDto.getCamionId());
        relatedEntites.empleado = validateAndGetEmpleado(servicesRequestDto.getEmpleadoId());

        return relatedEntites;
    }

    private Camion validateAndGetCamion(Long id) {
        var camion = camionService.findById(id);

        if(camion.isEmpty() || camion.get().isDeleted())
            throw new EntityNotFoundOrInactiveException(MessageUtil.entityNotFoundOrInactive(id));

        return camion.get();
    }

    private Cliente validateAndGetCliente(Long id) {
        var cliente = clienteService.findById(id);

        if(cliente.isEmpty() || cliente.get().isDeleted())
            throw new EntityNotFoundOrInactiveException(MessageUtil.entityNotFoundOrInactive(id));

        return cliente.get();
    }

    private Empleado validateAndGetEmpleado(Long id) {
        var empleado = empleadoService.findById(id);

        if(empleado.isEmpty() || empleado.get().isDeleted())
            throw new EntityNotFoundOrInactiveException(MessageUtil.entityNotFoundOrInactive(id));

        return empleado.get();
    }

    private ViajeResponseDto setClientesAndGetResponseDto(Viaje service){
        var response = servicesMapper.entityToDto(service);
        response.setCliente(clienteMapper.entityToBasicDto(service.getCliente()));

        return response;
    }

    private ViajeResponseDto saveAndGetResponseDto(Long id, ViajeRequestDto requestDto){
        Viaje service = servicesMapper.dtoToEntity(requestDto);
        service.setId(id);

        LocalDate startDate = servicesRepository.findFechaSalidaById(id);
        if (requestDto.getEstado() == ServiceStatus.IN_PROGRESS && startDate == null) {
            service.setFechaSalida(LocalDate.now());
        } else {
            service.setFechaSalida(startDate);
        }

        if(requestDto.getEstado() == ServiceStatus.FINISHED){
            service.setFechaEstimadaEntrega(LocalDate.now());
        } else {
            service.setFechaEstimadaEntrega(null);
        }

        RelatedEntites relatedEntites = validateRelatedEntities(requestDto);
        service.setCliente(relatedEntites.cliente);
        service.setCamion(relatedEntites.camion);
        service.setEmpleado(relatedEntites.empleado);

        return setClientesAndGetResponseDto(servicesRepository.save(service));
    }
}
