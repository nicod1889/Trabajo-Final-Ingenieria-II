package com.azulyoro.back.service;

import com.azulyoro.back.dto.CustomPage;
import com.azulyoro.back.dto.request.ServicesRequestDto;
import com.azulyoro.back.dto.response.ServicesResponseDto;
import com.azulyoro.back.exception.CannotDeleteEntityException;
import com.azulyoro.back.exception.EntityNotFoundOrInactiveException;
import com.azulyoro.back.mapper.ClienteMapper;
import com.azulyoro.back.mapper.Mapper;
import com.azulyoro.back.mapper.PageMapper;
import com.azulyoro.back.model.*;
import com.azulyoro.back.repository.ServicesRepository;
import com.azulyoro.back.util.MessageUtil;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class ServicesService implements EntityService<ServicesRequestDto, ServicesResponseDto> {
    private class RelatedEntites{
        public Cliente cliente;
        public Vehicle vehicle;
        public List<Empleado> empleados;
        public ServiceType serviceType;
    }
    @Autowired
    private ServicesRepository servicesRepository;

    @Autowired
    private ClienteService clienteService;

    @Autowired
    private VehicleService vehicleService;

    @Autowired
    private IEmpleadoService empleadoService;

    @Autowired
    private ServiceTypeService serviceTypeService;

    @Autowired
    private Mapper<Services, ServicesRequestDto, ServicesResponseDto> servicesMapper;

    @Autowired
    private ClienteMapper clienteMapper;
    @Autowired
    private PageMapper pageMapper;

    @Override
    public ServicesResponseDto create(ServicesRequestDto requestDto) {
        if(requestDto.getStatus() == null) requestDto.setStatus(ServiceStatus.TO_DO);
        return saveAndGetResponseDto(null, requestDto);
    }

    @Override
    public ServicesResponseDto update(Long id, ServicesRequestDto requestDto) {
        if(servicesRepository.existsById(id)) {
            return saveAndGetResponseDto(id, requestDto);
        }else{
            throw new EntityNotFoundException(MessageUtil.entityNotFound(id));
        }
    }

    @Override
    public ServicesResponseDto getById(Long id) {
        Services service = servicesRepository
                .findById(id)
                .orElseThrow(()-> new EntityNotFoundException(MessageUtil.entityNotFound(id)));

        return setClientesAndGetResponseDto(service);
    }

    @Override
    public List<ServicesResponseDto> getAll() {
        return servicesRepository
                .findAll()
                .stream()
                .map(this::setClientesAndGetResponseDto)
                .toList();
    }

    @Override
    public CustomPage<ServicesResponseDto> getByPage(Pageable pageable) {
        Page<ServicesResponseDto> page = servicesRepository
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

    private RelatedEntites validateRelatedEntities(ServicesRequestDto servicesRequestDto){
        RelatedEntites relatedEntites = new RelatedEntites();
        relatedEntites.cliente = validateAndGetCliente(servicesRequestDto.getClienteId());
        relatedEntites.vehicle = validateAndGetVehicle(servicesRequestDto.getVehicleId());
        relatedEntites.empleados = validateAndGetEmpleados(servicesRequestDto.getEmpleadosIds());
        relatedEntites.serviceType = validateAndGetServiceType(servicesRequestDto.getServiceTypeId());

        return relatedEntites;
    }

    private ServiceType validateAndGetServiceType(Long id) {
        var serviceType = serviceTypeService.findById(id);

        if(serviceType.isEmpty() || serviceType.get().isDeleted())
            throw new EntityNotFoundOrInactiveException(MessageUtil.entityNotFoundOrInactive(id));

        return serviceType.get();
    }

    private List<Empleado> validateAndGetEmpleados(List<Long> listIds) {
        return Optional.ofNullable(listIds)
                .orElse(Collections.emptyList())
                .stream()
                .map(this::validateAndGetEmpleado)
                .toList();
    }

    private Vehicle validateAndGetVehicle(Long id) {
        var vehicle = vehicleService.findById(id);

        if(vehicle.isEmpty() || vehicle.get().isDeleted())
            throw new EntityNotFoundOrInactiveException(MessageUtil.entityNotFoundOrInactive(id));

        return vehicle.get();
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

    private ServicesResponseDto setClientesAndGetResponseDto(Services service){
        var response = servicesMapper.entityToDto(service);
        response.setCliente(clienteMapper.entityToBasicDto(service.getCliente()));

        return response;
    }

    private ServicesResponseDto saveAndGetResponseDto(Long id, ServicesRequestDto requestDto){
        Services service = servicesMapper.dtoToEntity(requestDto);
        service.setId(id);

        LocalDate startDate = servicesRepository.findStartDateById(id);
        if(requestDto.getStatus() == ServiceStatus.IN_PROGRESS && startDate == null){
            service.setStartDate(LocalDate.now());
        } else{
            service.setStartDate(startDate);
        }

        if(requestDto.getStatus() == ServiceStatus.FINISHED){
            service.setFinalDate(LocalDate.now());
        } else {
            service.setFinalDate(null);
        }

        RelatedEntites relatedEntites = validateRelatedEntities(requestDto);
        service.setCliente(relatedEntites.cliente);
        service.setVehicle(relatedEntites.vehicle);
        service.setEmpleados(relatedEntites.empleados);
        service.setServiceType(relatedEntites.serviceType);

        return setClientesAndGetResponseDto(servicesRepository.save(service));
    }
}
