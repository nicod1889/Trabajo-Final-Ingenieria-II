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

    @Autowired
    private ViajeRepository viajeRepository;

    @Autowired
    private ClienteService clienteService;

    @Autowired
    private CamionService camionService;

    @Autowired
    private EmpleadoService empleadoService;

    @Autowired
    private Mapper<Viaje, ViajeRequestDto, ViajeResponseDto> viajeMapper;

    @Autowired
    private ClienteMapper clienteMapper;

    @Autowired
    private PageMapper pageMapper;

    @Override
    public ViajeResponseDto create(ViajeRequestDto requestDto) {
        if (requestDto.getEstado() == null) {
            requestDto.setEstado(ServiceStatus.TO_DO);
        }

        boolean ordenRepetida = viajeRepository.existsByNumOrden(requestDto.getNumOrden());
        if (ordenRepetida) {
            throw new IllegalStateException("Ya existe un viaje con ese número de orden.");
        }

        if (requestDto.getFechaEstimadaEntrega().isBefore(requestDto.getFechaSalida())) {
            throw new IllegalArgumentException("La fecha estimada de entrega no puede ser anterior a la fecha de salida.");
        }

        boolean camionOcupado = viajeRepository.existsByCamionIdAndEstadoIn(
            requestDto.getCamionId(),
            List.of(ServiceStatus.TO_DO, ServiceStatus.IN_PROGRESS)
        );
        if (camionOcupado) {
            throw new IllegalStateException("El camión seleccionado no está disponible.");
        }

        boolean empleadoOcupado = viajeRepository.existsByEmpleadoIdAndEstadoIn(
            requestDto.getEmpleadoId(),
            List.of(ServiceStatus.TO_DO, ServiceStatus.IN_PROGRESS)
        );
        if (empleadoOcupado) {
            throw new IllegalStateException("El conductor seleccionado no está disponible.");
        }

        return saveAndGetResponseDto(null, requestDto);
    }

    @Override
    public ViajeResponseDto update(Long id, ViajeRequestDto requestDto) {
        Viaje viajeActual = viajeRepository.findById(id)
        .orElseThrow(() -> new EntityNotFoundException(MessageUtil.entityNotFound(id)));

        if (viajeActual.getEstado() == ServiceStatus.FINISHED) {
            throw new IllegalStateException("No se puede modificar un viaje que ya fue finalizado.");
        }

        if (requestDto.getEstado() == null) {
            requestDto.setEstado(ServiceStatus.TO_DO);
        }

        boolean ordenRepetida = viajeRepository.existsByNumOrdenAndIdNot(requestDto.getNumOrden(), id);
        if (ordenRepetida) {
            throw new IllegalStateException("Ya existe un viaje con ese número de orden.");
        }

        if (requestDto.getFechaEstimadaEntrega().isBefore(requestDto.getFechaSalida())) {
            throw new IllegalArgumentException("La fecha estimada de entrega no puede ser anterior a la fecha de salida.");
        }

        boolean camionOcupado = viajeRepository.existsByCamionIdAndEstadoInAndIdNot(
            requestDto.getCamionId(),
            List.of(ServiceStatus.TO_DO, ServiceStatus.IN_PROGRESS),
            id
        );
        if (camionOcupado) {
            throw new IllegalStateException("El camión seleccionado no está disponible.");
        }

        boolean empleadoOcupado = viajeRepository.existsByEmpleadoIdAndEstadoInAndIdNot(
            requestDto.getEmpleadoId(),
            List.of(ServiceStatus.TO_DO, ServiceStatus.IN_PROGRESS),
            id
        );
        if (empleadoOcupado) {
            throw new IllegalStateException("El conductor seleccionado no está disponible.");
        }

        return saveAndGetResponseDto(id, requestDto);
    }

    @Override
    public ViajeResponseDto getById(Long id) {
        Viaje viaje = viajeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(MessageUtil.entityNotFound(id)));
        return setClienteAndGetResponseDto(viaje);
    }

    @Override
    public List<ViajeResponseDto> getAll() {
        return viajeRepository.findAll()
                .stream()
                .map(this::setClienteAndGetResponseDto)
                .toList();
    }

    @Override
    public CustomPage<ViajeResponseDto> getByPage(Pageable pageable) {
        Page<ViajeResponseDto> page = viajeRepository.findAll(pageable)
                .map(this::setClienteAndGetResponseDto);
        return pageMapper.pageToCustomPage(page);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        try {
            viajeRepository.softDelete(id);
        } catch (Exception e) {
            throw new CannotDeleteEntityException(MessageUtil.entityCannotDelete(id, e.getMessage()));
        }
    }

    private ViajeResponseDto setClienteAndGetResponseDto(Viaje viaje){
        var response = viajeMapper.entityToDto(viaje);
        response.setCliente(clienteMapper.entityToBasicDto(viaje.getCliente()));
        return response;
    }

    private ViajeResponseDto saveAndGetResponseDto(Long id, ViajeRequestDto requestDto){
        Viaje viaje = viajeMapper.dtoToEntity(requestDto);
        viaje.setId(id);

        Cliente cliente = clienteService.findByIdOrThrow(requestDto.getClienteId());
        Camion camion = camionService.findByIdOrThrow(requestDto.getCamionId());
        Empleado empleado = null;
        if(requestDto.getEmpleadoId() != null)
            empleado = empleadoService.findByIdOrThrow(requestDto.getEmpleadoId());

        viaje.setCliente(cliente);
        viaje.setCamion(camion);
        viaje.setEmpleado(empleado);

        return setClienteAndGetResponseDto(viajeRepository.save(viaje));
    }
}
